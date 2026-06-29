# Architecture — Personal Context Engine (E-Version)

## Core Thesis

> The model should never be the database.

Instead:
- **Sources** define truth.
- **Ingestion** normalizes truth.
- **Knowledge systems** structure truth.
- **Retrieval** selects truth.
- **Memory** routes truth.
- **Session state** preserves intent.
- **The LLM** reasons over truth.

---

## Top-Level Structure

```
personal-context-engine/
  services/          # Backend microservices
  packages/          # Shared libraries
  workers/           # Async background workers
  infrastructure/    # Docker, Postgres migrations, K8s, Terraform
  apps/              # Web console, CLI, desktop agent, browser extension
  context-fixtures/  # Sample context data for development
  tests/             # Unit, integration, and eval tests
  docs/              # Architecture and policy documentation
```

---

## Services

### API Gateway
**Responsibilities:** Auth, rate limits, tenant isolation, request routing, audit logging, API keys, webhooks.

No intelligence happens here. It is the front door.

### Chat Orchestrator
**The brain of the runtime flow.**

1. Receive user message
2. Load session state
3. Classify intent → generate retrieval plan
4. Call Retrieval Engine
5. Call Memory Engine
6. Assemble model context (layered)
7. Call LLM
8. Validate output (groundedness, citation check)
9. Write session updates
10. Return answer + citations + memory proposals

### Retrieval Engine
**The core intelligence layer.**

Performs hybrid retrieval:
- Semantic (vector) search
- Lexical (BM25) search
- Knowledge graph expansion
- Entity-aware retrieval
- Fact lookup
- Metadata and permission filtering
- Trust and freshness ranking
- Conflict detection and surfacing
- Context packing with token budget management
- Citation binding

### Ingestion Engine
Turns messy sources into usable intelligence.

Pipeline: `Fetch → Normalize → Dedupe → Chunk → Extract Entities → Extract Facts → Embed → Index → Score Trust → Detect Conflicts → Store Provenance`

Supported sources: Google Drive, Notion, GitHub, Slack, email, calendar, router configs, network exports, markdown, PDFs, screenshots, CSV/JSON/YAML, manual notes, browser bookmarks, terminal logs.

### Memory Engine
Not one memory bucket — typed memory classes with different rules:

| Type | Durability | Grounding | Confirmation |
|------|-----------|-----------|--------------|
| Profile | Durable | Required | Always |
| Preference | Durable | Soft | For new |
| Environment | Durable | Required | Always |
| Project | Durable | Soft | Optional |
| Procedural | Versioned | Required | Always |
| Relationship | Durable | Soft | Optional |
| Session | Short-lived | None | Never |
| Working | Ephemeral | None | Never |

**Key principle: Memory routes retrieval. Memory does not replace retrieval.**

### Knowledge Graph Service
Stores a typed world model.

**Entity types:** Person, Device, Network, VLAN, Subnet, Service, Project, Document, Task, Location, CredentialReference, Procedure, Issue, Decision, Preference, Source, Fact, Rule, Event

**Relation types:** device_on_network, service_hosted_on, vlan_routes_to, document_mentions_entity, person_owns_device, project_depends_on, fact_derived_from_source, memory_grounded_by_fact, issue_affects_service, procedure_applies_to_device

### Policy Engine
Controls what may be used, stored, updated, or shown.

- **Access Policy:** Which facts and chunks may be retrieved
- **Memory Policy:** When memories may be created or updated
- **Source Policy:** Which sources may be queried
- **Sensitivity Policy:** Redaction and flagging of sensitive data

### Eval Engine
Continuous quality checks.

Metrics tracked: retrieval precision/recall, citation correctness, stale fact usage, conflict handling, answer groundedness, session coherence, memory promotion correctness, hallucination rate, latency, cost.

---

## Ranking Formula

```
final_score =
  semantic_score    * 0.20 +
  lexical_score     * 0.15 +
  entity_overlap    * 0.20 +
  graph_relevance   * 0.15 +
  trust_score       * 0.15 +
  freshness_score   * 0.10 +
  session_relevance * 0.05
```

For technical config queries, exact match and trust outrank semantic similarity.

---

## Storage Architecture

| Store | Purpose |
|-------|---------|
| **Postgres + pgvector** | Canonical structured data + vector embeddings |
| **Meilisearch** | BM25 lexical search, config/symbol search |
| **MinIO (Object Store)** | Raw source snapshots, parsed text, exports |
| **Redis** | Session state, retrieval cache, rate limits, job locks |
| **Queue** | Async ingestion, embedding, extraction, eval jobs |

---

## Chat-Time Intelligence Flow

```
User message
  → Intent classification
  → Entity extraction
  → Session state load
  → Memory routing
  → Retrieval plan generation
  → Hybrid search (semantic + lexical)
  → Knowledge graph expansion
  → Fact lookup
  → Conflict / staleness checks
  → Reranking
  → Context assembly (layered)
  → LLM reasoning
  → Grounding validation
  → Answer with citations
  → Session update
  → Optional memory proposal
```

---

## Trust Levels

| Level | Score | Description |
|-------|-------|-------------|
| pinned | 1.00 | Immutable user-pinned fact |
| canonical | 0.95 | Authoritative source fact |
| machine_verified | 0.90 | Machine-parsed export |
| user_confirmed | 0.85 | Explicitly confirmed by user |
| source_backed | 0.75 | Derived from a source |
| derived | 0.60 | Logically derived |
| inferred | 0.45 | LLM inferred — low confidence |
| stale | 0.25 | Outdated fact |
| conflicted | 0.15 | Conflicting claims exist |
| deprecated | 0.05 | Retired fact |

---

## Deployment

### Local / Single-User

```bash
cp infrastructure/.env.example infrastructure/.env
# Edit .env with your secrets
docker compose -f infrastructure/docker-compose.yml up -d
```

### CLI

```bash
# Ingest your context docs
python -m apps.cli.main ingest ./your-docs/

# Start a chat session
python -m apps.cli.main chat
```
