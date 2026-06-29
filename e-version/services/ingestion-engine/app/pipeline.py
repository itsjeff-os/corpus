"""
Ingestion Pipeline — orchestrates the full ingestion flow.

Source → Fetch → Normalize → Dedupe → Chunk → Extract Entities/Facts → Embed → Index
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from packages.connectors.base import SourceConnector, FetchResult
from packages.schemas.documents import Document, DocumentStatus
from packages.schemas.chunks import Chunk, ChunkType

from .normalizer import Normalizer
from .deduper import Deduper
from .chunker import Chunker
from .entity_extractor import EntityExtractor
from .fact_extractor import FactExtractor

logger = logging.getLogger(__name__)


@dataclass
class IngestionResult:
    document_id: str
    chunk_count: int
    entity_count: int
    fact_count: int
    skipped_duplicate: bool = False
    errors: list[str] = field(default_factory=list)


class IngestionPipeline:
    """
    Runs the full ingestion pipeline for a single source document.

    Steps:
    1. Fetch (via connector)
    2. Normalize
    3. Deduplicate
    4. Chunk
    5. Extract entities
    6. Extract facts
    7. Embed (stub — requires embedding service)
    8. Index (stub — requires vector store + search index)
    9. Score trust
    10. Detect conflicts (stub — requires conflict detector)
    11. Store provenance
    """

    def __init__(
        self,
        embedding_service=None,
        vector_store=None,
        search_index=None,
        entity_store=None,
        fact_store=None,
        conflict_detector=None,
    ) -> None:
        self.normalizer = Normalizer()
        self.deduper = Deduper()
        self.chunker = Chunker()
        self.entity_extractor = EntityExtractor()
        self.fact_extractor = FactExtractor()
        self.embedding_service = embedding_service
        self.vector_store = vector_store
        self.search_index = search_index
        self.entity_store = entity_store
        self.fact_store = fact_store
        self.conflict_detector = conflict_detector

    def ingest(
        self,
        connector: SourceConnector,
        source_id: str,
        tenant_id: str,
        user_id: str,
    ) -> IngestionResult:
        """Run the full pipeline for a single source."""
        logger.info("Ingesting source: %s", source_id)
        errors: list[str] = []

        # 1. Fetch
        try:
            fetch_result: FetchResult = connector.fetch(source_id)
        except Exception as exc:
            logger.error("Fetch failed for %s: %s", source_id, exc)
            return IngestionResult(document_id="", chunk_count=0, entity_count=0, fact_count=0, errors=[str(exc)])

        # 2. Normalize
        normalized = self.normalizer.normalize(fetch_result.normalized_content, source_type=connector.source_type)

        # 3. Deduplicate
        content_hash = self.deduper.hash(normalized)
        if self.deduper.is_duplicate(normalized):
            logger.info("Duplicate detected for %s — skipping.", source_id)
            return IngestionResult(document_id="", chunk_count=0, entity_count=0, fact_count=0, skipped_duplicate=True)
        self.deduper.register(normalized)

        # Build Document record
        meta = fetch_result.metadata
        doc = Document(
            title=meta.title or source_id,
            source_uri=meta.source_uri,
            source_type=meta.source_type,
            tenant_id=tenant_id,
            user_id=user_id,
            content_hash=content_hash,
            parsed_text=normalized,
            status=DocumentStatus.INGESTING,
            permissions=connector.permissions(source_id),
        )

        # 4. Chunk
        if connector.source_type == "markdown":
            raw_chunks = self.chunker.chunk_markdown(normalized)
        else:
            raw_chunks = self.chunker.chunk_text(normalized)

        chunk_objects: list[Chunk] = []
        chunk_texts: list[str] = []
        for raw in raw_chunks:
            chunk = Chunk(
                document_id=doc.id,
                tenant_id=tenant_id,
                user_id=user_id,
                chunk_type=ChunkType.TEXT,
                content=raw.content,
                content_hash=self.deduper.hash(raw.content),
                chunk_index=raw.chunk_index,
                start_char=raw.start_char,
                end_char=raw.end_char,
                section=raw.section,
                heading_path=raw.heading_path or [],
            )
            chunk_objects.append(chunk)
            chunk_texts.append(raw.content)

        # 5. Extract entities
        entities = self.entity_extractor.extract_from_chunks(chunk_texts)

        # 6. Extract facts
        facts = self.fact_extractor.extract_from_chunks(chunk_texts, source=meta.source_uri)

        # 7. Embed (stub)
        if self.embedding_service:
            for chunk in chunk_objects:
                try:
                    chunk.embedding = self.embedding_service.embed(chunk.content)
                except Exception as exc:
                    errors.append(f"Embedding failed for chunk {chunk.id}: {exc}")

        # 8. Index (stub)
        if self.vector_store:
            for chunk in chunk_objects:
                try:
                    self.vector_store.upsert(chunk)
                except Exception as exc:
                    errors.append(f"Vector store upsert failed for chunk {chunk.id}: {exc}")

        if self.search_index:
            for chunk in chunk_objects:
                try:
                    self.search_index.index(chunk)
                except Exception as exc:
                    errors.append(f"Search index failed for chunk {chunk.id}: {exc}")

        # 9. Store entities and facts (stub)
        if self.entity_store:
            for entity in entities:
                try:
                    self.entity_store.upsert(entity, tenant_id=tenant_id, user_id=user_id)
                except Exception as exc:
                    errors.append(f"Entity store failed: {exc}")

        if self.fact_store:
            for fact in facts:
                try:
                    self.fact_store.upsert(fact, tenant_id=tenant_id, user_id=user_id)
                except Exception as exc:
                    errors.append(f"Fact store failed: {exc}")

        doc.status = DocumentStatus.INDEXED
        doc.chunk_count = len(chunk_objects)

        logger.info(
            "Ingested %s: %d chunks, %d entities, %d facts.",
            source_id,
            len(chunk_objects),
            len(entities),
            len(facts),
        )

        return IngestionResult(
            document_id=doc.id,
            chunk_count=len(chunk_objects),
            entity_count=len(entities),
            fact_count=len(facts),
            errors=errors,
        )
