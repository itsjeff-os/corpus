"""Base source connector interface — all connectors must implement this."""

from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class SourceMetadata(BaseModel):
    """Standardized metadata returned by every connector."""

    source_id: str
    source_uri: str
    source_type: str
    title: str | None = None
    author: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    content_hash: str | None = None
    byte_size: int | None = None
    mime_type: str | None = None
    permissions: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    extra: dict[str, Any] = Field(default_factory=dict)


class FetchResult(BaseModel):
    """Raw fetch result from a connector."""

    source_id: str
    raw_content: str
    normalized_content: str
    metadata: SourceMetadata
    fetch_errors: list[str] = Field(default_factory=list)


class SourceConnector(ABC):
    """
    Abstract base class for all source connectors.

    Every connector must implement:
      - discover(): list available sources
      - fetch(source_id): retrieve raw content
      - diff(source_id, since): return changed content since timestamp
      - normalize(raw_content): normalize to plain text / structured form
      - permissions(source_id): return permission list for this source
      - metadata(source_id): return SourceMetadata
    """

    source_type: str = "base"

    @abstractmethod
    def discover(self) -> list[SourceMetadata]:
        """Discover all available sources this connector can access."""

    @abstractmethod
    def fetch(self, source_id: str) -> FetchResult:
        """Fetch the full content of a specific source."""

    @abstractmethod
    def diff(self, source_id: str, since: datetime) -> FetchResult | None:
        """Return changes to a source since the given timestamp, or None if unchanged."""

    @abstractmethod
    def normalize(self, raw_content: str) -> str:
        """Normalize raw content to a clean, processable form."""

    @abstractmethod
    def permissions(self, source_id: str) -> list[str]:
        """Return the permission list for a source (user/group/role identifiers)."""

    @abstractmethod
    def metadata(self, source_id: str) -> SourceMetadata:
        """Return metadata for a specific source."""
