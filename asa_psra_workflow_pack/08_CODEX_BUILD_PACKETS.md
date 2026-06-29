# Codex Build Packets

## 1. ASA deployed-first Worker ticket

```text
Execution Mode:
RUNTIME_WIRING

Decision Status:
Closed.

Task:
Build and deploy ASA v0.1 as a Cloudflare Worker evidence intake service.

Goal:
Create a deployed Actual State Audit intake surface that receives repo/system evidence, stores it, and returns clear actual-state snapshot outputs.

In Scope:
- create Cloudflare Worker project for ASA
- configure staging and production Wrangler environments
- implement GET /health
- implement POST /v1/asa/artifacts
- implement POST /v1/asa/snapshots
- implement GET /v1/asa/snapshots/:id
- implement GET /v1/asa/reports/:id
- define ASA snapshot JSON schema
- define status labels:
  - Captured
  - Derived
  - Inferred
  - Expected but absent
  - Not captured
  - Conflicting
  - Stale/unknown
- store raw artefacts/reports in R2
- store structured snapshot metadata in Supabase
- render a clean markdown snapshot card
- add a GitHub Action template that collects repo state and POSTs snapshot JSON to the deployed ASA endpoint
- add remote smoke test script that calls deployed staging endpoints
- document deployed usage in README

Out of Scope:
- no local-first CLI requirement
- no automatic fixes
- no recommendations
- no repo mutation
- no PR creation
- no Neo4j writes yet
- no n8n integration yet
- no MCP server yet
- no model audit pass yet unless explicitly required
- no frontend dashboard

Non-Negotiables:
- ASA is evidence intake and actual-state reporting only
- do not infer local repo state unless evidence is submitted
- do not treat config as proof of runtime handler behaviour
- do not treat deployment config as deployment proof
- do not treat capability as authority
- preserve unknown and not-captured states
- deployed route must be testable via HTTP

Allowed Discretion:
- choose internal file layout
- choose exact Supabase table names if semantically equivalent
- choose R2 key structure
- choose markdown rendering details
- choose smoke test implementation

Escalate Only If:
- Cloudflare binding setup is missing
- required secret/env var is missing
- Supabase schema cannot be applied
- R2 binding is unavailable
- deployed endpoint cannot be smoke-tested
- implementation would require mutating audited repos

Definition of Done:
- staging Worker deploys successfully
- GET /health returns ok from deployed staging route
- POST /v1/asa/snapshots accepts valid snapshot JSON
- GET /v1/asa/snapshots/:id returns stored snapshot
- GET /v1/asa/reports/:id returns readable markdown
- raw artefact/report storage path is documented
- Supabase records are created for submitted snapshots
- GitHub Action template is included
- remote smoke test passes against staging
- README documents deployed usage

After execution, report only:
- deployed staging URL
- files changed
- Cloudflare bindings expected
- Supabase migration added
- commands run
- smoke test result
- blockers
```

---

## 2. ASA future JeffeOS runtime capability ticket

Use only if explicitly promoted into the runtime substrate.

