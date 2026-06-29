"""Chunker — splits normalized text into semantically coherent chunks."""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class RawChunk:
    content: str
    chunk_index: int
    start_char: int
    end_char: int
    section: str = ""
    heading_path: list[str] | None = None

    def __post_init__(self) -> None:
        if self.heading_path is None:
            self.heading_path = []


class Chunker:
    """
    Splits normalized text into chunks suitable for embedding and retrieval.

    Strategy:
    - For markdown: split on headings, then on paragraph breaks.
    - For plain text: split on paragraph breaks, then on sentence boundaries.
    - Overlap: each chunk may optionally include a small overlap with its neighbors.
    """

    def __init__(
        self,
        max_tokens: int = 512,
        overlap_tokens: int = 64,
        chars_per_token: int = 4,
    ) -> None:
        self.max_chars = max_tokens * chars_per_token
        self.overlap_chars = overlap_tokens * chars_per_token

    def chunk_markdown(self, text: str) -> list[RawChunk]:
        """Chunk a markdown document, respecting heading boundaries."""
        sections = self._split_by_headings(text)
        chunks: list[RawChunk] = []
        idx = 0
        offset = 0
        for section_text, heading_path in sections:
            section_chunks = self._split_by_size(section_text, start_offset=offset)
            for raw_chunk in section_chunks:
                chunks.append(
                    RawChunk(
                        content=raw_chunk["content"],
                        chunk_index=idx,
                        start_char=raw_chunk["start"],
                        end_char=raw_chunk["end"],
                        heading_path=heading_path,
                        section=heading_path[-1] if heading_path else "",
                    )
                )
                idx += 1
            offset += len(section_text)
        return chunks

    def chunk_text(self, text: str) -> list[RawChunk]:
        """Chunk plain text by paragraph boundaries."""
        if not text or not text.strip():
            return []
        raw_chunks = self._split_by_size(text)
        return [
            RawChunk(
                content=rc["content"],
                chunk_index=i,
                start_char=rc["start"],
                end_char=rc["end"],
            )
            for i, rc in enumerate(raw_chunks)
            if rc["content"].strip()
        ]

    def _split_by_headings(self, text: str) -> list[tuple[str, list[str]]]:
        """Split markdown by ATX headings, returning (section_text, heading_path) pairs."""
        heading_re = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)
        matches = list(heading_re.finditer(text))
        if not matches:
            return [(text, [])]

        sections: list[tuple[str, list[str]]] = []
        heading_stack: list[tuple[int, str]] = []
        prev_end = 0

        for m in matches:
            if m.start() > prev_end:
                preamble = text[prev_end : m.start()]
                if preamble.strip():
                    path = [h for _, h in heading_stack]
                    sections.append((preamble, path))

            level = len(m.group(1))
            title = m.group(2).strip()
            heading_stack = [(l, t) for l, t in heading_stack if l < level]
            heading_stack.append((level, title))
            prev_end = m.end() + 1

        if prev_end < len(text):
            tail = text[prev_end:]
            if tail.strip():
                path = [h for _, h in heading_stack]
                sections.append((tail, path))

        return sections

    def _split_by_size(self, text: str, start_offset: int = 0) -> list[dict]:
        """Split text into max_chars-sized chunks with overlap."""
        paragraphs = re.split(r"\n{2,}", text)
        chunks: list[dict] = []
        current: list[str] = []
        current_len = 0
        pos = start_offset

        for para in paragraphs:
            para_len = len(para)
            if current_len + para_len > self.max_chars and current:
                content = "\n\n".join(current)
                chunks.append({"content": content, "start": pos - current_len, "end": pos})
                # Overlap: keep last overlap_chars worth
                overlap_text = content[-self.overlap_chars :]
                current = [overlap_text]
                current_len = len(overlap_text)
            current.append(para)
            current_len += para_len + 2
            pos += para_len + 2

        if current:
            content = "\n\n".join(current)
            chunks.append({"content": content, "start": pos - current_len, "end": pos})

        return chunks
