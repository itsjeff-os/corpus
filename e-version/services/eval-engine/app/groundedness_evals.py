"""Groundedness Evaluator — checks that answers are supported by retrieved context."""

from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass
class GroundednessResult:
    is_grounded: bool
    score: float
    unsupported_claims: list[str] = field(default_factory=list)
    citation_coverage: float = 0.0
    hallucination_signals: list[str] = field(default_factory=list)


class GroundednessEvaluator:
    """
    Evaluates whether an LLM answer is grounded in the provided context.

    Checks:
    1. Citation coverage: fraction of claimed facts that have a citation
    2. Hallucination signals: patterns indicating fabrication
    3. Entity fidelity: do mentioned entities appear in retrieved context?

    In production: use an LLM-as-judge or NLI model for claim-level grounding.
    """

    HALLUCINATION_SIGNALS = [
        r"\bI think\b",
        r"\bI believe\b",
        r"\bprobably\b",
        r"\bmight be\b",
        r"\bI'm not sure but\b",
        r"\bif I recall correctly\b",
    ]

    def __init__(self) -> None:
        self._signal_patterns = [re.compile(p, re.IGNORECASE) for p in self.HALLUCINATION_SIGNALS]

    def evaluate(
        self,
        answer: str,
        citations: list[dict],
        retrieved_content: str,
        known_entities: set[str] | None = None,
    ) -> GroundednessResult:
        """Evaluate answer groundedness."""
        # Hallucination signal detection
        signals = []
        for pattern in self._signal_patterns:
            if pattern.search(answer):
                signals.append(pattern.pattern)

        # Citation coverage: at least one citation per paragraph of factual content
        paragraphs = [p.strip() for p in answer.split("\n\n") if p.strip()]
        factual_paragraphs = [p for p in paragraphs if not p.startswith("I ") and len(p) > 50]
        coverage = len(citations) / max(len(factual_paragraphs), 1)
        coverage = min(coverage, 1.0)

        # Entity fidelity: do mentioned entities appear in retrieved content?
        unsupported: list[str] = []
        if known_entities:
            for entity in known_entities:
                if entity.lower() in answer.lower() and entity.lower() not in retrieved_content.lower():
                    unsupported.append(entity)

        is_grounded = len(signals) == 0 and len(unsupported) == 0 and coverage >= 0.5
        score = (1.0 - len(signals) * 0.15) * (1.0 - len(unsupported) * 0.10) * coverage
        score = max(0.0, min(score, 1.0))

        return GroundednessResult(
            is_grounded=is_grounded,
            score=round(score, 4),
            unsupported_claims=unsupported,
            citation_coverage=round(coverage, 4),
            hallucination_signals=signals,
        )
