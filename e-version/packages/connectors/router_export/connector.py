"""Router export connector — ingests network router configuration exports."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime
from pathlib import Path
from typing import Any

from ..base import FetchResult, SourceConnector, SourceMetadata


class RouterExportConnector(SourceConnector):
    """
    Connector for router configuration exports (JSON/YAML/text).

    These are treated as machine_verified, high-trust sources.
    """

    source_type = "router_export"

    def __init__(self, export_path: str, user_id: str = "local", permissions: list[str] | None = None) -> None:
        self.export_path = Path(export_path)
        self.user_id = user_id
        self._permissions = permissions or [user_id]

    def discover(self) -> list[SourceMetadata]:
        results: list[SourceMetadata] = []
        for path in sorted(self.export_path.glob("*.json")) + sorted(self.export_path.glob("*.yaml")) + sorted(self.export_path.glob("*.txt")):
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
        """Try to parse JSON and return a normalized text representation."""
        try:
            data: Any = json.loads(raw_content)
            return json.dumps(data, indent=2)
        except (json.JSONDecodeError, ValueError):
            return raw_content.strip()

    def permissions(self, source_id: str) -> list[str]:
        return self._permissions

    def metadata(self, source_id: str) -> SourceMetadata:
        path = Path(source_id)
        stat = path.stat()
        content_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        suffix = path.suffix.lower()
        mime_map = {".json": "application/json", ".yaml": "application/yaml", ".txt": "text/plain"}
        return SourceMetadata(
            source_id=source_id,
            source_uri=str(path.resolve()),
            source_type=self.source_type,
            title=path.stem,
            created_at=datetime.utcfromtimestamp(stat.st_ctime),
            updated_at=datetime.utcfromtimestamp(stat.st_mtime),
            content_hash=content_hash,
            byte_size=stat.st_size,
            mime_type=mime_map.get(suffix, "application/octet-stream"),
            permissions=self._permissions,
            extra={"trust_level": "machine_verified"},
        )
