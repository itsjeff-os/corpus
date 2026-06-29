"""Fact schema — a discrete, source-grounded, trust-scored piece of information."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class TrustLevel(str, Enum):
    PINNED = "pinned"
    CANONICAL = "canonical"
    MACHINE_VERIFIED = "machine_verified"
    USER_CONFIRMED = "user_confirmed"
    SOURCE_BACKED = "source_backed"
    DERIVED = "derived"
    INFERRED = "inferred"
    STALE = "stale"
    CONFLICTED = "conflicted"
    DEPRECATED = "deprecated"


class FreshnessStatus(str, Enum):
    CURRENT = "current"
    RECENT = "recent"
    AGING = "aging"
    STALE = "stale"
    EXPIRED = "expired"


class ConflictingClaim(BaseModel):
    value: Any
    source: str
    trust: TrustLevel
    updated_at: datetime | None = None


class Conflict(BaseModel):
    conflict_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    entity: str
    field: str
    claims: list[ConflictingClaim]
    resolution: str | None = None
    requires_user_review: bool = False
    resolved_at: datetime | None = None


class Fact(BaseModel):
    """A discrete, verifiable piece of information grounded in a source."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: str
    user_id: str
    subject: str
    predicate: str
    value: Any
    source: str
    source_type: str
    trust_level: TrustLevel = TrustLevel.SOURCE_BACKED
    confidence: float = Field(ge=0.0, le=1.0, default=0.8)
    freshness: FreshnessStatus = FreshnessStatus.CURRENT
    embedding: list[float] | None = None
    embedding_model: str | None = None
    last_verified_at: datetime | None = None
    derived_by: str | None = None
    user_confirmed: bool = False
    conflicts: list[Conflict] = Field(default_factory=list)
    entity_ids: list[str] = Field(default_factory=list)
    chunk_ids: list[str] = Field(default_factory=list)
    document_ids: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}
