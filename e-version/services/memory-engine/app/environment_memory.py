"""Environment Memory Store — infrastructure facts grounded in sources."""

from __future__ import annotations

from typing import Any


class EnvironmentMemoryStore:
    """
    Stores and retrieves environment memories.

    Environment memories are:
    - Grounded in sources (not freely inferred)
    - Used to route retrieval, not to answer directly
    - Not authoritative for exact config values — retrieval sources are

    Example:
      subject: home_network
      summary: User maintains VLAN-based home network. Source of truth: infra/topology.md
      allowed_use: [routing, retrieval_hint]
      disallowed_use: [exact_config_answering]
    """

    def __init__(self) -> None:
        self._memories: dict[str, list[dict[str, Any]]] = {}

    def upsert(self, memory: dict[str, Any], tenant_id: str, user_id: str) -> None:
        key = f"{tenant_id}:{user_id}"
        if key not in self._memories:
            self._memories[key] = []
        for i, m in enumerate(self._memories[key]):
            if m.get("subject") == memory.get("subject"):
                self._memories[key][i] = memory
                return
        self._memories[key].append(memory)

    def get_for_user(self, user_id: str, tenant_id: str) -> list[dict[str, Any]]:
        return list(self._memories.get(f"{tenant_id}:{user_id}", []))

    def get_retrieval_hints(self, user_id: str, tenant_id: str) -> list[str]:
        """Return grounding source paths for retrieval targeting."""
        memories = self.get_for_user(user_id, tenant_id)
        hints: list[str] = []
        for m in memories:
            if "routing" in m.get("allowed_use", []) or "retrieval_hint" in m.get("allowed_use", []):
                hints.extend(m.get("grounding_sources", []))
        return hints
