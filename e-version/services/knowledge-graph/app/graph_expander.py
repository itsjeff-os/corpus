"""Graph Expander — traverses the knowledge graph from seed entities."""

from __future__ import annotations

from collections import deque
from typing import Any

from .entity_store import EntityStore
from .relation_store import RelationStore


class GraphExpander:
    """
    Expands a set of seed entities through breadth-first graph traversal.

    Returns expanded entities, their relevance scores (1.0 / hop_distance),
    and associated chunk/fact IDs.
    """

    def __init__(self, entity_store: EntityStore, relation_store: RelationStore) -> None:
        self.entity_store = entity_store
        self.relation_store = relation_store

    def expand(
        self,
        entity_names: list[str],
        tenant_id: str,
        user_id: str,
        max_hops: int = 2,
        relation_types: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Expand from seed entities via BFS up to max_hops.

        Returns:
          expanded_entities: list of entity dicts
          graph_relevance: entity_id → relevance score
          related_chunk_ids: all chunk IDs from expanded entities
          related_fact_ids: all fact IDs from expanded entities
        """
        seed_entities = self.entity_store.resolve_names(entity_names)
        if not seed_entities:
            return {
                "expanded_entities": [],
                "graph_relevance": {},
                "related_chunk_ids": [],
                "related_fact_ids": [],
            }

        visited: dict[str, int] = {}
        queue: deque[tuple[str, int]] = deque()

        for entity in seed_entities:
            visited[entity.id] = 0
            queue.append((entity.id, 0))

        expanded: list[dict[str, Any]] = []
        relevance: dict[str, float] = {}
        chunk_ids: list[str] = []
        fact_ids: list[str] = []

        while queue:
            entity_id, hop = queue.popleft()
            entity = self.entity_store.get_by_id(entity_id)
            if entity is None:
                continue

            if entity.tenant_id != tenant_id or entity.user_id != user_id:
                continue

            score = 1.0 / (hop + 1)
            relevance[entity_id] = score
            expanded.append({"id": entity.id, "name": entity.name, "type": entity.entity_type, "hop": hop})
            chunk_ids.extend(entity.document_ids)
            fact_ids.extend(entity.fact_ids)

            if hop < max_hops:
                for neighbor_id in self.relation_store.get_neighbors(entity_id):
                    if neighbor_id not in visited:
                        visited[neighbor_id] = hop + 1
                        queue.append((neighbor_id, hop + 1))

        return {
            "expanded_entities": expanded,
            "graph_relevance": relevance,
            "related_chunk_ids": list(set(chunk_ids)),
            "related_fact_ids": list(set(fact_ids)),
        }
