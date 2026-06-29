"""Profile Memory Store — durable, user-visible profile facts."""

from __future__ import annotations

from typing import Any


class ProfileMemoryStore:
    """
    Stores and retrieves profile memories.

    Profile memories are:
    - Durable across sessions
    - User-visible and inspectable
    - Explicit or strongly confirmed by the user
    - Never freely inferred
    """

    def __init__(self) -> None:
        self._memories: dict[str, list[dict[str, Any]]] = {}

    def upsert(self, memory: dict[str, Any], tenant_id: str, user_id: str) -> None:
        key = f"{tenant_id}:{user_id}"
        if key not in self._memories:
            self._memories[key] = []
        # Update if subject matches
        for i, m in enumerate(self._memories[key]):
            if m.get("subject") == memory.get("subject"):
                self._memories[key][i] = memory
                return
        self._memories[key].append(memory)

    def get_for_user(self, user_id: str, tenant_id: str) -> list[dict[str, Any]]:
        return list(self._memories.get(f"{tenant_id}:{user_id}", []))

    def delete(self, subject: str, user_id: str, tenant_id: str) -> bool:
        key = f"{tenant_id}:{user_id}"
        memories = self._memories.get(key, [])
        original_len = len(memories)
        self._memories[key] = [m for m in memories if m.get("subject") != subject]
        return len(self._memories[key]) < original_len
