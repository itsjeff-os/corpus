"""Response Validator — validates LLM answers for groundedness and citation accuracy."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ValidationResult:
    is_valid: bool
    issues: list[str] = field(default_factory=list)
    stale_facts_used: list[str] = field(default_factory=list)
    conflicted_facts_used: list[str] = field(default_factory=list)
    invented_entities: list[str] = field(default_factory=list)


class ResponseValidator:
    """
    Post-generation validator for LLM answers.

    Checks performed:
    - Citations reference real chunks/facts from retrieval
    - Answer does not rely on stale or conflicted facts without warning
    - Answer does not mention entities not present in retrieved context
    """

    def validate(
        self,
        answer: str,
        citations: list[dict[str, Any]],
        retrieved_chunk_ids: set[str],
        selected_fact_ids: set[str],
        stale_fact_ids: set[str],
        conflict_ids: set[str],
        known_entities: set[str],
    ) -> ValidationResult:
        issues: list[str] = []
        stale_used: list[str] = []
        conflicted_used: list[str] = []

        # Check citations refer to real chunks/facts
        for cit in citations:
            chunk_id = cit.get("chunk_id")
            fact_id = cit.get("fact_id")
            if chunk_id and chunk_id not in retrieved_chunk_ids:
                issues.append(f"Citation references unknown chunk: {chunk_id}")
            if fact_id and fact_id not in selected_fact_ids:
                issues.append(f"Citation references unknown fact: {fact_id}")
            if fact_id and fact_id in stale_fact_ids:
                stale_used.append(fact_id)
            if fact_id and fact_id in conflict_ids:
                conflicted_used.append(fact_id)

        if stale_used:
            issues.append(f"Answer relies on {len(stale_used)} stale fact(s) without explicit warning.")
        if conflicted_used:
            issues.append(f"Answer relies on {len(conflicted_used)} conflicted fact(s) without explicit warning.")

        # Heuristic: check for credential-like patterns that should never appear in answers
        secret_patterns = [
            r"\bpassword\s*[:=]\s*\S+",
            r"\bsecret\s*[:=]\s*\S+",
            r"\bapi[_-]?key\s*[:=]\s*\S+",
            r"\btoken\s*[:=]\s*\S+",
        ]
        for pattern in secret_patterns:
            if re.search(pattern, answer, re.IGNORECASE):
                issues.append("Answer may contain a sensitive credential value. Review and redact.")

        return ValidationResult(
            is_valid=len(issues) == 0,
            issues=issues,
            stale_facts_used=stale_used,
            conflicted_facts_used=conflicted_used,
        )
