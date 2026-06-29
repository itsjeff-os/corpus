from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from typing import Iterable, Protocol
from urllib.parse import urlparse
import os

from .chunks import KnowledgeChunk
from .embedder import embed_texts


class UpsertClient(Protocol):
    def upsert_collection(
        self,
        collection_name: str,
        ids: list[str],
        documents: list[str],
        metadatas: list[dict[str, str | int | float | bool]],
        embeddings: list[list[float]] | None = None,
    ) -> None:
        ...


@dataclass
class UpsertResult:
    upserted: int
    collections: dict[str, int]

    def to_dict(self) -> dict[str, object]:
        return {"upserted": self.upserted, "collections": self.collections}


class ChromaHttpUpsertClient:
    def __init__(self, chroma_client: object):
        self._client = chroma_client

    @classmethod
    def from_env(cls) -> "ChromaHttpUpsertClient":
        try:
            import chromadb
        except ImportError as exc:  # pragma: no cover - depends on optional package
            raise RuntimeError(
                "chromadb is required for upsert mode. Install packages/ingestion/requirements.txt."
            ) from exc

        raw_url = os.getenv("CHROMA_URL", "http://localhost:8000")
        parsed = urlparse(raw_url)
        host = parsed.hostname or raw_url
        port = parsed.port
        ssl = parsed.scheme == "https"
        headers: dict[str, str] = {}
        api_key = os.getenv("CHROMA_API_KEY")
        if api_key:
            headers["x-chroma-token"] = api_key

        kwargs = {
            "host": host,
            "ssl": ssl,
            "headers": headers or None,
            "tenant": os.getenv("CHROMA_TENANT"),
            "database": os.getenv("CHROMA_DATABASE"),
        }
        if port is not None:
            kwargs["port"] = port
        kwargs = {key: value for key, value in kwargs.items() if value is not None}
        return cls(chromadb.HttpClient(**kwargs))

    def upsert_collection(
        self,
        collection_name: str,
        ids: list[str],
        documents: list[str],
        metadatas: list[dict[str, str | int | float | bool]],
        embeddings: list[list[float]] | None = None,
    ) -> None:
        collection = self._client.get_or_create_collection(name=collection_name)
        kwargs = {
            "ids": ids,
            "documents": documents,
            "metadatas": metadatas,
        }
        if embeddings is not None:
            kwargs["embeddings"] = embeddings
        collection.upsert(**kwargs)


def upsert(
    items: Iterable[KnowledgeChunk],
    client: UpsertClient | None = None,
    embedding_mode: str | None = None,
) -> UpsertResult:
    chunks = list(items)
    grouped: dict[str, list[KnowledgeChunk]] = defaultdict(list)
    for chunk in chunks:
        grouped[chunk.collection].append(chunk)

    selected_client = client or ChromaHttpUpsertClient.from_env()
    collection_counts: dict[str, int] = {}

    for collection_name, collection_chunks in grouped.items():
        ids = [chunk.chunk_id for chunk in collection_chunks]
        documents = [chunk.text for chunk in collection_chunks]
        metadatas = [chunk.chroma_metadata() for chunk in collection_chunks]
        embeddings = embed_texts(documents, mode=embedding_mode)
        selected_client.upsert_collection(collection_name, ids, documents, metadatas, embeddings)
        collection_counts[collection_name] = len(collection_chunks)

    return UpsertResult(upserted=len(chunks), collections=collection_counts)
