"""Context Builder — assembles the layered model context from retrieval results."""

from __future__ import annotations

from typing import Any


class ContextBuilder:
    """
    Assembles model context in ordered layers:

    1. Task/instruction context
    2. Relevant durable preferences
    3. Current session state
    4. High-trust structured facts
    5. Supporting retrieved chunks
    6. Conflicts / stale warnings
    7. Output requirements
    """

    def build(
        self,
        user_message: str,
        intent: str = "",
        facts: list[dict[str, Any]] | None = None,
        chunks: list[dict[str, Any]] | None = None,
        conflicts: list[dict[str, Any]] | None = None,
        session_memories: list[dict[str, Any]] | None = None,
        preferences: list[dict[str, Any]] | None = None,
        stale_warnings: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Return a structured context dict ready for prompt assembly.

        Order matters: the most authoritative information appears first.
        """
        return {
            "user_message": user_message,
            "intent": intent,
            "preferences": preferences or [],
            "session_memories": session_memories or [],
            "high_trust_facts": self._filter_by_trust(facts or [], min_trust_score=0.75),
            "supporting_chunks": chunks or [],
            "conflicts": conflicts or [],
            "stale_warnings": stale_warnings or [],
        }

    def _filter_by_trust(
        self, facts: list[dict[str, Any]], min_trust_score: float
    ) -> list[dict[str, Any]]:
        """Keep only facts at or above the minimum trust score threshold."""
        from packages.ranking.trust import TrustScorer

        scorer = TrustScorer()
        return [f for f in facts if scorer.score(f.get("trust_level", "inferred")) >= min_trust_score]

    def estimate_token_budget(
        self, context: dict[str, Any], max_tokens: int = 8000
    ) -> dict[str, Any]:
        """
        Trim context to fit within a token budget.

        Strategy: facts first → conflicts → session → chunks → raw excerpts only if space.
        This is a heuristic based on character count (≈4 chars per token).
        """
        budget = max_tokens * 4
        result: dict[str, Any] = {"user_message": context["user_message"], "intent": context["intent"]}

        def _chars(obj: Any) -> int:
            return len(str(obj))

        for key in ("preferences", "session_memories", "high_trust_facts", "conflicts", "stale_warnings"):
            items = context.get(key, [])
            kept = []
            for item in items:
                cost = _chars(item)
                if budget - cost > 0:
                    kept.append(item)
                    budget -= cost
            result[key] = kept

        chunks = context.get("supporting_chunks", [])
        kept_chunks = []
        for chunk in chunks:
            cost = _chars(chunk.get("content", ""))
            if budget - cost > 0:
                kept_chunks.append(chunk)
                budget -= cost
        result["supporting_chunks"] = kept_chunks

        return result
