"""Access Policy Engine — controls which facts and chunks may be retrieved."""

from __future__ import annotations

import logging
from typing import Any

from packages.ranking.trust import TrustScorer

logger = logging.getLogger(__name__)

# Trust levels that are always permitted for retrieval
DEFAULT_ALLOWED_TRUST_LEVELS = {
    "pinned", "canonical", "machine_verified", "user_confirmed", "source_backed", "derived"
}
# Trust levels that are denied by default (too low quality)
DEFAULT_DENIED_TRUST_LEVELS = {"deprecated"}


class AccessPolicyEngine:
    """
    Enforces access policies on retrieved content.

    Checks:
    - Can this fact be used? (trust level, staleness, permissions)
    - Can this chunk be shown? (permission list, tenant isolation)
    - Is this fact from a denied source type?
    """

    def __init__(
        self,
        allowed_trust_levels: set[str] | None = None,
        denied_trust_levels: set[str] | None = None,
        denied_source_types: set[str] | None = None,
    ) -> None:
        self._allowed_trust = allowed_trust_levels or DEFAULT_ALLOWED_TRUST_LEVELS
        self._denied_trust = denied_trust_levels or DEFAULT_DENIED_TRUST_LEVELS
        self._denied_source_types = denied_source_types or set()
        self._scorer = TrustScorer()

    def can_use_fact(self, fact: dict[str, Any], tenant_id: str, user_id: str) -> bool:
        """Return True if the fact may be used in a response."""
        trust = fact.get("trust_level", "inferred")
        if trust in self._denied_trust:
            logger.debug("Fact denied by trust level: %s", trust)
            return False
        if fact.get("source_type") in self._denied_source_types:
            logger.debug("Fact denied by source type: %s", fact.get("source_type"))
            return False
        if fact.get("tenant_id") and fact["tenant_id"] != tenant_id:
            logger.debug("Fact denied by tenant isolation.")
            return False
        return True

    def can_access_chunk(self, chunk: dict[str, Any], tenant_id: str, user_id: str) -> bool:
        """Return True if the chunk may be retrieved for this user."""
        chunk_tenant = chunk.get("tenant_id", tenant_id)
        if chunk_tenant != tenant_id:
            return False
        permissions: list[str] = chunk.get("permissions", [])
        if permissions and user_id not in permissions:
            return False
        return True

    def filter_facts(self, facts: list[dict[str, Any]], tenant_id: str, user_id: str) -> list[dict[str, Any]]:
        """Filter a list of facts, keeping only those permitted for this context."""
        return [f for f in facts if self.can_use_fact(f, tenant_id, user_id)]

    def filter_chunks(self, chunks: list[dict[str, Any]], tenant_id: str, user_id: str) -> list[dict[str, Any]]:
        """Filter a list of chunks, keeping only those accessible for this user."""
        return [c for c in chunks if self.can_access_chunk(c, tenant_id, user_id)]
