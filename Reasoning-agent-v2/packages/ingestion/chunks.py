from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
import hashlib
import json
import re

from .collections import HomeChromaCollection

SECRET_TEXT_RE = re.compile(
    r"(?i)\b(api[_-]?key|authorization|bearer|password|secret|token)\b\s*[:=]\s*['\"]?[^'\"\s,}]+"
)
HA_SECRET_RE = re.compile(r"!secret\s+[\w.-]+")


def stable_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def redact_text(text: str) -> str:
    redacted = HA_SECRET_RE.sub("!secret <redacted>", text)
    return SECRET_TEXT_RE.sub(lambda match: f"{match.group(1)}=<redacted>", redacted)


def redact_value(value: Any) -> Any:
    if isinstance(value, str):
        return redact_text(value)
    if isinstance(value, list):
        return [redact_value(item) for item in value]
    if isinstance(value, tuple):
        return [redact_value(item) for item in value]
    if isinstance(value, dict):
        redacted: dict[Any, Any] = {}
        for key, item in value.items():
            key_text = str(key).lower()
            if any(marker in key_text for marker in ("api_key", "apikey", "authorization", "password", "secret", "token")):
                redacted[key] = "<redacted>"
            else:
                redacted[key] = redact_value(item)
        return redacted
    return value


def normalize_list(values: list[str] | tuple[str, ...] | set[str] | None) -> list[str]:
    if not values:
        return []
    return sorted({value for value in values if value})


def metadata_scalar(value: Any) -> str | int | float | bool:
    if isinstance(value, (str, int, float, bool)):
        return value
    return json.dumps(value, sort_keys=True)


@dataclass
class KnowledgeChunk:
    chunk_id: str
    collection: HomeChromaCollection
    text: str
    source_type: str
    source_file: str
    source_path: str
    content_hash: str = ""
    entities: list[str] = field(default_factory=list)
    rooms: list[str] = field(default_factory=list)
    domains: list[str] = field(default_factory=list)
    services: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    provenance: dict[str, Any] = field(default_factory=dict)
    raw: Any | None = None

    def __post_init__(self) -> None:
        self.text = redact_text(self.text)
        self.raw = redact_value(self.raw)
        self.entities = normalize_list(self.entities)
        self.rooms = normalize_list(self.rooms)
        self.domains = normalize_list(self.domains)
        self.services = normalize_list(self.services)
        self.tags = normalize_list(self.tags)
        self.provenance = redact_value(self.provenance)
        if not self.content_hash:
            self.content_hash = stable_hash(
                json.dumps(
                    {
                        "text": self.text,
                        "source_file": self.source_file,
                        "source_path": self.source_path,
                        "collection": self.collection,
                    },
                    sort_keys=True,
                )
            )

    @property
    def metadata(self) -> dict[str, Any]:
        return {
            "collection": self.collection,
            "content_hash": self.content_hash,
            "source_type": self.source_type,
            "source_file": self.source_file,
            "source_path": self.source_path,
            "entities": self.entities,
            "rooms": self.rooms,
            "domains": self.domains,
            "services": self.services,
            "tags": self.tags,
            "provenance": self.provenance,
        }

    def chroma_metadata(self) -> dict[str, str | int | float | bool]:
        metadata = {
            "collection": self.collection,
            "content_hash": self.content_hash,
            "source_type": self.source_type,
            "source_file": self.source_file,
            "source_path": self.source_path,
            "entities": self.entities,
            "rooms": self.rooms,
            "domains": self.domains,
            "services": self.services,
            "tags": self.tags,
            "provenance": self.provenance,
            "entities_text": " ".join(self.entities),
            "rooms_text": " ".join(self.rooms),
            "domains_text": " ".join(self.domains),
            "services_text": " ".join(self.services),
            "tags_text": " ".join(self.tags),
        }
        return {key: metadata_scalar(value) for key, value in metadata.items()}

    def to_manifest_item(self) -> dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "collection": self.collection,
            "content_hash": self.content_hash,
            "source_type": self.source_type,
            "source_file": self.source_file,
            "source_path": self.source_path,
            "entities": self.entities,
            "rooms": self.rooms,
            "domains": self.domains,
            "services": self.services,
            "tags": self.tags,
            "text_preview": self.text[:240],
        }


def source_file_label(path: str | Path) -> str:
    return str(Path(path))
