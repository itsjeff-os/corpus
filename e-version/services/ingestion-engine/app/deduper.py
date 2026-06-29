"""Deduper — detects and eliminates duplicate documents and chunks."""

from __future__ import annotations

import hashlib


class Deduper:
    """
    Deduplicates documents and chunks using content hashing.

    Two pieces of content are considered duplicates if they share the same
    SHA-256 hash of their normalized text.
    """

    def __init__(self) -> None:
        self._seen_hashes: set[str] = set()

    def hash(self, content: str) -> str:
        """Compute a SHA-256 content hash."""
        return hashlib.sha256(content.encode("utf-8")).hexdigest()

    def is_duplicate(self, content: str) -> bool:
        """Return True if this content has been seen before."""
        h = self.hash(content)
        return h in self._seen_hashes

    def register(self, content: str) -> str:
        """Register content and return its hash."""
        h = self.hash(content)
        self._seen_hashes.add(h)
        return h

    def filter(self, items: list[str]) -> list[str]:
        """Filter a list of content strings, returning only unseen items."""
        unique: list[str] = []
        for item in items:
            h = self.hash(item)
            if h not in self._seen_hashes:
                self._seen_hashes.add(h)
                unique.append(item)
        return unique

    def reset(self) -> None:
        """Clear the seen-hash registry (e.g., between ingestion runs)."""
        self._seen_hashes.clear()
