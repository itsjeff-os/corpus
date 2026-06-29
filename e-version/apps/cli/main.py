"""Personal Context Engine CLI — command-line interface for the PCE."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def cmd_ingest(args: argparse.Namespace) -> None:
    """Ingest a local markdown file or directory."""
    from packages.connectors.markdown.connector import MarkdownConnector
    from services.ingestion_engine.app.pipeline import IngestionPipeline

    path = Path(args.path)
    if not path.exists():
        print(f"Error: path does not exist: {path}", file=sys.stderr)
        sys.exit(1)

    connector = MarkdownConnector(
        base_path=str(path) if path.is_dir() else str(path.parent),
        user_id=args.user_id,
    )
    pipeline = IngestionPipeline()
    sources = connector.discover() if path.is_dir() else [connector.metadata(str(path))]

    total = 0
    for source_meta in sources:
        result = pipeline.ingest(
            connector=connector,
            source_id=source_meta.source_id,
            tenant_id=args.tenant_id,
            user_id=args.user_id,
        )
        if result.skipped_duplicate:
            print(f"  Skipped (duplicate): {source_meta.source_id}")
        else:
            print(f"  Ingested: {source_meta.source_id} — {result.chunk_count} chunks, {result.entity_count} entities, {result.fact_count} facts")
        total += 1

    print(f"\nProcessed {total} source(s).")


def cmd_chat(args: argparse.Namespace) -> None:
    """Start an interactive chat session (requires LLM configuration)."""
    from packages.schemas.sessions import Session
    from services.chat_orchestrator.app.orchestrator import ChatOrchestrator, OrchestratorRequest

    session = Session(tenant_id=args.tenant_id, user_id=args.user_id)
    orchestrator = ChatOrchestrator()

    print("Personal Context Engine — Chat")
    print("Type 'exit' or Ctrl-C to quit.\n")

    try:
        while True:
            try:
                user_input = input("You: ").strip()
            except EOFError:
                break

            if user_input.lower() in ("exit", "quit", "q"):
                break
            if not user_input:
                continue

            request = OrchestratorRequest(
                session_id=session.id,
                user_id=args.user_id,
                tenant_id=args.tenant_id,
                message=user_input,
            )
            response = orchestrator.handle(request, session)
            print(f"\nAssistant: {response.answer}")
            if response.citations:
                print("\nSources:")
                for i, cit in enumerate(response.citations, start=1):
                    print(f"  {i}. {cit.get('source', 'unknown')}")
            if response.validation_issues:
                print("\n⚠ Validation issues:", ", ".join(response.validation_issues))
            print()
    except KeyboardInterrupt:
        pass

    print("\nSession ended.")


def cmd_status(args: argparse.Namespace) -> None:
    """Print system status."""
    print("Personal Context Engine — Status")
    print(f"  Tenant: {args.tenant_id}")
    print(f"  User:   {args.user_id}")
    print("\nService connectivity checks require a running Docker stack.")
    print("Run: docker compose -f infrastructure/docker-compose.yml ps")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="pce",
        description="Personal Context Engine — command-line interface",
    )
    parser.add_argument("--tenant-id", default="local", help="Tenant ID (default: local)")
    parser.add_argument("--user-id", default="local", help="User ID (default: local)")

    sub = parser.add_subparsers(dest="command", required=True)

    # ingest
    p_ingest = sub.add_parser("ingest", help="Ingest a file or directory")
    p_ingest.add_argument("path", help="Path to file or directory to ingest")
    p_ingest.set_defaults(func=cmd_ingest)

    # chat
    p_chat = sub.add_parser("chat", help="Start an interactive chat session")
    p_chat.set_defaults(func=cmd_chat)

    # status
    p_status = sub.add_parser("status", help="Show system status")
    p_status.set_defaults(func=cmd_status)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
