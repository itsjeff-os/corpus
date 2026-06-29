"""Memory Policy Engine — controls when memories may be created or updated."""

from __future__ import annotations

from typing import Any


class MemoryPolicyEngine:
    """
    Wraps the MemoryPromotionPolicy with additional policy gates.

    Additional checks:
    - Is the memory type allowed for this tenant?
    - Does this memory require user confirmation?
    - Is there a conflict that blocks auto-promotion?
    """

    def __init__(
        self,
        allowed_memory_types: list[str] | None = None,
        require_grounding: bool = True,
    ) -> None:
        from services.memory_engine.app.promotion_policy import MemoryPromotionPolicy
        self._promotion_policy = MemoryPromotionPolicy()
        self._allowed_types = set(allowed_memory_types or ["profile", "preference", "environment", "project", "procedural", "relationship"])
        self._require_grounding = require_grounding

    def evaluate_promotion(self, candidate: dict[str, Any]):
        """Evaluate a memory candidate for promotion."""
        from services.memory_engine.app.promotion_policy import PromotionDecision
        memory_type = candidate.get("memory_type", "session")
        if memory_type not in self._allowed_types:
            return PromotionDecision(
                should_promote=False,
                memory_type=memory_type,
                confidence=0.0,
                requires_confirmation=False,
                reason=f"Memory type '{memory_type}' is not allowed by policy.",
                candidate=candidate,
            )
        return self._promotion_policy.evaluate(candidate)
