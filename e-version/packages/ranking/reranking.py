"""Reranker — sorts retrieved chunks by final ranking score."""

from __future__ import annotations

from typing import Any, Protocol, runtime_checkable


@runtime_checkable
class Rankable(Protocol):
    final_score: float


class Reranker:
    """
    Sorts a list of ranked items by their final_score in descending order.

    Can optionally apply a cross-encoder or LLM-based reranking pass
    in the future; today it sorts deterministically by pre-computed scores.
    """

    def __init__(self, top_k: int = 20) -> None:
        self.top_k = top_k

    def rerank(self, items: list[Any]) -> list[Any]:
        """
        Return top_k items sorted by final_score descending.

        Items must have a numeric `final_score` attribute.
        """
        sorted_items = sorted(items, key=lambda x: getattr(x, "final_score", 0.0), reverse=True)
        return sorted_items[: self.top_k]

    def rerank_dicts(self, items: list[dict[str, Any]], score_key: str = "final_score") -> list[dict[str, Any]]:
        """Rerank a list of dicts using a named score key."""
        sorted_items = sorted(items, key=lambda x: x.get(score_key, 0.0), reverse=True)
        return sorted_items[: self.top_k]
