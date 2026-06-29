"""Document schema — canonical representation of an ingested source document."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class DocumentStatus(str, Enum):
    PENDING = "pending"
    INGESTING = "ingesting"
    INDEXED = "indexed"
    FAILED = "failed"
    STALE = "stale"
    DEPRECATED = "deprecated"


class Document(BaseModel):
    """A source document ingested into the Personal Context Engine."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    source_uri: str
    source_type: str
    tenant_id: str
    user_id: str
    status: DocumentStatus = DocumentStatus.PENDING
    content_hash: str | None = None
    raw_text: str | None = None
    parsed_text: str | None = None
    language: str = "en"
    mime_type: str | None = None
    byte_size: int | None = None
    chunk_count: int = 0
    metadata: dict[str, Any] = Field(default_factory=dict)
    permissions: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    indexed_at: datetime | None = None
    last_synced_at: datetime | None = None

    model_config = {"use_enum_values": True}
