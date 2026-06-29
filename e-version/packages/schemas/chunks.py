"""Chunk schema — a semantically coherent segment of a document."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class ChunkType(str, Enum):
    TEXT = "text"
    CODE = "code"
    CONFIG = "config"
    TABLE = "table"
    LIST = "list"
    HEADING = "heading"
    IMAGE_DESCRIPTION = "image_description"
    METADATA = "metadata"


class Chunk(BaseModel):
    """A chunk derived from a document, ready for embedding and retrieval."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str
    tenant_id: str
    user_id: str
    chunk_type: ChunkType = ChunkType.TEXT
    content: str
    content_hash: str | None = None
    chunk_index: int = 0
    start_char: int | None = None
    end_char: int | None = None
    token_count: int | None = None
    embedding: list[float] | None = None
    embedding_model: str | None = None
    section: str | None = None
    heading_path: list[str] = Field(default_factory=list)
    entity_ids: list[str] = Field(default_factory=list)
    fact_ids: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}
