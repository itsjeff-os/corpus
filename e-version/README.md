# Personal Context Engine — E-Version

A deployable **Context Intelligence Platform** for reasoning over personal context with trust, source grounding, and policy awareness.

## Core Thesis

> The model should never be the database.

| Layer | Role |
|-------|------|
| **Sources** | Define truth |
| **Ingestion** | Normalize truth |
| **Knowledge systems** | Structure truth |
| **Retrieval** | Select truth |
| **Memory** | Route truth |
| **Session state** | Preserve intent |
| **LLM** | Reason over truth |

---

## What makes this different from basic RAG

Basic RAG retrieves **chunks**.  
E-Version retrieves **context** with policy, trust, freshness, structure, and memory boundaries.

The assistant knows:
- What to retrieve (retrieval planner)
- What to trust (trust scoring)
- What not to assume (policy gates)
- When context is stale (freshness scoring)
- How the conversation connects to your world (knowledge graph)
- Why it answered (retrieval trace in admin console)

---

## Architecture

```
personal-context-engine/
  services/
    api-gateway/          # Auth, rate limits, routing
    chat-orchestrator/    # Runtime intelligence loop
    retrieval-engine/     # Hybrid search + graph expansion
    ingestion-engine/     # Source → structured knowledge
    memory-engine/        # Typed, policy-gated memory
    knowledge-graph/      # Typed world model
    policy-engine/        # Access, memory, source, sensitivity policies
    eval-engine/          # Continuous quality evaluation
  packages/
    schemas/              # Core data models (Pydantic)
    connectors/           # Source connectors
    prompts/              # LLM prompt templates
    ranking/              # Trust, freshness, scoring, reranking
    citations/            # Citation formatting and verification
    observability/        # Tracing, metrics, audit logging
    auth/                 # JWT auth, tenant context
    conflict_resolution/  # Conflict resolution strategies
  workers/
    sync_worker/          # Source sync polling
    embedding_worker/     # Vector embedding generation
    extraction_worker/    # Entity and fact extraction
    eval_worker/          # Regression eval runner
  infrastructure/
    docker-compose.yml    # Single-user deployment
    migrations/           # Postgres schema migrations
  apps/
    cli/                  # Command-line interface
    web-console/          # Admin dashboard (planned)
    browser-extension/    # Browser activity connector (planned)
  context-fixtures/       # Sample context for development
  tests/
    unit/                 # Unit tests
    integration/          # Integration tests
    evals/                # Retrieval quality evals
  docs/
    architecture.md
    memory-policy.md
    retrieval-policy.md
    security-model.md
```

---

## Quick Start

### 1. Set up infrastructure

```bash
cp infrastructure/.env.example infrastructure/.env
# Edit .env — set POSTGRES_PASSWORD, REDIS_PASSWORD, OPENAI_API_KEY, etc.
docker compose -f infrastructure/docker-compose.yml up -d
```

### 2. Ingest your context

```bash
# Ingest a directory of markdown files
python -m apps.cli.main ingest ./your-docs/

# Ingest a specific file
python -m apps.cli.main ingest ./infra/topology.md
```

### 3. Chat

```bash
python -m apps.cli.main chat
```

---

## Running Tests

```bash
pip install pytest pydantic
python -m pytest tests/unit/ -q
```

---

## Key Design Decisions

### Retrieval Plan — Not Just Vector Search

Before searching, the system generates a typed retrieval plan:

```json
{
  "intent": "network_troubleshooting",
  "entities": ["apple_tv_lounge", "nas_main", "vlan_20"],
  "retrieval_modes": ["fact_lookup", "graph_traversal", "semantic", "lexical"],
  "freshness_requirement": "high",
  "risk_level": "operational"
}
```

### Trust-Scored Facts

Every fact carries a trust level:

```python
TrustLevel.PINNED           # 1.00 — immutable
TrustLevel.CANONICAL        # 0.95 — authoritative
TrustLevel.MACHINE_VERIFIED # 0.90 — machine-parsed export
TrustLevel.USER_CONFIRMED   # 0.85 — confirmed by user
TrustLevel.SOURCE_BACKED    # 0.75 — from a source
TrustLevel.INFERRED         # 0.45 — LLM inference
TrustLevel.STALE            # 0.25 — outdated
```

### Typed Memory

Memory is not one bucket:

```python
ProfileMemory      # Durable, user-visible, always requires confirmation
PreferenceMemory   # Durable, guides answer style
EnvironmentMemory  # Source-grounded, routes retrieval — never replaces it
ProceduralMemory   # Versioned, source-backed how-to knowledge
SessionMemory      # Short-lived, automatic
WorkingMemory      # Ephemeral per reasoning cycle
```

### Conflicts Are First-Class

```
⚠ Conflict on vlan_20.subnet:
  - 192.168.20.0/24 (source: vlans.md, trust: canonical)
  - 10.20.0.0/24 (source: router_export.json, trust: machine_verified)
  Resolution: prefer router_export.json (machine_verified, newer)
  Requires user review: true
```

---

## Docs

- [Architecture](docs/architecture.md)
- [Memory Policy](docs/memory-policy.md)
- [Retrieval Policy](docs/retrieval-policy.md)
- [Security Model](docs/security-model.md)
