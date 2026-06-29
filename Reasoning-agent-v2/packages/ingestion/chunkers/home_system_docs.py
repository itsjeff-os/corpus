from __future__ import annotations

from pathlib import Path
from typing import Iterable
import re

from ..chunks import KnowledgeChunk, source_file_label, stable_hash
from ..collections import collection_for_document

HEADING_RE = re.compile(r"^(#{1,4})\s+(.+?)\s*$", re.MULTILINE)
ROOM_RE = re.compile(
    r"\b(?:Alpha|Beta|Bedroom 1|Bedroom 2|Bathroom 1|Ensuite|Hallway|Kitchen|Laundry|Open Plan|Pass|Primary Bedroom|Rear Bathroom|Rear Bedroom|Storage|Walk-in Wardrobe)\b",
    re.IGNORECASE,
)


def _sections(text: str) -> Iterable[tuple[str, str]]:
    matches = list(HEADING_RE.finditer(text))
    if not matches:
        yield "document", text
        return

    preface = text[: matches[0].start()].strip()
    if preface:
        yield "preface", preface

    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        title = match.group(2).strip()
        body = text[start:end].strip()
        if body:
            yield title, body


def _split_large_section(title: str, body: str, max_chars: int = 3500) -> Iterable[tuple[str, str]]:
    if len(body) <= max_chars:
        yield title, body
        return

    paragraphs = [paragraph.strip() for paragraph in body.split("\n\n") if paragraph.strip()]
    current: list[str] = []
    current_len = 0
    part = 1
    for paragraph in paragraphs:
        if current and current_len + len(paragraph) > max_chars:
            yield f"{title} part {part}", "\n\n".join(current)
            part += 1
            current = []
            current_len = 0
        current.append(paragraph)
        current_len += len(paragraph)
    if current:
        yield f"{title} part {part}" if part > 1 else title, "\n\n".join(current)


def chunk_home_system_document(path: str | Path) -> list[KnowledgeChunk]:
    source_path = Path(path)
    text = source_path.read_text(encoding="utf-8", errors="replace")
    chunks: list[KnowledgeChunk] = []

    for section_index, (title, body) in enumerate(_sections(text)):
        for part_title, part_body in _split_large_section(title, body):
            collection = collection_for_document(str(source_path), part_title + " " + part_body[:500])
            rooms = sorted({match.group(0).lower() for match in ROOM_RE.finditer(part_body)})
            chunk_id = stable_hash(f"{source_path}:{section_index}:{part_title}")[:24]
            chunks.append(
                KnowledgeChunk(
                    chunk_id=f"home_doc.{source_path.stem}.{chunk_id}",
                    collection=collection,
                    text=f"Home system document section: {part_title}\n\n{part_body}",
                    source_type="home_system_document",
                    source_file=source_file_label(source_path),
                    source_path=part_title,
                    entities=[],
                    rooms=rooms,
                    domains=["home_system"],
                    services=[],
                    tags=["document", collection],
                    provenance={
                        "loader": "home_system_docs",
                        "section": part_title,
                    },
                    raw={"title": part_title, "body": part_body},
                )
            )

    return chunks
