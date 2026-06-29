from __future__ import annotations

from .chunks import KnowledgeChunk


def extract(chunk: KnowledgeChunk) -> dict[str, object]:
    return {
        "chunk_id": chunk.chunk_id,
        "collection": chunk.collection,
        "entities": chunk.entities,
        "rooms": chunk.rooms,
        "domains": chunk.domains,
        "services": chunk.services,
        "tags": chunk.tags,
        "provenance": chunk.provenance,
    }
