"""Freshness scoring — maps document/fact age to a decay score."""

from __future__ import annotations

from datetime import datetime, timezone


FRESHNESS_THRESHOLDS_DAYS = {
    "current": 7,
    "recent": 30,
    "aging": 90,
    "stale": 365,
}


class FreshnessScorer:
    """
    Computes a freshness score in [0, 1] based on age.

    Score decays linearly from 1.0 (very fresh) toward 0.0 (very stale).
    """

    def __init__(self, max_age_days: int = 365) -> None:
        self.max_age_days = max_age_days

    def score(self, last_updated: datetime | None) -> float:
        """Return a freshness score. Returns 0.5 for unknown age."""
        if last_updated is None:
            return 0.50

        now = datetime.now(tz=timezone.utc)
        if last_updated.tzinfo is None:
            last_updated = last_updated.replace(tzinfo=timezone.utc)

        age_days = (now - last_updated).days
        if age_days < 0:
            return 1.0

        score = max(0.0, 1.0 - age_days / self.max_age_days)
        return round(score, 4)

    def classify(self, last_updated: datetime | None) -> str:
        """Classify freshness as one of: current, recent, aging, stale, expired."""
        if last_updated is None:
            return "unknown"

        now = datetime.now(tz=timezone.utc)
        if last_updated.tzinfo is None:
            last_updated = last_updated.replace(tzinfo=timezone.utc)

        age_days = (now - last_updated).days
        for label, threshold in FRESHNESS_THRESHOLDS_DAYS.items():
            if age_days <= threshold:
                return label
        return "expired"
