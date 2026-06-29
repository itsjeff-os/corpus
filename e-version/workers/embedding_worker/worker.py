"""Embedding Worker — generates vector embeddings for chunks and facts."""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


class EmbeddingWorker:
    """
    Processes embedding jobs from the queue.

    For each chunk or fact, calls the embedding model and stores
    the resulting vector in the vector store (pgvector).
    """

    def __init__(self, embedding_model=None, vector_store=None) -> None:
        self.embedding_model = embedding_model
        self.vector_store = vector_store

    def process(self, job: dict[str, Any]) -> dict[str, Any]:
        """
        Process a single embedding job.

        Job schema: {type: "chunk"|"fact", id: str, content: str, tenant_id: str, user_id: str}
        """
        item_type = job.get("type", "chunk")
        item_id = job.get("id", "")
        content = job.get("content", "")

        if not content:
            return {"status": "skipped", "reason": "empty content", "id": item_id}

        if self.embedding_model is None:
            logger.warning("No embedding model configured — skipping job %s.", item_id)
            return {"status": "skipped", "reason": "no_model", "id": item_id}

        try:
            embedding = self.embedding_model.embed(content)
        except Exception as exc:
            logger.error("Embedding failed for %s %s: %s", item_type, item_id, exc)
            return {"status": "error", "error": str(exc), "id": item_id}

        if self.vector_store:
            try:
                self.vector_store.upsert_embedding(item_id, item_type, embedding)
            except Exception as exc:
                logger.error("Vector store upsert failed for %s: %s", item_id, exc)
                return {"status": "error", "error": str(exc), "id": item_id}

        return {"status": "ok", "id": item_id, "embedding_dim": len(embedding)}
