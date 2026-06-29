# Scaffold changelog

## v3 Codex build pack

Added a Cloudflare-first repo scaffold and Codex handoff layer.

### Added

- CODEX.md
- BUILD_BRIEF.md
- ONTOLOGY_GUARDRAILS.md
- ARCHITECTURE.md
- RUNTIME_MAP.md
- HANDOFF_TEMPLATE.md
- Cloudflare Worker skeleton
- Queue handlers
- Durable Object placeholders
- D1 schema draft
- Supabase migration drafts
- Reasoning, epistemics, metacognition, governance, constraints, strategies, context, substrates, actions, ingestion, retrieval, knowledge, and eval packages
- Home Assistant YAML chunker placeholder retained as an ingestion component

### Did not do

- Did not implement real autonomy.
- Did not wire production credentials.
- Did not make Chroma/Zep/Supabase clients operational.
- Did not collapse ontology into generic memory/RAG.
- Did not treat schemas as final.

## Home automation ingestion stage 1

Implemented the staged Home Assistant + home system ingestion foundation.

### Added

- Canonical source layout under `sources/`
- Home Assistant migration staging docs
- Typed Chroma collection constants
- Home Assistant-aware YAML chunking with custom tag support and redaction
- Home system document chunking
- Ingestion CLI for `dry-run`, `validate`, and `upsert`
- Chroma upsert plumbing for grouped, idempotent chunk writes
- Runtime Chroma query helpers for intent, entity, room, and similar automation retrieval
- Python and Vitest coverage for parsing, validation, upsert grouping, and query requests

### Still deferred

- Live Home Assistant config migration
- Production Chroma credentials and collection IDs
- Provider-grade semantic embedding configuration
- Governance changes for autonomous action execution
