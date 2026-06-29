"""Lexical search — BM25 / keyword search for exact matches and config snippets."""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


class LexicalSearch:
    """
    Performs BM25 / full-text keyword search.

    In production: queries OpenSearch/Elasticsearch/Meilisearch.
    Especially effective for:
      - device names and IP addresses
      - file paths and config keys
      - code and config snippets
      - symbol-heavy content
    """

    def __init__(self, search_index=None) -> None:
        self.search_index = search_index

    def search(
        self,
        query: str,
        tenant_id: str,
        user_id: str,
        top_k: int = 20,
        filters: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Return top_k chunks ranked by BM25 relevance.

        Each result dict contains: chunk_id, document_id, content, lexical_score,
        source, section, metadata.
        """
        if self.search_index is None:
            logger.debug("No search index configured — returning empty results.")
            return []

        return self.search_index.search(
            query=query,
            tenant_id=tenant_id,
            user_id=user_id,
            top_k=top_k,
            filters=filters or {},
        )

    def in_memory_bm25(self, query: str, chunks: list[dict[str, Any]], top_k: int = 20) -> list[dict[str, Any]]:
        """
        Minimal in-memory BM25-like scoring for development / testing.

        Uses term frequency as a proxy. Replace with a real BM25 library
        (e.g., rank_bm25) in production.
        """
        query_terms = set(query.lower().split())
        scored: list[tuple[float, dict[str, Any]]] = []

        for chunk in chunks:
            content = chunk.get("content", "").lower()
            terms = content.split()
            tf = sum(1 for t in terms if t in query_terms)
            score = tf / max(len(terms), 1)
            scored.append((score, chunk))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, chunk in scored[:top_k]:
            result = dict(chunk)
            result["lexical_score"] = round(score, 4)
            results.append(result)
        return results
