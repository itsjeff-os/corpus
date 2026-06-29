"""Memory Promotion Policy — governs when session memories become durable."""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)


@dataclass
class PromotionDecision:
    should_promote: bool
    memory_type: str
    confidence: float
    requires_confirmation: bool
    reason: str
    candidate: dict[str, Any] = field(default_factory=dict)


class MemoryPromotionPolicy:
    """
    Evaluates whether a candidate memory should be promoted to durable storage.

    Promotion rules (in order):
    1. Candidate must have grounding_sources (not freely inferred).
    2. Candidate confidence must meet the threshold for its memory_type.
    3. Environment and procedural memories always require source grounding.
    4. Profile memories require user confirmation if confidence < 0.90.
    5. Session memories are not promoted unless explicitly flagged.

    The model should never silently store everything it infers.
    """

    CONFIDENCE_THRESHOLDS: dict[str, float] = {
        "profile": 0.85,
        "preference": 0.80,
        "environment": 0.90,
        "project": 0.80,
        "procedural": 0.90,
        "relationship": 0.75,
        "session": 1.00,
    }

    REQUIRES_GROUNDING: set[str] = {"environment", "procedural", "profile"}
    AUTO_CONFIRM_MAX_CONFIDENCE: dict[str, float] = {
        "preference": 0.95,
        "project": 0.90,
    }

    def evaluate(self, candidate: dict[str, Any]) -> PromotionDecision:
        """Evaluate a candidate memory for promotion."""
        memory_type = candidate.get("memory_type", "session")
        confidence = float(candidate.get("confidence", 0.0))
        grounding_sources = candidate.get("grounding_sources", [])

        # Session memories are never auto-promoted
        if memory_type == "session":
            return PromotionDecision(
                should_promote=False,
                memory_type=memory_type,
                confidence=confidence,
                requires_confirmation=False,
                reason="Session memories are not promoted to durable storage.",
                candidate=candidate,
            )

        # Check source grounding requirement
        if memory_type in self.REQUIRES_GROUNDING and not grounding_sources:
            return PromotionDecision(
                should_promote=False,
                memory_type=memory_type,
                confidence=confidence,
                requires_confirmation=False,
                reason=f"{memory_type} memory requires source grounding but none was provided.",
                candidate=candidate,
            )

        # Check confidence threshold
        threshold = self.CONFIDENCE_THRESHOLDS.get(memory_type, 0.80)
        if confidence < threshold:
            return PromotionDecision(
                should_promote=False,
                memory_type=memory_type,
                confidence=confidence,
                requires_confirmation=False,
                reason=f"Confidence {confidence:.2f} is below threshold {threshold:.2f} for {memory_type}.",
                candidate=candidate,
            )

        # Determine if user confirmation is needed
        auto_max = self.AUTO_CONFIRM_MAX_CONFIDENCE.get(memory_type, 0.0)
        requires_confirmation = confidence < auto_max or memory_type == "profile"

        return PromotionDecision(
            should_promote=True,
            memory_type=memory_type,
            confidence=confidence,
            requires_confirmation=requires_confirmation,
            reason="Memory meets promotion criteria.",
            candidate=candidate,
        )
