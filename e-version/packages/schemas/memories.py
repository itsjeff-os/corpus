"""Memory schemas — typed memory classes for the Memory Engine."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class MemoryType(str, Enum):
    PROFILE = "profile"
    PREFERENCE = "preference"
    ENVIRONMENT = "environment"
    PROJECT = "project"
    PROCEDURAL = "procedural"
    RELATIONSHIP = "relationship"
    SESSION = "session"
    WORKING = "working"
    EPISODIC = "episodic"


class MemoryPrecision(str, Enum):
    EXACT = "exact"
    SUMMARY = "summary"
    REFERENCE = "reference"


class Memory(BaseModel):
    """Base memory record — a typed, policy-gated, source-grounded piece of context."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: str
    user_id: str
    memory_type: MemoryType
    subject: str
    summary: str
    value: Any | None = None
    precision: MemoryPrecision = MemoryPrecision.SUMMARY
    grounding_sources: list[str] = Field(default_factory=list)
    grounding_fact_ids: list[str] = Field(default_factory=list)
    allowed_use: list[str] = Field(default_factory=list)
    disallowed_use: list[str] = Field(default_factory=list)
    confidence: float = Field(ge=0.0, le=1.0, default=0.8)
    user_confirmed: bool = False
    embedding: list[float] | None = None
    embedding_model: str | None = None
    expires_at: datetime | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}


class ProfileMemory(Memory):
    """Durable user-visible profile facts — explicit or strongly confirmed."""

    memory_type: MemoryType = MemoryType.PROFILE
    durable: bool = True


class PreferenceMemory(Memory):
    """User preferences — retained across sessions."""

    memory_type: MemoryType = MemoryType.PREFERENCE
    preference_key: str = ""
    preference_domain: str = ""


class EnvironmentMemory(Memory):
    """Environment/infrastructure facts grounded in sources — not freely inferred."""

    memory_type: MemoryType = MemoryType.ENVIRONMENT
    environment_type: str = ""


class ProjectMemory(Memory):
    """Project-scoped context: goals, decisions, state."""

    memory_type: MemoryType = MemoryType.PROJECT
    project_id: str | None = None


class ProceduralMemory(Memory):
    """Versioned, source-backed procedures and how-to knowledge."""

    memory_type: MemoryType = MemoryType.PROCEDURAL
    version: str = "1"
    steps: list[str] = Field(default_factory=list)


class RelationshipMemory(Memory):
    """Relationship facts between the user and other entities."""

    memory_type: MemoryType = MemoryType.RELATIONSHIP
    related_entity_id: str | None = None


class SessionMemory(Memory):
    """Automatic, short-lived, mutable session-scoped context."""

    memory_type: MemoryType = MemoryType.SESSION
    session_id: str = ""


class WorkingMemory(Memory):
    """Ephemeral working context for the current reasoning cycle."""

    memory_type: MemoryType = MemoryType.WORKING
    session_id: str = ""
    turn_id: str | None = None
