"""Trust scoring — maps trust levels to numeric scores for ranking."""

from __future__ import annotations

TRUST_WEIGHTS: dict[str, float] = {
    "pinned": 1.00,
    "canonical": 0.95,
    "machine_verified": 0.90,
    "user_confirmed": 0.85,
    "source_backed": 0.75,
    "derived": 0.60,
    "inferred": 0.45,
    "stale": 0.25,
    "conflicted": 0.15,
    "deprecated": 0.05,
}


class TrustScorer:
    """Converts a trust level string to a normalized [0, 1] score."""

    def __init__(self, weights: dict[str, float] | None = None) -> None:
        self.weights = weights or TRUST_WEIGHTS

    def score(self, trust_level: str) -> float:
        """Return a normalized trust score for a given trust level."""
        return self.weights.get(trust_level.lower(), 0.50)

    def compare(self, level_a: str, level_b: str) -> int:
        """Compare two trust levels. Returns -1, 0, or 1."""
        sa = self.score(level_a)
        sb = self.score(level_b)
        if sa < sb:
            return -1
        if sa > sb:
            return 1
        return 0
