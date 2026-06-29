"""Relation Store — manages typed relations between entities."""

from __future__ import annotations

from collections import defaultdict
from typing import Any

from packages.schemas.entities import Relation, RelationType


class RelationStore:
    """
    In-memory relation store (production: backed by Postgres).

    Provides upsert and bidirectional traversal.
    """

    def __init__(self) -> None:
        self._relations: dict[str, Relation] = {}
        self._outgoing: dict[str, list[str]] = defaultdict(list)
        self._incoming: dict[str, list[str]] = defaultdict(list)

    def upsert(self, relation: Relation) -> Relation:
        """Store a directed relation between two entities."""
        self._relations[relation.id] = relation
        self._outgoing[relation.source_entity_id].append(relation.id)
        self._incoming[relation.target_entity_id].append(relation.id)
        return relation

    def get_outgoing(self, entity_id: str, relation_types: list[RelationType] | None = None) -> list[Relation]:
        """Return all relations originating from an entity."""
        rel_ids = self._outgoing.get(entity_id, [])
        rels = [self._relations[rid] for rid in rel_ids if rid in self._relations]
        if relation_types:
            rels = [r for r in rels if r.relation_type in relation_types]
        return rels

    def get_incoming(self, entity_id: str, relation_types: list[RelationType] | None = None) -> list[Relation]:
        """Return all relations pointing to an entity."""
        rel_ids = self._incoming.get(entity_id, [])
        rels = [self._relations[rid] for rid in rel_ids if rid in self._relations]
        if relation_types:
            rels = [r for r in rels if r.relation_type in relation_types]
        return rels

    def get_neighbors(self, entity_id: str) -> list[str]:
        """Return all neighbor entity IDs (outgoing + incoming)."""
        out = [r.target_entity_id for r in self.get_outgoing(entity_id)]
        inc = [r.source_entity_id for r in self.get_incoming(entity_id)]
        return list(set(out + inc))
