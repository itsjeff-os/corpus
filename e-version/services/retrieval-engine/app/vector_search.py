"""Vector search — semantic similarity search over chunk embeddings (pgvector)."""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


class VectorSearch:
    """
    Performs approximate nearest-neighbor search over chunk embeddings.

    In production: queries pgvector using the `<=>` cosine distance operator.
    Requires a vector store client injected at construction time.
    """

    def __init__(self, vector_store=None) -> None:
        self.vector_store = vector_store

    def search(
        self,
        query_embedding: list[float],
        tenant_id: str,
        user_id: str,
        top_k: int = 20,
        filters: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Return top_k chunks ranked by cosine similarity to the query embedding.

        Each result dict contains: chunk_id, document_id, content, semantic_score,
        entity_ids, fact_ids, source, section, trust_level, metadata.
        """
        if self.vector_store is None:
            logger.debug("No vector store configured — returning empty results.")
            return []

        return self.vector_store.similarity_search(
            embedding=query_embedding,
            tenant_id=tenant_id,
            user_id=user_id,
            top_k=top_k,
            filters=filters or {},
        )

    def embed_query(self, text: str) -> list[float]:
        """
        Embed a query string using the configured embedding model.

        In production: call the embedding model API (OpenAI, Cohere, local).
        """
        if self.vector_store and hasattr(self.vector_store, "embed"):
            return self.vector_store.embed(text)
        logger.warning("No embedding model configured — returning zero vector.")
        return [0.0] * 1536
