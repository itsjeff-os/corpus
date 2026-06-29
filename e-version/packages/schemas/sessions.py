"""Session and Turn schemas — conversation state management."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class SessionStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class TurnRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    TOOL = "tool"


class Citation(BaseModel):
    source: str
    chunk_id: str | None = None
    fact_id: str | None = None
    excerpt: str | None = None
    trust_level: str | None = None
    url: str | None = None


class MemoryProposal(BaseModel):
    memory_type: str
    subject: str
    summary: str
    confidence: float
    requires_confirmation: bool = False
    grounding_sources: list[str] = Field(default_factory=list)


class Turn(BaseModel):
    """A single exchange within a session."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    role: TurnRole
    content: str
    citations: list[Citation] = Field(default_factory=list)
    retrieval_plan: dict[str, Any] | None = None
    retrieved_chunk_ids: list[str] = Field(default_factory=list)
    selected_fact_ids: list[str] = Field(default_factory=list)
    discarded_fact_ids: list[str] = Field(default_factory=list)
    model_context: dict[str, Any] | None = None
    memory_proposals: list[MemoryProposal] = Field(default_factory=list)
    latency_ms: int | None = None
    token_count: int | None = None
    model_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}


class Session(BaseModel):
    """A conversation session with full state tracking."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: str
    user_id: str
    status: SessionStatus = SessionStatus.ACTIVE
    title: str | None = None
    intent: str | None = None
    entity_ids: list[str] = Field(default_factory=list)
    turns: list[Turn] = Field(default_factory=list)
    active_memory_ids: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_turn_at: datetime | None = None

    model_config = {"use_enum_values": True}
