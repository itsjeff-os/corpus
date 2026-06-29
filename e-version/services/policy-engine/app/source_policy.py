"""Source Policy Engine — controls which sources may be queried."""

from __future__ import annotations

from typing import Any


class SourcePolicyEngine:
    """
    Controls which sources may be queried for a given user/tenant.

    Permissions flow all the way from source connectors through retrieval
    to the final answer — the assistant should never retrieve content
    the active context is not allowed to use.
    """

    def __init__(
        self,
        allowed_source_types: list[str] | None = None,
        denied_source_ids: set[str] | None = None,
    ) -> None:
        self._allowed_types = set(allowed_source_types or [])
        self._denied_ids = denied_source_ids or set()

    def can_query_source(self, source: dict[str, Any], tenant_id: str, user_id: str) -> bool:
        """Return True if this source may be queried."""
        source_id = source.get("id", source.get("source_id", ""))
        if source_id in self._denied_ids:
            return False
        source_type = source.get("source_type", "")
        if self._allowed_types and source_type not in self._allowed_types:
            return False
        permissions: list[str] = source.get("permissions", [])
        if permissions and user_id not in permissions:
            return False
        return True

    def filter_sources(
        self, sources: list[dict[str, Any]], tenant_id: str, user_id: str
    ) -> list[dict[str, Any]]:
        """Filter a list of sources to only those permitted."""
        return [s for s in sources if self.can_query_source(s, tenant_id, user_id)]
