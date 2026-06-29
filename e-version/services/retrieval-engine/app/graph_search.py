"""Graph search — knowledge graph expansion and entity-aware retrieval."""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


class GraphSearch:
    """
    Expands retrieval through the knowledge graph.

    Given a set of seed entities, traverses relations to find connected
    entities and their associated chunks/facts.

    In production: queries the Knowledge Graph service.
    """

    def __init__(self, knowledge_graph=None) -> None:
        self.knowledge_graph = knowledge_graph

    def expand(
        self,
        entity_names: list[str],
        tenant_id: str,
        user_id: str,
        max_hops: int = 2,
        relation_types: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Expand the seed entity set through graph traversal.

        Returns:
          - expanded_entities: all entities reachable within max_hops
          - related_chunk_ids: chunk IDs associated with expanded entities
          - related_fact_ids: fact IDs associated with expanded entities
          - graph_relevance: dict of entity_id → relevance score (1.0 / hop_distance)
        """
        if self.knowledge_graph is None:
            logger.debug("No knowledge graph configured — returning empty graph expansion.")
            return {
                "expanded_entities": [],
                "related_chunk_ids": [],
                "related_fact_ids": [],
                "graph_relevance": {},
            }

        return self.knowledge_graph.expand(
            entity_names=entity_names,
            tenant_id=tenant_id,
            user_id=user_id,
            max_hops=max_hops,
            relation_types=relation_types or [],
        )

    def entity_overlap_score(
        self,
        chunk_entity_ids: list[str],
        query_entity_ids: list[str],
        expanded_entity_ids: list[str],
    ) -> float:
        """
        Compute the entity overlap score for a chunk.

        Exact query entity matches score 1.0; expanded graph matches score 0.5.
        """
        if not chunk_entity_ids:
            return 0.0

        query_set = set(query_entity_ids)
        expanded_set = set(expanded_entity_ids)

        exact = sum(1 for e in chunk_entity_ids if e in query_set)
        expanded = sum(1 for e in chunk_entity_ids if e in expanded_set and e not in query_set)

        total = len(chunk_entity_ids)
        score = (exact * 1.0 + expanded * 0.5) / max(total, 1)
        return round(min(score, 1.0), 4)