```text
Execution Mode:
RUNTIME_WIRING

Decision Status:
Closed.

Task:
Add ASA v0.1 as a first-class read-only capability inside the existing JeffeOS assistant runtime substrate.

Goal:
Expose an Actual State Audit capability that reads the existing Supabase contract plane and Neo4j capability graph, then returns a structured objective runtime substrate snapshot.

In Scope:
- add ASA tool contract to tooling.tool_registry
- mirror ASA capability into Neo4j using existing graph ontology
- implement MCP tool: asa_runtime_snapshot
- read current tool registry entries
- read current Neo4j capability graph summary
- return structured ASA receipt
- emit declared runtime events
- include unknown/not-captured fields
- preserve Captured / Derived / Inferred / Not captured labels
- document the tool contract and receipt schema

Out of Scope:
- no separate ASA registry
- no new control plane
- no recommendations
- no fixes
- no repo mutation
- no auto PRs
- no frontend
- no n8n integration yet
- no broad repo scanner yet
- no Cloudflare Worker rebuild unless required for routing
- no changes to existing tool contracts except adding ASA

Non-Negotiables:
- ASA is read-only
- ASA describes actual declared/observed state only
- do not infer handler behaviour from contract presence
- do not treat graph mirror as proof of runtime execution
- do not treat declared event semantics as observed events
- distinguish live/captured/declared/graph-modeled/not-captured
- return a receipt, not just prose
- emit runtime event for capability call/snapshot creation if existing event path supports it

Escalate Only If:
- tooling.tool_registry schema lacks required fields for ASA contract
- Neo4j write path is unavailable
- MCP tool registration path is unclear
- runtime-event emission path is unavailable
- required credentials/bindings are missing

Definition of Done:
- ASA tool contract exists in tooling.tool_registry
- ASA appears in Neo4j as a Tool node with relationships
- MCP exposes asa_runtime_snapshot
- calling asa_runtime_snapshot returns structured receipt
- receipt includes contracts, graph summary, substrates, unknowns, evidence refs, and confidence labels
- runtime event is emitted or unavailable event path is explicitly reported
- documentation updated with tool contract and example receipt

After execution, report only:
- files changed
- database rows/contracts added
- graph nodes/relationships added
- MCP tool exposed
- command/test calls run
- sample receipt
- blockers
```

---

## 3. PSRA dynamic workflow build packet, compact

```text
Execution Mode:
RUNTIME_WIRING

Decision Status:
Closed.

Task:
Build PSRA v1.1 as a manifest-driven Cloudflare workflow.

Goal:
Create a deployed workflow runner that performs Passive Structural Runtime Audit using versioned phases, validators, structured outputs, and persisted reports.

In Scope:
- Cloudflare Worker API routes for workflow runs and results
- PSRA v1.1 manifest
- R2 artefact/report storage
- Supabase workflow run metadata
- phase outputs
- validators:
  - no fixes
  - no recommendations
  - component-first
  - implementation-vs-intent
  - uncertainty preservation
  - evidence reference
  - materiality
- markdown report renderer
- run status endpoint
- remote smoke tests

Out of Scope:
- no automatic fixes
- no code mutation
- no PR creation
- no generic assistant
- no multi-agent debate
- no frontend unless explicitly requested

Non-Negotiables:
- PSRA is audit-only
- component analysis must precede whole-system synthesis
- docs/names/comments are not proof of implementation
- uncertainty must remain unresolved
- final output must not include recommendations

Definition of Done:
- deployed staging route works
- workflow run can be created
- supplied artefact can be stored
- PSRA report can be generated and retrieved
- invalid report with recommendations is rejected
- remote smoke test passes

After execution, report only:
- deployed URL
- files changed
- bindings expected
- database migration added
- commands run
- smoke test result
- blockers
```

---

## 4. GitHub Action collector ticket

```text
Execution Mode:
BOUNDED_EXACT_IMPLEMENTATION

Decision Status:
Closed.

Task:
Add a GitHub Action that collects repo state and submits it to the deployed ASA endpoint.

Goal:
Allow any repo to generate evidence for ASA without local manual collection.

In Scope:
- workflow_dispatch action
- checkout repo
- collect file tree
- collect package/config files:
  - package.json
  - wrangler.toml
  - Dockerfile
  - docker-compose.yml
  - .env.example
  - README/docs
  - supabase migrations
  - GitHub Actions
  - tests
  - src file list
- generate repo_snapshot.json
- POST snapshot to ASA endpoint
- output snapshot_id and report URL

Out of Scope:
- no repo mutation
- no fixes
- no recommendations
- no local secrets dump
- no direct Neo4j writes

Non-Negotiables:
- do not upload secret values
- redact .env if accidentally found
- preserve not-captured fields
- action must be manually triggerable

Definition of Done:
- action file added
- sample output documented
- snapshot POST works against ASA staging
```
