"""Markdown source connector — ingests local markdown files."""

from __future__ import annotations

import hashlib
import os
from datetime import datetime
from pathlib import Path

from ..base import FetchResult, SourceConnector, SourceMetadata


class MarkdownConnector(SourceConnector):
    """Connector for local markdown files and directories."""

    source_type = "markdown"

    def __init__(self, base_path: str, user_id: str = "local", permissions: list[str] | None = None) -> None:
        self.base_path = Path(base_path)
        self.user_id = user_id
        self._permissions = permissions or [user_id]

    def discover(self) -> list[SourceMetadata]:
        results: list[SourceMetadata] = []
        for path in sorted(self.base_path.rglob("*.md")):
            results.append(self.metadata(str(path)))
        return results

    def fetch(self, source_id: str) -> FetchResult:
        path = Path(source_id)
        raw = path.read_text(encoding="utf-8")
        normalized = self.normalize(raw)
        return FetchResult(
            source_id=source_id,
            raw_content=raw,
            normalized_content=normalized,
            metadata=self.metadata(source_id),
        )

    def diff(self, source_id: str, since: datetime) -> FetchResult | None:
        path = Path(source_id)
        mtime = datetime.utcfromtimestamp(path.stat().st_mtime)
        if mtime <= since:
            return None
        return self.fetch(source_id)

    def normalize(self, raw_content: str) -> str:
        return raw_content.strip()

    def permissions(self, source_id: str) -> list[str]:
        return self._permissions

    def metadata(self, source_id: str) -> SourceMetadata:
        path = Path(source_id)
        stat = path.stat()
        content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        return SourceMetadata(
            source_id=source_id,
            source_uri=str(path.resolve()),
            source_type=self.source_type,
            title=path.stem,
            created_at=datetime.utcfromtimestamp(stat.st_ctime),
            updated_at=datetime.utcfromtimestamp(stat.st_mtime),
            content_hash=content_hash,
            byte_size=stat.st_size,
            mime_type="text/markdown",
            permissions=self._permissions,
        )
