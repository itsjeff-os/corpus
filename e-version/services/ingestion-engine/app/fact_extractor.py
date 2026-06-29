"""Fact Extractor — derives structured facts from text and entities."""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any


@dataclass
class ExtractedFact:
    subject: str
    predicate: str
    value: Any
    source: str
    confidence: float = 0.75
    derived_by: str = "heuristic"
    entity_names: list[str] = field(default_factory=list)


# Simple heuristic patterns for network/infra fact extraction
# Pattern: (compiled_regex, predicate_template, value_group)
FACT_PATTERNS: list[tuple[re.Pattern, str, int]] = [
    (
        re.compile(r"(\S+)\s+is\s+on\s+VLAN\s*(\d+)", re.IGNORECASE),
        "is_on_vlan",
        2,
    ),
    (
        re.compile(r"VLAN\s*(\d+)\s+(?:uses?|is)\s+(?:subnet\s+)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/\d{1,2})", re.IGNORECASE),
        "uses_subnet",
        2,
    ),
    (
        re.compile(r"(\S+)\s+(?:has|has IP|IP\s*[:=]?)\s+(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})", re.IGNORECASE),
        "has_ip",
        2,
    ),
    (
        re.compile(r"mDNS\s+(?:reflector\s+)?is\s+(enabled|disabled)", re.IGNORECASE),
        "mdns_reflector_status",
        1,
    ),
]


class FactExtractor:
    """
    Extracts structured facts from normalized text using heuristic patterns.

    In production: replace or supplement with an LLM-based fact extraction
    step using the structured fact extraction prompt.
    """

    def extract(self, text: str, source: str = "unknown") -> list[ExtractedFact]:
        """Return all structured facts found in the given text."""
        facts: list[ExtractedFact] = []

        for pattern, predicate, value_group in FACT_PATTERNS:
            for m in pattern.finditer(text):
                groups = m.groups()
                subject = groups[0] if len(groups) > 0 else "unknown"
                value = groups[value_group - 1] if value_group - 1 < len(groups) else m.group(0)

                facts.append(
                    ExtractedFact(
                        subject=subject,
                        predicate=predicate,
                        value=value,
                        source=source,
                    )
                )

        return facts

    def extract_from_chunks(
        self, chunks: list[str], source: str = "unknown"
    ) -> list[ExtractedFact]:
        """Extract facts from multiple chunks, deduplicating on (subject, predicate, value)."""
        seen: set[tuple] = set()
        all_facts: list[ExtractedFact] = []

        for chunk in chunks:
            for fact in self.extract(chunk, source=source):
                key = (fact.subject.lower(), fact.predicate, str(fact.value).lower())
                if key not in seen:
                    seen.add(key)
                    all_facts.append(fact)

        return all_facts
