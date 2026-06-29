"""Session Memory Store — automatic, short-lived, mutable session context."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


class SessionMemoryStore:
    """
    Stores and retrieves session-scoped memories.

    Session memories are:
    - Automatically created during conversation
    - Short-lived (expire with the session)
    - Mutable within the session
    - Not promoted to durable memory without policy approval
    """

    def __init__(self) -> None:
        self._sessions: dict[str, list[dict[str, Any]]] = {}

    def write(self, session_id: str, memory: dict[str, Any]) -> None:
        """Write a memory to the current session."""
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        memory["_written_at"] = datetime.now(tz=timezone.utc).isoformat()
        self._sessions[session_id].append(memory)

    def get_for_session(self, session_id: str) -> list[dict[str, Any]]:
        """Return all memories for a session."""
        return list(self._sessions.get(session_id, []))

    def clear(self, session_id: str) -> None:
        """Clear all memories for a session."""
        self._sessions.pop(session_id, None)

    def update(self, session_id: str, subject: str, updates: dict[str, Any]) -> bool:
        """Update an existing session memory by subject."""
        for mem in self._sessions.get(session_id, []):
            if mem.get("subject") == subject:
                mem.update(updates)
                return True
        return False
