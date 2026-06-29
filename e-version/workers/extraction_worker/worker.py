"""Extraction Worker — runs entity and fact extraction as async jobs."""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


class ExtractionWorker:
    """
    Processes entity and fact extraction jobs from the queue.

    Input: chunk content + document metadata
    Output: extracted entities and facts stored in their respective stores
    """

    def __init__(self, entity_store=None, fact_store=None) -> None:
        from services.ingestion_engine.app.entity_extractor import EntityExtractor
        from services.ingestion_engine.app.fact_extractor import FactExtractor
        self._entity_extractor = EntityExtractor()
        self._fact_extractor = FactExtractor()
        self.entity_store = entity_store
        self.fact_store = fact_store

    def process(self, job: dict[str, Any]) -> dict[str, Any]:
        """
        Process a single extraction job.

        Job schema:
          {chunk_id: str, content: str, source: str, tenant_id: str, user_id: str}
        """
        content = job.get("content", "")
        source = job.get("source", "unknown")
        tenant_id = job.get("tenant_id", "")
        user_id = job.get("user_id", "")

        entities = self._entity_extractor.extract(content)
        facts = self._fact_extractor.extract(content, source=source)

        entity_count = 0
        fact_count = 0

        if self.entity_store:
            for entity in entities:
                try:
                    self.entity_store.upsert(entity, tenant_id=tenant_id, user_id=user_id)
                    entity_count += 1
                except Exception as exc:
                    logger.error("Entity store failed: %s", exc)

        if self.fact_store:
            for fact in facts:
                try:
                    self.fact_store.upsert(fact, tenant_id=tenant_id, user_id=user_id)
                    fact_count += 1
                except Exception as exc:
                    logger.error("Fact store failed: %s", exc)

        return {"status": "ok", "entities": entity_count, "facts": fact_count}
