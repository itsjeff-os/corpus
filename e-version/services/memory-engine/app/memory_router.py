"""Memory Router — routes retrieval context requests to the appropriate memory store."""

from __future__ import annotations

import logging
from typing import Any

from packages.schemas.memories import MemoryType

logger = logging.getLogger(__name__)


class MemoryRouter:
    """
    Routes memory requests to the appropriate typed store.

    Key principle:
      Memory can ROUTE retrieval.
      Memory should NOT REPLACE retrieval.

    Memory types and their roles:
      - profile: durable user facts → provide user context
      - preference: user preferences → guide retrieval and answer format
      - environment: infrastructure facts → hint at retrieval targets
      - project: project goals and decisions → scope retrieval
      - procedural: how-to knowledge → pulled during procedure_lookup
      - session: current session context → injected into every call
      - working: ephemeral per-turn context → not persisted
    """

    def __init__(
        self,
        profile_store=None,
        preference_store=None,
        environment_store=None,
        project_store=None,
        procedural_store=None,
        session_store=None,
    ) -> None:
        self._stores = {
            MemoryType.PROFILE: profile_store,
            MemoryType.PREFERENCE: preference_store,
            MemoryType.ENVIRONMENT: environment_store,
            MemoryType.PROJECT: project_store,
            MemoryType.PROCEDURAL: procedural_store,
            MemoryType.SESSION: session_store,
        }

    def load(
        self,
        session_id: str,
        user_id: str,
        tenant_id: str,
        intent: str = "",
        entity_names: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Load relevant memories for the current retrieval cycle.

        Returns a structured dict of memory context layers.
        """
        context: dict[str, Any] = {
            "session_memories": [],
            "preferences": [],
            "profile": [],
            "environment_hints": [],
            "project_context": [],
        }

        # Session memories are always loaded
        if self._stores.get(MemoryType.SESSION):
            try:
                context["session_memories"] = self._stores[MemoryType.SESSION].get_for_session(session_id)
            except Exception as exc:
                logger.warning("Session memory load failed: %s", exc)

        # Preferences always loaded (guide answer format)
        if self._stores.get(MemoryType.PREFERENCE):
            try:
                context["preferences"] = self._stores[MemoryType.PREFERENCE].get_for_user(user_id, tenant_id)
            except Exception as exc:
                logger.warning("Preference memory load failed: %s", exc)

        # Profile loaded for user context
        if self._stores.get(MemoryType.PROFILE):
            try:
                context["profile"] = self._stores[MemoryType.PROFILE].get_for_user(user_id, tenant_id)
            except Exception as exc:
                logger.warning("Profile memory load failed: %s", exc)

        # Environment hints for infrastructure-related intents
        if intent in ("network_troubleshooting",) and self._stores.get(MemoryType.ENVIRONMENT):
            try:
                context["environment_hints"] = self._stores[MemoryType.ENVIRONMENT].get_for_user(user_id, tenant_id)
            except Exception as exc:
                logger.warning("Environment memory load failed: %s", exc)

        return context

    def get_retrieval_hints(self, memory_context: dict[str, Any]) -> list[str]:
        """
        Extract retrieval hints from loaded memories.

        These hints are used by the RetrievalPlanner to refine search targets.
        """
        hints: list[str] = []

        for mem in memory_context.get("environment_hints", []):
            grounding = mem.get("grounding_sources", [])
            hints.extend(grounding)

        for mem in memory_context.get("session_memories", []):
            subject = mem.get("subject", "")
            if subject:
                hints.append(subject)

        return list(dict.fromkeys(hints))
