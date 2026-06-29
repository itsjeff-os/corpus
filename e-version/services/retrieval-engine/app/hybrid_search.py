"""
Hybrid Search — orchestrates semantic + lexical + graph retrieval.

This is the core intelligence layer of the Retrieval Engine.
"""

from __future__ import annotations

import logging
from typing import Any

from packages.schemas.retrieval import RetrievalPlan, RetrievalMode, RetrievalResult, RankedChunk, RankingScores

from .vector_search import VectorSearch
from .lexical_search import LexicalSearch
from .graph_search import GraphSearch
from .reranker import RetrievalReranker
from .context_packer import ContextPacker

logger = logging.getLogger(__name__)


class HybridSearch:
    """
    Executes a hybrid retrieval strategy combining:
      - Semantic (vector) search
      - Lexical (BM25) search
      - Knowledge graph expansion
      - Fact lookup
      - Metadata and permission filtering
      - Trust and freshness ranking
      - Conflict detection
      - Context packing
    """

    def __init__(
        self,
        vector_search: VectorSearch | None = None,
        lexical_search: LexicalSearch | None = None,
        graph_search: GraphSearch | None = None,
        fact_store=None,
        policy_engine=None,
        top_k: int = 20,
    ) -> None:
        self.vector_search = vector_search or VectorSearch()
        self.lexical_search = lexical_search or LexicalSearch()
        self.graph_search = graph_search or GraphSearch()
        self.fact_store = fact_store
        self.policy_engine = policy_engine
        self.reranker = RetrievalReranker(top_k=top_k)
        self.packer = ContextPacker()
        self.top_k = top_k

    def retrieve(
        self,
        plan: RetrievalPlan,
        tenant_id: str,
        user_id: str,
    ) -> RetrievalResult:
        """Execute the retrieval plan and return a ranked, packed result."""
        semantic_results: list[dict[str, Any]] = []
        lexical_results: list[dict[str, Any]] = []
        graph_expansion: dict[str, Any] = {}

        # Semantic retrieval
        if RetrievalMode.SEMANTIC in plan.retrieval_modes:
            query_emb = self.vector_search.embed_query("")
            semantic_results = self.vector_search.search(
                query_embedding=query_emb,
                tenant_id=tenant_id,
                user_id=user_id,
                top_k=self.top_k,
                filters=plan.filters,
            )
            logger.debug("Semantic search returned %d results.", len(semantic_results))

        # Lexical retrieval
        if RetrievalMode.LEXICAL in plan.retrieval_modes:
            lexical_results = self.lexical_search.search(
                query="",
                tenant_id=tenant_id,
                user_id=user_id,
                top_k=self.top_k,
                filters=plan.filters,
            )
            logger.debug("Lexical search returned %d results.", len(lexical_results))

        # Graph expansion
        if RetrievalMode.GRAPH_TRAVERSAL in plan.retrieval_modes and plan.entities:
            graph_expansion = self.graph_search.expand(
                entity_names=plan.entities,
                tenant_id=tenant_id,
                user_id=user_id,
            )
            logger.debug("Graph expansion returned %d entities.", len(graph_expansion.get("expanded_entities", [])))

        # Fact lookup
        facts: list[dict[str, Any]] = []
        if RetrievalMode.FACT_LOOKUP in plan.retrieval_modes and self.fact_store:
            facts = self.fact_store.lookup(
                entities=plan.entities,
                tenant_id=tenant_id,
                user_id=user_id,
            )

        # Permission filtering
        if self.policy_engine:
            semantic_results = self._filter_by_policy(semantic_results, tenant_id, user_id)
            lexical_results = self._filter_by_policy(lexical_results, tenant_id, user_id)

        # Rerank
        ranked = self.reranker.rerank(
            semantic_results=semantic_results,
            lexical_results=lexical_results,
            graph_expansion=graph_expansion,
        )

        # Pack context
        packed = self.packer.pack(ranked_chunks=ranked, facts=facts, conflicts=[])
        citations = self.packer.bind_citations(packed["chunks"], packed["facts"])

        # Build result
        ranked_chunk_objects = [
            RankedChunk(
                chunk_id=c.get("chunk_id", ""),
                document_id=c.get("document_id", ""),
                content=c.get("content", ""),
                section=c.get("section"),
                source=c.get("source"),
                scores=RankingScores(
                    semantic_score=c.get("semantic_score", 0.0),
                    lexical_score=c.get("lexical_score", 0.0),
                ),
                final_score=c.get("final_score", 0.0),
                trust_level=c.get("trust_level"),
            )
            for c in packed["chunks"]
        ]

        return RetrievalResult(
            plan_id=plan.id,
            session_id=plan.session_id,
            ranked_chunks=ranked_chunk_objects,
            selected_fact_ids=[f.get("id", "") for f in packed["facts"]],
        )

    def _filter_by_policy(
        self, results: list[dict[str, Any]], tenant_id: str, user_id: str
    ) -> list[dict[str, Any]]:
        """Filter results through the policy engine."""
        if not self.policy_engine:
            return results
        return [
            r for r in results
            if self.policy_engine.can_access_chunk(r, tenant_id, user_id)
        ]
