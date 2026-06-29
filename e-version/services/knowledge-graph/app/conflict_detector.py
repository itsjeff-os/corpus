"""Conflict Detector — identifies conflicting claims for the same entity/field."""

from __future__ import annotations

from typing import Any

from packages.schemas.facts import Conflict, ConflictingClaim
from packages.ranking.trust import TrustScorer


class ConflictDetector:
    """
    Detects conflicting fact claims for the same (entity, field) pair.

    Conflicts are first-class objects — not errors.
    They are surfaced to the user and require resolution.
    """

    def __init__(self) -> None:
        self._scorer = TrustScorer()

    def detect(self, facts: list[dict[str, Any]]) -> list[Conflict]:
        """
        Group facts by (subject, predicate) and detect conflicts.

        A conflict exists when multiple facts have different values
        for the same (subject, predicate) pair.
        """
        # Group by (subject, predicate)
        groups: dict[tuple[str, str], list[dict[str, Any]]] = {}
        for fact in facts:
            key = (fact.get("subject", ""), fact.get("predicate", ""))
            if key not in groups:
                groups[key] = []
            groups[key].append(fact)

        conflicts: list[Conflict] = []
        for (subject, predicate), group in groups.items():
            values = {str(f.get("value")) for f in group}
            if len(values) > 1:
                claims = [
                    ConflictingClaim(
                        value=f.get("value"),
                        source=f.get("source", "unknown"),
                        trust=f.get("trust_level", "inferred"),
                        updated_at=f.get("updated_at") or f.get("created_at"),
                    )
                    for f in group
                ]
                conflict = Conflict(
                    entity=subject,
                    field=predicate,
                    claims=claims,
                    requires_user_review=True,
                )
                conflict.resolution = self._auto_resolve(claims)
                conflicts.append(conflict)

        return conflicts

    def _auto_resolve(self, claims: list[ConflictingClaim]) -> str:
        """Suggest an automatic resolution strategy based on trust levels."""
        machine_claims = [
            c for c in claims
            if c.trust in ("machine_verified", "canonical", "pinned")
        ]
        if machine_claims:
            return "prefer_machine_verified_newer_source"
        return "requires_user_review"
