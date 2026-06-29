"""Entity Extractor — identifies and types entities in text."""

from __future__ import annotations

import re
from dataclasses import dataclass

from packages.schemas.entities import EntityType


@dataclass
class ExtractedEntity:
    name: str
    entity_type: EntityType
    start: int
    end: int
    confidence: float = 0.8
    aliases: list[str] | None = None

    def __post_init__(self) -> None:
        if self.aliases is None:
            self.aliases = []


# Heuristic regex patterns for common entity types in network/infra context
PATTERNS: list[tuple[re.Pattern, EntityType]] = [
    (re.compile(r"\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:/\d{1,2})?)\b"), EntityType.SUBNET),
    (re.compile(r"\bVLAN\s*(\d+)\b", re.IGNORECASE), EntityType.VLAN),
    (re.compile(r"\b([A-Za-z0-9_-]+\.(local|lan|home|internal))\b", re.IGNORECASE), EntityType.DEVICE),
    (re.compile(r"\b(NAS|router|switch|AP|access point|firewall|gateway)\b", re.IGNORECASE), EntityType.DEVICE),
]


class EntityExtractor:
    """
    Extracts named entities from text using heuristic patterns.

    In production: replace or supplement with an NLP model (spaCy, Flair,
    or an LLM with an entity extraction prompt).
    """

    def extract(self, text: str) -> list[ExtractedEntity]:
        """Return all entities found in the given text."""
        entities: list[ExtractedEntity] = []
        seen: set[str] = set()

        for pattern, entity_type in PATTERNS:
            for m in pattern.finditer(text):
                name = m.group(0).strip()
                key = (name.lower(), entity_type)
                if key in seen:
                    continue
                seen.add(key)
                entities.append(
                    ExtractedEntity(
                        name=name,
                        entity_type=entity_type,
                        start=m.start(),
                        end=m.end(),
                    )
                )

        return entities

    def extract_from_chunks(self, chunks: list[str]) -> list[ExtractedEntity]:
        """Extract entities from a list of text chunks, deduplicating by name."""
        seen: set[str] = set()
        all_entities: list[ExtractedEntity] = []

        for chunk in chunks:
            for entity in self.extract(chunk):
                key = (entity.name.lower(), entity.entity_type)
                if key not in seen:
                    seen.add(key)
                    all_entities.append(entity)

        return all_entities
