"""Conflict resolver — resolves competing fact claims using trust and freshness."""

from __future__ import annotations

from enum import Enum
from typing import Any

from packages.ranking.trust import TrustScorer, TRUST_WEIGHTS
from packages.ranking.freshness import FreshnessScorer


class ResolutionStrategy(str, Enum):
    PREFER_HIGHEST_TRUST = "prefer_highest_trust"
    PREFER_NEWEST = "prefer_newest"
    PREFER_MACHINE_VERIFIED_NEWER = "prefer_machine_verified_newer_source"
    REQUIRE_USER_REVIEW = "require_user_review"
    SURFACE_ALL = "surface_all"


class ConflictResolver:
    """
    Resolves conflicting fact claims using configurable strategies.

    Conflicts are first-class objects — not errors.
    """

    def __init__(self) -> None:
        self._trust = TrustScorer()
        self._freshness = FreshnessScorer()

    def resolve(
        self,
        claims: list[dict[str, Any]],
        strategy: ResolutionStrategy = ResolutionStrategy.PREFER_MACHINE_VERIFIED_NEWER,
    ) -> dict[str, Any]:
        """
        Select the winning claim according to the given strategy.

        Each claim dict must have at minimum: value, source, trust, updated_at.
        Returns the winning claim dict with an added 'resolution' key.
        """
        if not claims:
            raise ValueError("Cannot resolve an empty claims list.")

        if len(claims) == 1:
            return {**claims[0], "resolution": "only_claim"}

        if strategy == ResolutionStrategy.PREFER_HIGHEST_TRUST:
            winner = max(claims, key=lambda c: self._trust.score(c.get("trust", "inferred")))
            winner = {**winner, "resolution": "prefer_highest_trust"}

        elif strategy == ResolutionStrategy.PREFER_NEWEST:
            winner = max(claims, key=lambda c: str(c.get("updated_at", "")))
            winner = {**winner, "resolution": "prefer_newest"}

        elif strategy == ResolutionStrategy.PREFER_MACHINE_VERIFIED_NEWER:
            # Among machine_verified claims prefer newest; otherwise prefer highest trust.
            machine = [c for c in claims if c.get("trust") in ("machine_verified", "canonical", "pinned")]
            pool = machine if machine else claims
            winner = max(pool, key=lambda c: str(c.get("updated_at", "")))
            winner = {**winner, "resolution": "prefer_machine_verified_newer_source"}

        elif strategy == ResolutionStrategy.REQUIRE_USER_REVIEW:
            winner = {**claims[0], "resolution": "requires_user_review", "requires_user_review": True}

        else:
            winner = {**claims[0], "resolution": "surface_all", "all_claims": claims}

        return winner
