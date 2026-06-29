from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable

from .chunks import KnowledgeChunk, SECRET_TEXT_RE
from .collections import HOME_CHROMA_COLLECTIONS


@dataclass
class ValidationReport:
    ok: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        return {"ok": self.ok, "errors": self.errors, "warnings": self.warnings}


def validate_chunks(chunks: Iterable[KnowledgeChunk]) -> ValidationReport:
    errors: list[str] = []
    warnings: list[str] = []
    seen_ids: set[str] = set()

    for chunk in chunks:
        if not chunk.chunk_id:
            errors.append("chunk missing chunk_id")
        if chunk.chunk_id in seen_ids:
            errors.append(f"duplicate chunk_id: {chunk.chunk_id}")
        seen_ids.add(chunk.chunk_id)

        if chunk.collection not in HOME_CHROMA_COLLECTIONS:
            errors.append(f"{chunk.chunk_id}: unknown collection {chunk.collection}")
        if not chunk.content_hash:
            errors.append(f"{chunk.chunk_id}: missing content_hash")
        if not chunk.source_file:
            errors.append(f"{chunk.chunk_id}: missing source_file")
        if not chunk.source_path:
            errors.append(f"{chunk.chunk_id}: missing source_path")
        if not chunk.text.strip():
            errors.append(f"{chunk.chunk_id}: empty text")

        if SECRET_TEXT_RE.search(chunk.text):
            errors.append(f"{chunk.chunk_id}: possible unredacted secret in text")
        if chunk.collection == "home_ha_automations" and not chunk.services:
            warnings.append(f"{chunk.chunk_id}: automation/script chunk has no service/action call")
        if not chunk.domains:
            warnings.append(f"{chunk.chunk_id}: no domains detected")

    return ValidationReport(ok=not errors, errors=errors, warnings=warnings)
