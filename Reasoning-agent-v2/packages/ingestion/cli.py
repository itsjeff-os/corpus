from __future__ import annotations

from argparse import ArgumentParser
from pathlib import Path
from typing import Iterable
import json
import sys

from .chunks import KnowledgeChunk
from .chunkers.home_assistant_yaml import chunk_home_assistant_yaml
from .chunkers.home_system_docs import chunk_home_system_document
from .upsert import upsert
from .validation import validate_chunks

YAML_SUFFIXES = {".yaml", ".yml"}
DOC_SUFFIXES = {".md", ".txt"}


def iter_source_files(paths: Iterable[str]) -> list[Path]:
    files: list[Path] = []
    for raw_path in paths:
        path = Path(raw_path)
        if path.is_dir():
            for child in sorted(path.rglob("*")):
                if child.is_file() and child.suffix.lower() in YAML_SUFFIXES | DOC_SUFFIXES:
                    files.append(child)
        elif path.is_file():
            files.append(path)
    return files


def load_chunks(paths: Iterable[str]) -> tuple[list[KnowledgeChunk], list[str]]:
    chunks: list[KnowledgeChunk] = []
    warnings: list[str] = []
    for path in iter_source_files(paths):
        suffix = path.suffix.lower()
        try:
            if suffix in YAML_SUFFIXES:
                chunks.extend(chunk_home_assistant_yaml(path))
            elif suffix in DOC_SUFFIXES:
                chunks.extend(chunk_home_system_document(path))
        except Exception as exc:
            warnings.append(f"{path}: {exc}")
    return chunks, warnings


def build_manifest(mode: str, chunks: list[KnowledgeChunk], warnings: list[str]) -> dict[str, object]:
    validation = validate_chunks(chunks)
    collection_counts: dict[str, int] = {}
    for chunk in chunks:
        collection_counts[chunk.collection] = collection_counts.get(chunk.collection, 0) + 1
    return {
        "mode": mode,
        "ok": validation.ok and not warnings,
        "chunk_count": len(chunks),
        "collections": collection_counts,
        "warnings": warnings + validation.warnings,
        "errors": validation.errors,
        "chunks": [chunk.to_manifest_item() for chunk in chunks],
    }


def main(argv: list[str] | None = None) -> int:
    parser = ArgumentParser(description="Home system ingestion CLI")
    parser.add_argument("mode", choices=("dry-run", "validate", "upsert"))
    parser.add_argument("paths", nargs="+", help="Files or directories to ingest")
    parser.add_argument(
        "--embedding-mode",
        default=None,
        choices=("none", "hash"),
        help="Embedding mode for Chroma upsert. Defaults to INGESTION_EMBEDDING_MODE or none.",
    )
    args = parser.parse_args(argv)

    chunks, warnings = load_chunks(args.paths)
    manifest = build_manifest(args.mode, chunks, warnings)

    if args.mode == "validate":
        print(json.dumps(manifest, indent=2, sort_keys=True))
        return 0 if manifest["ok"] else 1

    if args.mode == "dry-run":
        print(json.dumps(manifest, indent=2, sort_keys=True))
        return 0 if not manifest["errors"] else 1

    if manifest["errors"] or warnings:
        print(json.dumps(manifest, indent=2, sort_keys=True))
        return 1

    result = upsert(chunks, embedding_mode=args.embedding_mode)
    manifest["upsert"] = result.to_dict()
    print(json.dumps(manifest, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
