"""Retrieval Evaluator — measures precision, recall, and ranking quality."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class RetrievalMetrics:
    precision_at_k: float
    recall_at_k: float
    mean_reciprocal_rank: float
    ndcg_at_k: float
    stale_facts_ratio: float
    conflict_facts_ratio: float


class RetrievalEvaluator:
    """
    Evaluates retrieval quality against labeled relevance sets.

    Metrics:
    - Precision@K: fraction of top-K that are relevant
    - Recall@K: fraction of all relevant items in top-K
    - MRR: mean reciprocal rank of first relevant result
    - NDCG@K: normalized discounted cumulative gain
    - Stale fact ratio: fraction of retrieved facts that are stale
    - Conflict ratio: fraction of retrieved facts that are conflicted
    """

    def evaluate(
        self,
        retrieved_ids: list[str],
        relevant_ids: set[str],
        stale_ids: set[str] | None = None,
        conflict_ids: set[str] | None = None,
        k: int = 10,
    ) -> RetrievalMetrics:
        top_k = retrieved_ids[:k]
        relevant_in_top_k = [r for r in top_k if r in relevant_ids]

        precision = len(relevant_in_top_k) / k if k > 0 else 0.0
        recall = len(relevant_in_top_k) / len(relevant_ids) if relevant_ids else 0.0

        mrr = 0.0
        for i, r in enumerate(retrieved_ids, start=1):
            if r in relevant_ids:
                mrr = 1.0 / i
                break

        ndcg = self._ndcg(retrieved_ids, relevant_ids, k)

        stale_ratio = 0.0
        if stale_ids and top_k:
            stale_ratio = sum(1 for r in top_k if r in stale_ids) / len(top_k)

        conflict_ratio = 0.0
        if conflict_ids and top_k:
            conflict_ratio = sum(1 for r in top_k if r in conflict_ids) / len(top_k)

        return RetrievalMetrics(
            precision_at_k=round(precision, 4),
            recall_at_k=round(recall, 4),
            mean_reciprocal_rank=round(mrr, 4),
            ndcg_at_k=round(ndcg, 4),
            stale_facts_ratio=round(stale_ratio, 4),
            conflict_facts_ratio=round(conflict_ratio, 4),
        )

    def _ndcg(self, retrieved: list[str], relevant: set[str], k: int) -> float:
        import math

        def dcg(items: list[str], k: int) -> float:
            return sum(
                (1.0 if items[i] in relevant else 0.0) / math.log2(i + 2)
                for i in range(min(k, len(items)))
            )

        ideal_items = list(relevant) + [""] * k
        idcg = dcg(ideal_items, k)
        if idcg == 0:
            return 0.0
        return dcg(retrieved, k) / idcg
