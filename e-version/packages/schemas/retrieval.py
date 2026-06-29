"""Retrieval schemas — plans, modes, and results for the Retrieval Engine."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class RetrievalMode(str, Enum):
    SEMANTIC = "semantic"
    LEXICAL = "lexical"
    FACT_LOOKUP = "fact_lookup"
    GRAPH_TRAVERSAL = "graph_traversal"
    TEMPORAL = "temporal"
    PROCEDURAL = "procedural"
    PREFERENCE = "preference"
    RECENT_SESSION = "recent_session"
    STRUCTURED = "structured"


class RetrievalIntent(str, Enum):
    QUESTION_ANSWERING = "question_answering"
    NETWORK_TROUBLESHOOTING = "network_troubleshooting"
    PROCEDURE_LOOKUP = "procedure_lookup"
    FACT_VERIFICATION = "fact_verification"
    SUMMARIZATION = "summarization"
    COMPARISON = "comparison"
    CREATIVE = "creative"
    UNKNOWN = "unknown"


class RetrievalPlan(BaseModel):
    """A structured plan governing how retrieval should be executed."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    turn_id: str
    intent: RetrievalIntent
    entities: list[str] = Field(default_factory=list)
    needed_context: list[str] = Field(default_factory=list)
    retrieval_modes: list[RetrievalMode] = Field(default_factory=list)
    freshness_requirement: str = "normal"
    risk_level: str = "low"
    top_k: int = 20
    filters: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}


class RankingScores(BaseModel):
    """Component scores used in the final ranking formula."""

    semantic_score: float = 0.0
    lexical_score: float = 0.0
    entity_overlap: float = 0.0
    graph_relevance: float = 0.0
    trust_score: float = 0.0
    freshness_score: float = 0.0
    session_relevance: float = 0.0

    def final_score(self) -> float:
        """Compute the weighted final ranking score."""
        return (
            self.semantic_score * 0.20
            + self.lexical_score * 0.15
            + self.entity_overlap * 0.20
            + self.graph_relevance * 0.15
            + self.trust_score * 0.15
            + self.freshness_score * 0.10
            + self.session_relevance * 0.05
        )


class RankedChunk(BaseModel):
    """A retrieved chunk with ranking scores and metadata."""

    chunk_id: str
    document_id: str
    content: str
    section: str | None = None
    source: str | None = None
    scores: RankingScores = Field(default_factory=RankingScores)
    final_score: float = 0.0
    entity_ids: list[str] = Field(default_factory=list)
    fact_ids: list[str] = Field(default_factory=list)
    trust_level: str | None = None
    conflicts: list[dict[str, Any]] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class RetrievalResult(BaseModel):
    """The full output of the Retrieval Engine for a given plan."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plan_id: str
    session_id: str
    ranked_chunks: list[RankedChunk] = Field(default_factory=list)
    selected_fact_ids: list[str] = Field(default_factory=list)
    discarded_fact_ids: list[str] = Field(default_factory=list)
    conflict_ids: list[str] = Field(default_factory=list)
    stale_fact_ids: list[str] = Field(default_factory=list)
    latency_ms: int | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
