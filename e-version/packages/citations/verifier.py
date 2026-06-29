"""Citation verifier — checks that cited sources back the claims made."""

from __future__ import annotations

from typing import Any


class VerificationResult:
    def __init__(self, is_valid: bool, issues: list[str] | None = None) -> None:
        self.is_valid = is_valid
        self.issues = issues or []


class CitationVerifier:
    """
    Verifies that citations in an answer correspond to real retrieved chunks.

    Checks performed:
    - chunk_id referenced in retrieval result
    - fact_id referenced in retrieval result
    - source field is non-empty
    """

    def verify(
        self,
        citations: list[dict[str, Any]],
        retrieved_chunk_ids: set[str],
        selected_fact_ids: set[str],
    ) -> VerificationResult:
        issues: list[str] = []

        for cit in citations:
            source = cit.get("source")
            chunk_id = cit.get("chunk_id")
            fact_id = cit.get("fact_id")

            if not source:
                issues.append("Citation missing source field.")
                continue

            if chunk_id and chunk_id not in retrieved_chunk_ids:
                issues.append(f"Citation chunk_id '{chunk_id}' not found in retrieval results.")

            if fact_id and fact_id not in selected_fact_ids:
                issues.append(f"Citation fact_id '{fact_id}' not found in selected facts.")

        return VerificationResult(is_valid=len(issues) == 0, issues=issues)
