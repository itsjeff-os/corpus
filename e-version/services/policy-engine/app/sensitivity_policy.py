"""Sensitivity Policy Engine — redacts and flags sensitive data in prompts/responses."""

from __future__ import annotations

import re
from typing import Any


# Patterns that indicate sensitive values that must never appear in prompts/responses
SENSITIVE_PATTERNS: list[tuple[str, re.Pattern]] = [
    ("password", re.compile(r'(?i)(password|passwd|pwd)\s*[:=]\s*\S+')),
    ("api_key", re.compile(r'(?i)(api[_-]?key|apikey)\s*[:=]\s*\S+')),
    ("secret", re.compile(r'(?i)(secret|client_secret)\s*[:=]\s*\S+')),
    ("token", re.compile(r'(?i)(token|bearer|auth_token)\s*[:=]\s*\S+')),
    ("private_key", re.compile(r'-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----')),
    ("aws_key", re.compile(r'(?i)AKIA[0-9A-Z]{16}')),
]


class SensitivityPolicyEngine:
    """
    Detects and redacts sensitive values from text.

    Rules:
    - Credentials must never appear in LLM prompts.
    - Reference credentials by name only (e.g., "the router admin password").
    - Log access to sensitive documents.
    - Detect accidental secrets in ingested docs and flag them.
    """

    def __init__(self, additional_patterns: list[tuple[str, re.Pattern]] | None = None) -> None:
        self._patterns = SENSITIVE_PATTERNS + (additional_patterns or [])

    def contains_sensitive(self, text: str) -> list[str]:
        """Return a list of matched sensitive pattern names found in text."""
        found: list[str] = []
        for name, pattern in self._patterns:
            if pattern.search(text):
                found.append(name)
        return found

    def redact(self, text: str, replacement: str = "[REDACTED]") -> str:
        """Replace sensitive values with a redaction marker."""
        for _, pattern in self._patterns:
            text = pattern.sub(replacement, text)
        return text

    def is_safe_for_prompt(self, text: str) -> bool:
        """Return True if text contains no detectable sensitive values."""
        return len(self.contains_sensitive(text)) == 0

    def audit_document(self, content: str, source_id: str) -> dict[str, Any]:
        """
        Scan an ingested document for accidental secrets.

        Returns a dict with source_id, found_patterns, and is_clean.
        """
        found = self.contains_sensitive(content)
        return {
            "source_id": source_id,
            "found_patterns": found,
            "is_clean": len(found) == 0,
        }
