"""Reranker — applies the PCE ranking formula to merge and sort retrieval results."""

from __future__ import annotations

from typing import Any

from packages.ranking.scoring import RankingScorer
from packages.ranking.reranking import Reranker as BaseReranker


class RetrievalReranker:
    """
    Merges vector and lexical search results, applies trust/freshness scoring,
    and returns the top-k chunks by final ranking score.
    """

    def __init__(self, top_k: int = 20) -> None:
        self._scorer = RankingScorer()
        self._reranker = BaseReranker(top_k=top_k)
        self.top_k = top_k

    def rerank(
        self,
        semantic_results: list[dict[str, Any]],
        lexical_results: list[dict[str, Any]],
        graph_expansion: dict[str, Any] | None = None,
        session_entity_ids: list[str] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Merge, score, and rank all retrieval results.

        1. Merge by chunk_id (dedup)
        2. Score each chunk using the ranking formula
        3. Sort descending by final_score
        4. Return top_k
        """
        merged = self._merge(semantic_results, lexical_results)
        graph = graph_expansion or {}
        expanded_ids = [e.get("id", "") for e in graph.get("expanded_entities", [])]
        graph_relevance = graph.get("graph_relevance", {})
        session_ids = set(session_entity_ids or [])

        for chunk in merged:
            entity_ids = chunk.get("entity_ids", [])
            semantic_score = chunk.get("semantic_score", 0.0)
            lexical_score = chunk.get("lexical_score", 0.0)
            trust_level = chunk.get("trust_level", "source_backed")
            last_updated = chunk.get("updated_at")

            # Graph relevance: max relevance of chunk's entities in graph
            g_rel = max((graph_relevance.get(eid, 0.0) for eid in entity_ids), default=0.0)

            # Entity overlap with session entities
            e_overlap = len(set(entity_ids) & session_ids) / max(len(entity_ids), 1) if entity_ids else 0.0

            # Session relevance: fraction of entity_ids that are in session
            sess_rel = len(set(entity_ids) & session_ids) / max(len(session_ids), 1) if session_ids else 0.0

            scores = self._scorer.compute(
                semantic_score=semantic_score,
                lexical_score=lexical_score,
                entity_overlap=e_overlap,
                graph_relevance=g_rel,
                trust_level=trust_level,
                last_updated=last_updated,
                session_relevance=sess_rel,
            )
            chunk["final_score"] = round(scores.final(), 4)

        return self._reranker.rerank_dicts(merged)

    def _merge(
        self, semantic: list[dict[str, Any]], lexical: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        """Merge two result lists, deduplicating by chunk_id."""
        seen: dict[str, dict[str, Any]] = {}
        for r in semantic:
            cid = r.get("chunk_id", "")
            seen[cid] = {**r, "semantic_score": r.get("semantic_score", 0.0), "lexical_score": 0.0}
        for r in lexical:
            cid = r.get("chunk_id", "")
            if cid in seen:
                seen[cid]["lexical_score"] = r.get("lexical_score", 0.0)
            else:
                seen[cid] = {**r, "semantic_score": 0.0, "lexical_score": r.get("lexical_score", 0.0)}
        return list(seen.values())
