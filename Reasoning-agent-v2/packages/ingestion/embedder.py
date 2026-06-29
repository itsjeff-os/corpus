from __future__ import annotations

from typing import Iterable
import hashlib
import os


def embed(text: str) -> list[float]:
    return hash_embedding(text)


def hash_embedding(text: str, dimensions: int = 32) -> list[float]:
    """Deterministic local embedding for tests and offline smoke checks.

    This is not a semantic production embedding. Use `none` to let a configured
    Chroma collection embed documents, or wire a provider-specific embedder.
    """

    digest = hashlib.sha256(text.encode("utf-8")).digest()
    values: list[float] = []
    while len(values) < dimensions:
        for byte in digest:
            values.append((byte / 255.0) * 2.0 - 1.0)
            if len(values) == dimensions:
                break
        digest = hashlib.sha256(digest).digest()
    return values


def embed_texts(texts: Iterable[str], mode: str | None = None) -> list[list[float]] | None:
    selected_mode = mode or os.getenv("INGESTION_EMBEDDING_MODE", "none")
    if selected_mode == "none":
        return None
    if selected_mode == "hash":
        return [hash_embedding(text) for text in texts]
    raise ValueError(f"Unsupported embedding mode: {selected_mode}")
