---

# FILE: 00_INDEX.md

# ASA / PSRA Workflow Pack

This folder captures the artefacts and snippets created after the previous temp-chat salvage pack, focused on:

- **ASA — Actual State Audit / Objective System Snapshot**
- **PSRA — Passive Structural Runtime Audit**
- Deployed-first implementation planning
- Codex build packets
- Cloudflare workflow/control-plane positioning
- JeffeOS runtime substrate compatibility notes
- Execution Broker snippets relevant to building these safely

## File map

1. `01_ASA_ACTUAL_STATE_AUDIT_WORKFLOW.md`  
   The ASA workflow identity, call phrases, output structure, status labels, and reusable prompt.

2. `02_ASA_OUTPUT_TEMPLATES.md`  
   Snapshot card, component card, relationship graph, status labels, and clean report templates.

3. `03_ASA_IMPLEMENTATION_BUILD_PLAN.md`  
   Implementation ladder and Codex tickets for building ASA, including local-first alternative and deployed-first correction.

4. `04_ASA_DEPLOYED_FIRST_CLOUDFLARE_PLAN.md`  
   Deployed-first architecture for Cloudflare Worker, GitHub Action evidence collection, smoke tests, R2/Supabase storage, and report routes.

5. `05_ASA_JEFFEOS_RUNTIME_SUBSTRATE_COMPATIBILITY.md`  
   Notes on how ASA should respect the existing JeffeOS assistant runtime substrate without prematurely becoming a parallel control plane.

6. `06_PSRA_SIBLING_WORKFLOW.md`  
   PSRA v1.1 workflow prompt and the sibling relationship between PSRA and ASA.

7. `07_PSRA_DYNAMIC_CLOUDFLARE_WORKFLOW.md`  
   Dynamic workflow architecture, manifest structure, validators, API shape, and capability ladder.

8. `08_CODEX_BUILD_PACKETS.md`  
   Ready-to-use Codex execution packets for ASA/PSRA build slices.

9. `09_EXECUTION_BROKER_AND_MODE_HEADERS.md`  
   Execution Broker, Execution Mode Header, and decision-closure controls for safe Codex usage.

10. `10_RELATIONSHIP_MAP.md`  
    How ASA, PSRA, Capability Graph Notes, Execution Broker, Codex, Cloudflare, and JeffeOS fit together.

## Core distinction

```text
ASA:
What exists right now across a system?

PSRA:
What does this specific artefact/codebase do as written?

Capability Graph Note:
How should a discovered component be represented as graph-addressable capability state?

Execution Broker:
How do we convert a decision into a Codex-safe implementation ticket?
```

## Master line

```text
Before fixing the system, produce an artefact the system can be held to.
```


---

# FILE: 01_ASA_ACTUAL_STATE_AUDIT_WORKFLOW.md

# ASA v0.1 — Actual State Audit

Alternative name: **Objective System Snapshot**

## Purpose

Produce an objective, evidence-bound snapshot of actual system/repo/infrastructure state.

Primary question:

```text
What exists right now?
```

Secondary questions:

```text
What is connected?
What is deployed?
What is configured?
What appears expected but absent?
What conflicts with what?
What is unknown because evidence is missing?
```

Hard boundary:

```text
Do not fix, optimize, recommend, or redesign.
```

---

## Workflow identity

```text
Workflow ID:
ASA_v0_1

Name:
Actual State Audit

Purpose:
Create a clear, objective, visually readable snapshot of actual system/repo/infrastructure state.

Primary question:
What exists right now?

Hard boundary:
Do not fix, optimize, recommend, or redesign.
```

ASA is a **state discovery workflow**, not a planning workflow.

---

## Status labels

Use these explicitly.

```text
Captured
The artefact directly shows this.

Derived
A label based on captured facts.

Inferred
Plausible, but not directly proven.

Expected but absent
The system appears to expect it, but it was not found.

Not captured
No evidence supplied.

Conflicting
Two captured things materially disagree.

Stale/unknown
Evidence exists but freshness or currentness is unclear.
```

---

## Call phrases

For a repo:

```text
Run ASA v0.1 on this repo.

Objective system snapshot only.
Evidence-bound.
Show actual state, wiring, deployments, configs, entrypoints, dependencies, missing expected pieces, stale/unknown areas, and material conflicts.
No fixes, no recommendations, no redesign.
```

Short form:

```text
ASA this. Actual state only. Evidence-bound. No fixes.
```

For the whole Personal OS stack:

```text
Run ASA v0.1 across my Personal OS stack.

Scope:
- AI tooling
- Cloudflare Workers
- repos
- Docker/mini PC services
- Home Assistant
- Supabase
- Neo4j
- Chroma/Zep
- n8n/Node-RED/Zapier/IFTTT
- Notion/GitHub/Codex/Claude/OpenAI surfaces

Output a clean actual-state map with captured facts, derived labels, unknowns, conflicts, and not-captured areas.
No fixes or recommendations.
```

---

## Output structure

```text
# Actual State Audit — [target]

## 0. Snapshot Card

Target:
Audit date:
Evidence supplied:
Evidence not supplied:
Confidence:
Primary state:
Main unknown:
Material conflicts:
Next artefact needed:

## 1. System Map

[visual text map / Mermaid graph if useful]

## 2. Component Inventory

| Component | Type | Runtime | Status | Evidence | Confidence |
|---|---|---|---|---|---|

## 3. Repo / Service Cards

For each repo/service:

### [name]

Identity:
Runtime:
Entrypoint:
Deployment:
Routes:
Bindings:
Env/config:
Data stores:
Queues/events:
Tests/build:
Docs:
Known outputs:
Unknowns:
Material conflicts:

## 4. Relationship Graph

Nodes:
Relationships:
Derived role labels:
Not captured:

## 5. Wiring / Integration State

What is connected to what.

## 6. Deployment / Runtime State

What appears deployed, runnable, local-only, stale, or unknown.

## 7. Config / Secret / Env Expectations

What config exists.
What env vars are referenced.
What appears required.
What is not captured.

## 8. Data / Memory / Persistence State

Supabase:
Neo4j:
Chroma:
Zep:
R2:
Local files:
Other stores:

## 9. Automation / Orchestration State

n8n:
Node-RED:
Zapier:
IFTTT:
Home Assistant:
GitHub Actions:

## 10. Material Conflicts

Only conflicts that matter downstream.

## 11. Obviously Missing / Not Captured

Phrase as:
“This system appears to expect X, but X is not present in supplied evidence.”

## 12. Clean State Summary

What exists:
What is wired:
What is deployed:
What is uncertain:
What is most state-significant:
```

---

## Full reusable ASA prompt

```text
You are performing ASA v0.1 — Actual State Audit.

Purpose:
Produce an objective, evidence-bound snapshot of actual system/repo/infrastructure state.

Primary question:
What exists right now?

Your job:
- identify components
- describe captured facts
- distinguish captured facts, derived labels, inferences, unknowns, and not-captured areas
- map relationships between components
- show what is wired, deployed, configured, exposed, persisted, or expected
- surface material conflicts or stale/unknown areas
- produce a clear, visually readable state snapshot

Your job is NOT:
- fix anything
- recommend changes
- redesign
- refactor
- propose architecture
- infer missing behaviour as fact
- treat names/docs as proof of implementation
- treat config as proof of runtime handler behaviour
- treat capability as authority
- treat deployment config as proof of successful deploy

Status labels:
Use these labels explicitly:
- Captured
- Derived
- Inferred
- Expected but absent
- Not captured
- Conflicting
- Stale/unknown

Evidence rule:
Every material claim must point to evidence such as file path, config key, route, table, command output, log, screenshot, or supplied note.
If evidence is missing, mark it as Not captured.

Materiality rule:
Only surface conflicts that affect runtime, import/build, deployment, data shape, integration, authority, persistence, routing, or downstream implementation.
Do not nitpick harmless naming variation.

Output order:

1. Snapshot Card
- Target
- Evidence supplied
- Evidence not supplied
- Confidence
- Primary captured state
- Main unknowns
- Material conflicts
- Most important next evidence artefact

2. Component Inventory
A table of components with type, status, evidence, confidence.

3. Component Cards
For each component:
- State label
- Type
- Evidence
- What exists
- What it appears to be
- What it is wired to
- What it depends on
- What it exposes
- What it writes/reads
- Runtime/deploy state
- Material conflicts
- Not captured
- Confidence

4. Relationship Graph
List nodes and relationships.
Use simple graph notation where useful:
(component)-[:RELATION]->(other_component)

5. Runtime / Deployment State
Show what appears deployed, local-only, configured-but-unproven, stale, or unknown.

6. Config / Env / Secret Expectations
List required or referenced env vars, bindings, secrets, config files, and missing evidence.

7. Data / Persistence State
List databases, tables, queues, buckets, vector stores, graph stores, memory systems, and what is known about them.

8. Automation / Orchestration State
List n8n, Node-RED, GitHub Actions, Home Assistant, Zapier, IFTTT, queues, cron jobs, webhooks, or event paths if present.

9. Material Conflicts
Only downstream-significant contradictions.

10. Expected but Absent / Not Captured
Phrase as:
“This appears to expect X, but X is not present in supplied evidence.”

11. Clean State Summary
- What exists
- What is wired
- What is deployed/configured
- What is unknown
- What is most state-significant

Hard exclusions:
No fixes.
No recommendations.
No refactors.
No architecture proposals.
No “you should.”
No next steps unless explicitly asked.
```


---

# FILE: 02_ASA_OUTPUT_TEMPLATES.md

# ASA Output Templates

## 1. Snapshot Card

```text
# Actual State Audit — [target]

Target:
[repo/system/service]

Snapshot date:
[date/time]

Evidence supplied:
- [artefact]
- [config]
- [screenshot]
- [command output]

Evidence not supplied:
- [logs]
- [source file]
- [deployment proof]
- [runtime trace]

Confidence:
Low | Medium | High

Primary captured state:
[short state summary]

Main unknown:
[largest not-captured or unknown area]

Material conflicts:
- [conflict, if any]

Most important next evidence artefact:
[the single artefact that would most improve state clarity]
```

---

## 2. Component Inventory Table

```text
| Component | Type | Runtime | Status label | Evidence | Confidence |
|---|---|---|---|---|---|
| intake | Cloudflare Worker | Workers | Captured / Derived | wrangler.toml | High |
```

---

## 3. Component Card

```text
## Component: [name]

State:
Captured | Derived | Inferred | Expected but absent | Not captured | Conflicting | Stale/unknown

Type:
[repo/service/worker/db/schema/automation/flow/runtime/tool]

Evidence:
- [file/path/config/log/source]

What exists:
- [objective facts]

What it appears to be:
- [derived label, if justified]

What it is wired to:
- [routes/queues/dbs/services/tools]

What it depends on:
- [env vars/packages/bindings/secrets/services]

What it exposes:
- [routes/APIs/commands/events/UI]

What it writes/reads:
- [tables/files/queues/buckets/graphs]

Runtime/deploy state:
- [deployed/local/unknown/stale]

Material conflicts:
- [only if downstream-significant]

Not captured:
- [handler behaviour, logs, schema, tests, deploy proof, etc.]

Confidence:
Low | Medium | High
```

---

## 4. Relationship Graph Template

```text
Nodes:
- Service: intake
- Runtime: Cloudflare Worker
- Route: runtime.itsjeff.org
- Queue: intake-runtime
- Binding: RT-INTAKE.QUEUE

Relationships:
(intake)-[:RUNS_AS]->(Cloudflare Worker)
(intake)-[:EXPOSED_AT]->(runtime.itsjeff.org)
(intake)-[:PRODUCES_TO_QUEUE]->(intake-runtime)
(RT-INTAKE.QUEUE)-[:BINDS_TO_QUEUE]->(intake-runtime)

Derived role labels:
- intake = runtime ingress surface
- intake = queue-producing intake worker

Not captured:
- handler behaviour
- request/response schema
- queue consumer behaviour
- deploy success/failure
```

---

## 5. Status label reference

```text
Captured:
Directly present in supplied evidence.

Derived:
Reasonable label generated from captured facts.

Inferred:
Plausible but not directly proven.

Expected but absent:
A component/config/route/process appears expected by evidence but is not present.

Not captured:
No evidence supplied.

Conflicting:
Two captured artefacts materially disagree.

Stale/unknown:
Evidence exists but currentness is uncertain.
```

---

## 6. Material Conflict Template

```text
### Conflict: [name]

Evidence A:
[file/path/config/log]

Evidence B:
[file/path/config/log]

Conflict:
[what differs]

Downstream effect:
[why this matters at runtime/import/deployment/integration/persistence]

Materiality:
Medium | High | Critical

Unresolved:
[what evidence would distinguish the actual state]
```

---

## 7. Expected-but-Absent Template

```text
### Expected but absent: [thing]

This appears to expect:
[missing piece]

Appears expected because:
[evidence]

Not present in supplied evidence:
[what was searched/seen]

Downstream effect if absent:
[what becomes unknown/broken/unproven]

Status:
Expected but absent | Not captured
```

---

## 8. Clean State Summary Template

```text
## Clean State Summary

What exists:
- [captured components]

What is wired:
- [routes, queues, bindings, database links, integrations]

What is deployed/configured:
- [deployed/configured-but-unproven/local-only/stale]

What is unknown:
- [handler behaviour, logs, runtime proof, auth, consumers, etc.]

What is most state-significant:
- [the highest-impact fact or uncertainty]
```


---

# FILE: 03_ASA_IMPLEMENTATION_BUILD_PLAN.md

# ASA Implementation Build Plan

This file captures both the original local-first idea and the corrected deployed-first implementation model.

## Corrected principle

The user does not build local-first. They test with deployed apps.

Therefore, ASA should be implemented as:

```text
deployed evidence intake/control surface
→ feed it evidence from GitHub Actions / uploads / service probes
→ inspect deployed outputs
```

Not:

```text
local ASA tool
→ later deploy
```

---

# Build ladder

```text
Phase 1: Deployed ASA Intake Worker
Phase 2: GitHub Action evidence collector
Phase 3: Snapshot renderer and status cards
Phase 4: ASA model audit pass over submitted evidence
Phase 5: Cloudflare Workflow durable audit runs
Phase 6: Capability graph export to Neo4j-compatible JSON
Phase 7: n8n/MCP wrappers
```

---

# Phase 1 — Deployed ASA Intake Worker

## Purpose

Create a deployed Cloudflare Worker that accepts evidence, stores it, and returns actual-state snapshot outputs.

## Routes

```text
GET  /health
POST /v1/asa/artifacts
POST /v1/asa/snapshots
GET  /v1/asa/snapshots/:id
GET  /v1/asa/reports/:id
```

## What it does

```text
accepts uploaded evidence
stores raw artefact
stores structured snapshot metadata
renders a clean snapshot card
returns actual-state output
```

## Storage

```text
R2:
raw artefacts
rendered markdown reports
snapshot exports

Supabase:
snapshot metadata
component rows
relationships
unknowns
material conflicts
report refs
```

---

# Codex ticket — Deployed ASA v0.1 Intake Worker

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

# Phase 2 — GitHub Action evidence collector

Since the workflow is deployed-first, GitHub Actions becomes the collector.

## Behaviour

```text
on workflow_dispatch
→ collect file tree
→ collect package/config files
→ collect wrangler/docker/supabase/github actions/docs/tests
→ build repo_snapshot.json
→ POST to ASA Worker
→ output report URL
```

## Collector evidence

```text
pwd
git remote -v
git status --short
find . -maxdepth 3 -type f | sort
ls -la
cat package.json 2>/dev/null
cat wrangler.toml 2>/dev/null
cat docker-compose.yml 2>/dev/null
cat Dockerfile 2>/dev/null
cat .env.example 2>/dev/null
find .github/workflows -type f -maxdepth 2 2>/dev/null
find supabase -maxdepth 3 -type f 2>/dev/null
find src -maxdepth 3 -type f 2>/dev/null
```

Important:

```text
The collector gathers state.
It does not fix anything.
```

---

# Phase 3 — ASA audit/report runner

Later layer.

```text
snapshot JSON
→ ASA prompt
→ structured report
→ validator checks no advice/fixes
→ markdown report
```

Outputs:

```text
actual_state_report.json
actual_state_report.md
component_inventory.json
relationship_graph.json
unknowns.json
material_conflicts.json
```

Validator gates:

```text
no fixes
no recommendations
no “you should”
no inferred behaviour treated as fact
no whole-system synthesis before inventory
no treating config as runtime proof
```

---

# Original local-first alternative

This is retained as an alternate slice, not the preferred current build path.

```text
asa/
  package.json
  tsconfig.json
  README.md

  src/
    cli.ts
    collect/
      collectRepoState.ts
      collectGitState.ts
      collectFileTree.ts
      collectPackageState.ts
      collectCloudflareState.ts
      collectDockerState.ts
      collectSupabaseState.ts
      collectGithubActionsState.ts
      collectDocsState.ts
      collectEnvState.ts

    schema/
      asaSnapshot.ts
      asaReport.ts

    render/
      renderSnapshotMarkdown.ts

    types/
      statusLabels.ts
      evidence.ts
      component.ts

  tests/
    collector.test.ts
    schema.test.ts
    render.test.ts

  examples/
    sample_snapshot.json
    sample_snapshot.md
```

Commands:

```bash
npm run asa:collect -- /path/to/repo
npm run asa:render -- ./asa_snapshot.json
npm test
```

Status:

```text
useful pattern
not preferred for Jeffe’s current deployed-first working style
```


---

# FILE: 04_ASA_DEPLOYED_FIRST_CLOUDFLARE_PLAN.md

# ASA Deployed-First Cloudflare Plan

## Corrected implementation model

Because the working style is deployed-app testing:

```text
Codex
→ builds Cloudflare ASA Worker
→ deploys to staging
→ runs remote smoke tests
→ reports deployed route + test result
→ user inspects actual output
```

Not:

```text
build local
→ trust local output
→ maybe deploy later
```

The deployed app is the truth source.

---

## ASA as deployed evidence intake

A deployed Worker cannot inspect local machines or repos unless something sends it evidence.

So ASA needs an evidence intake model:

```text
GitHub Action
→ collects repo state
→ POSTs snapshot to Cloudflare ASA

Manual upload
→ zip / JSON / markdown / config dump
→ Cloudflare ASA stores it

Runtime service
→ posts capability heartbeat
→ Cloudflare ASA records actual state
```

Core rule:

```text
ASA deployed service receives evidence.
It does not infer local state.
```

---

## MVP Worker routes

```text
GET  /health
POST /v1/asa/artifacts
POST /v1/asa/snapshots
GET  /v1/asa/snapshots/:id
GET  /v1/asa/reports/:id
```

---

## Evidence object shape

```json
{
  "snapshot_id": "asa_snap_x",
  "source": {
    "type": "github_action | manual_upload | runtime_probe | service_heartbeat",
    "repo": "owner/repo",
    "commit": "sha",
    "branch": "main",
    "collected_at": "timestamp"
  },
  "evidence": {
    "file_tree": [],
    "package_json": {},
    "wrangler_toml": {},
    "docker": {},
    "supabase": {},
    "github_actions": {},
    "docs": {},
    "tests": {},
    "env_examples": {}
  },
  "status_labels": {
    "captured": [],
    "derived": [],
    "inferred": [],
    "not_captured": [],
    "conflicting": [],
    "stale_unknown": []
  }
}
```

---

## Storage layout

```text
R2:
asa/raw/{snapshot_id}/artifact
asa/snapshots/{snapshot_id}/snapshot.json
asa/reports/{snapshot_id}/report.md
asa/reports/{snapshot_id}/report.json

Supabase:
asa_snapshots
asa_components
asa_relationships
asa_unknowns
asa_conflicts
asa_reports
```

---

## Remote smoke tests

Examples:

```bash
curl https://asa-staging.runtime.itsjeff.org/health

curl -X POST https://asa-staging.runtime.itsjeff.org/v1/asa/snapshots \
  -H "x-asa-api-key: $ASA_API_KEY" \
  -H "content-type: application/json" \
  --data @repo_snapshot.json

curl https://asa-staging.runtime.itsjeff.org/v1/asa/reports/<snapshot_id> \
  -H "x-asa-api-key: $ASA_API_KEY"
```

---

## GitHub Action collector

Behaviour:

```text
workflow_dispatch
→ checkout repo
→ collect file/config evidence
→ generate repo_snapshot.json
→ POST to ASA endpoint
→ output snapshot/report URL
```

Collector should gather:

```text
git status
file tree
package.json
scripts
dependencies
wrangler.toml
Dockerfile
docker-compose.yml
.env.example
README/docs
src entrypoints
routes if statically visible
Supabase migrations
GitHub Actions
tests
deployment hints
config bindings
```

Collector should not infer:

```text
handler behaviour from route config
successful deploy from deployment config
runtime behaviour from README
authorization from capability
```

---

## Cloudflare Workflow later

Only after the simple Worker route works.

Durable run:

```text
upload artefact
→ extract/snapshot
→ run audit prompt
→ validate no advice/fixes
→ render report
→ persist
→ return result
```

---

## Deployed-first build principle

```text
Build deployed endpoint.
Prove it with remote smoke tests.
Then iterate.
```

Not:

```text
Build local tooling cathedral.
Then eventually wonder if it works in runtime.
```


---

# FILE: 05_ASA_JEFFEOS_RUNTIME_SUBSTRATE_COMPATIBILITY.md

# ASA and the Existing JeffeOS Assistant Runtime Substrate

## Context

The system already contains:

```text
MCP assistant lane
Supabase tool registry
Neo4j capability graph
Zep / Graphiti / OpenAI memory substrates
event semantics
authority metadata
receipt schemas
runtime/event/control surfaces
```

So ASA should not be designed as if JeffeOS is empty.

---

## Corrected implication

The heads-up means:

```text
Do not design ASA as a disconnected greenfield control plane.
Do not invent a parallel capability registry.
Do not ignore the existing tool registry / graph / MCP lane.
Use the current substrate as context and compatibility target.
```

It does **not** necessarily mean:

```text
Immediately modify gpt-assistant and register ASA as an MCP tool.
```

That would be premature unless the user explicitly chooses that path.

---

## Correct implementation framing

```text
Build ASA deployed-first,
but design it so it can later become a first-class runtime capability
without duplicating JeffeOS control-plane structures.
```

Sequence:

```text
1. Build ASA as deployed Cloudflare Worker / route.
2. Feed it evidence artefacts: repo snapshots, config dumps, capability notes, Supabase/Neo4j exports.
3. Generate objective actual-state reports.
4. Use JeffeOS itself as the first audit target.
5. Only after it works, decide whether to register ASA as a formal tool in tooling.tool_registry / Neo4j / MCP.
```

---

## Compatibility rules

ASA should be compatible with:

```text
Supabase tool_registry
Neo4j capability graph
MCP gpt-assistant lane
runtime-event semantics
approval/authority metadata
receipt schemas
Zep / Graphiti / OpenAI substrates
```

ASA should not create:

```text
parallel tool registry
parallel authority model
parallel runtime event ontology
parallel graph ontology
parallel memory substrate
```

---

## Possible future ASA capability contract

If promoted into JeffeOS runtime later:

```text
tool_name: asa_runtime_snapshot
owning_service: gpt-assistant
transport: mcp_http
endpoint_or_tool_ref: /mcp::asa_runtime_snapshot
enabled: true
version: 1
side_effect_level: none
required_identity_fields: user_id
required_authority_state: allowed
approval_requirement: none
```

Input schema:

```text
user_id: string
scope?: string[]
include_graph?: boolean
include_contracts?: boolean
include_events?: boolean
```

Receipt schema:

```text
snapshot_id: string
generated_at: string
scope: array
components: array
tools: array
substrates: array
relationships: array
unknowns: array
material_conflicts: array
evidence_refs: array
confidence: object
```

Events:

```text
capability_called
asa_snapshot_created
runtime_state_read
capability_graph_read
tool_registry_read
```

Operational role:

```text
Reads declared runtime substrate state and produces an objective actual-state snapshot.
```

---

## First benchmark target

The pasted JeffeOS runtime note itself is already an ASA-style state artefact.

ASA should eventually be able to produce:

```text
JeffeOS Assistant Runtime Substrate — Actual State Snapshot
```

from:

```text
Supabase contracts
Neo4j graph
MCP tool list
runtime/event evidence
memory substrate config
```

with clear distinctions between:

```text
Captured
Declared
Graph-modeled
Observed
Derived
Not captured
```

---

## Codex guardrail

When building ASA in this context:

```text
Use existing JeffeOS substrate concepts as compatibility targets.
Do not create a parallel control plane.
Do not register ASA into the runtime until explicitly instructed.
Do not change existing tool contracts except when explicitly in scope.
```

Clean distinction:

```text
ASA v0.1:
deployed evidence intake + actual-state report

ASA future:
first-class JeffeOS runtime capability, if promoted
```


---

# FILE: 06_PSRA_SIBLING_WORKFLOW.md

# PSRA v1.1 — Passive Structural Runtime Audit

ASA sibling.

## Relationship to ASA

```text
ASA:
What exists right now across a system?

PSRA:
What does this specific artefact/codebase do as written?
```

Use ASA when the mess is broad.

Use PSRA when you have a specific artefact, repo, codebase, transcript, schema, config package, or zip to audit.

---

## Canonical call

```text
Run PSRA v1.1 on the attached artefact.

Mode: passive structural runtime audit.
Scope: all supplied files/snippets unless excluded below.
Focus: what exists, what each part appears to do, what happens as written, and where implementation materially diverges from apparent intent.

Do not fix, rewrite, improve, reconcile, or propose solutions.
Analyze components first. Contextualize the whole only after component analysis.
Surface runtime/import/operational consequences, missing expected pieces, material contradictions, and open uncertainties.
```

Short form:

```text
PSRA v1.1 this, component-first, as-written, no fixes.
```

---

## PSRA v1.1 optimized prompt

```text
# Passive Structural Runtime Audit v1.1

You are performing a Passive Structural Runtime Audit.

Purpose:
Analyze the supplied artefact as evidence. Describe what exists, what each part appears to do, what problem each part appears to solve, how it behaves when run/imported/used, and where it materially diverges from its own apparent intent.

This is not a redesign task.

## Non-negotiable controls

The following are controls, not content. Enforce them silently.

1. Do not rewrite, refactor, improve, rename, or generate code.
2. Do not propose fixes, best practices, recommendations, or next steps.
3. Do not reconcile contradictions.
4. Do not infer missing behaviour as definitely intended.
5. Do not treat docs, comments, names, or stated intent as proof of implementation.
6. Do not synthesize the whole before analyzing individual parts.
7. Do not treat terminology overlap as value.
8. Do not resolve uncertainty. Surface it.
9. Do not convert the audit into advice.
10. Do not use apology, validation, role-performance, or “I can help” framing.

Priority order:
runtime/import/operational behaviour
> implemented structure
> explicit artefact evidence
> apparent intent
> plausible inference
> uncertainty

When these conflict, prefer the higher-priority layer.

## Core distinction

Always distinguish:

- what is present
- what appears intended
- what is implemented
- what would happen at runtime/import/execution
- what is implied but missing
- what is uncertain

Use “appears to” for inferred purpose.
Use “as written” for runtime/import behaviour.
Use “not present in the supplied artefact” for missing expected pieces.

## Materiality rule

Surface contradictions only when they matter downstream.

Material contradictions include differences that affect:

- runtime behaviour
- import/build behaviour
- data shape
- persistence
- authority or permission
- external actions
- control flow
- validation
- task scope
- execution semantics
- downstream implementation

Do not nitpick harmless iterative naming drift unless the same name implies materially different behaviour.

## Audit workflow

Follow this exact order.

### 1. Scope and evidence boundary

State:
- artefact(s) analyzed
- artefact type
- what is in scope
- what is out of scope
- evidence limits

Do not summarize the whole system yet.

### 2. Inventory

List the concrete parts present.

### 3. Component-by-component analysis

Analyze each component separately:

Component: [name/path/section]

What is there:
- Concrete contents only.

What it appears to be trying to do:
- Apparent local purpose.

What problem it appears to solve:
- The local problem addressed.

How it behaves:
- For code: runtime/import/build/execution behaviour.
- For schemas: data model implications.
- For prompts/protocols: control or interaction behaviour.
- For docs: intended behaviour only, not proof of implementation.
- For diagrams: visible structure and implied relationships.

Dependencies and expectations:
- What this part relies on.
- What it appears to expect.

Material issues:
- Meaningful incompleteness, contradiction, ambiguity, or misalignment.
- State downstream effect where applicable.

Uncertainty:
- Give 1 to 2 plausible interpretations without choosing one.

Do not propose fixes.

### 4. Runtime / import / operational consequences

Describe what would happen when the artefact runs, imports, builds, deploys, or is used.

### 5. Whole-system contextualization

Only now describe how the parts appear to fit together.

### 6. Strengths

Identify what is strong, tied to evidence.

### 7. Incomplete, contradictory, or misaligned

Separate into:
A. Incomplete
B. Contradictory
C. Misaligned with wider intent
D. Runtime-significant ambiguity

For each item, describe the downstream effect.
Do not fix or reconcile it.

### 8. Obviously missing

List expected but absent pieces.
Phrase as:
“This code/schema/workflow/documentation appears to expect…”

### 9. Open questions / uncertainties

For each:
- state uncertainty
- give 1 to 2 plausible interpretations
- do not choose one
- do not propose a resolution

### 10. Clean synthesis

End with:
- what the artefact most strongly appears to be
- what it is strongest as
- what it is not yet, as written
- the main load-bearing divergence, if any
- the single most important distinction revealed by the audit

Use:
“Based only on what is present, this is strongest as…”
“As written, it is not yet…”
“The main divergence is…”
“The load-bearing distinction is…”

## Silent self-check before final answer

Reject any candidate answer that:
- proposes a fix
- rewrites code
- gives advice
- resolves uncertainty
- treats intent as implementation
- skips component analysis
- starts with whole-system synthesis
- uses generic praise
- uses apology/validation theatre
- substitutes meta-description for the actual audit
- treats wording as evidence of runtime behaviour
```

---

## PSRA variants

```text
PSRA v1.1 runtime-only:
Focus only on import/build/runtime/execution behaviour.

PSRA v1.1 missing-pieces pass:
List only what the artefact appears to expect but does not include.

PSRA v1.1 divergence pass:
Focus only on material divergence between apparent intent, docs/naming, and implemented behaviour.

PSRA v1.1 component map:
Inventory every part, what it appears to do, what it depends on, and how it fits after individual analysis.
```


---

# FILE: 07_PSRA_DYNAMIC_CLOUDFLARE_WORKFLOW.md

# PSRA Dynamic Cloudflare Workflow

## Core idea

PSRA should be a dynamic workflow definition, not a static mega-prompt.

Good dynamic:

```text
manifest-driven
stateful
versioned
validated
traceable
```

Risky dynamic:

```text
model invents workflow and runs arbitrary process at runtime
```

---

## Architecture

```text
Client / ChatGPT / Claude / Codex / n8n
        |
        v
Cloudflare Worker API
        |
        v
Workflow Registry
        |
        v
Cloudflare Workflow run
        |
        |-- Step 1: bind scope
        |-- Step 2: inventory artefact
        |-- Step 3: analyze components
        |-- Step 4: runtime/import consequences
        |-- Step 5: whole-system contextualization
        |-- Step 6: validator pass
        |-- Step 7: persist audit result
        |
        v
Audit result + trace
```

---

## State split

```text
R2:
- raw artefacts
- extracted file snapshots
- audit result exports

Supabase / D1:
- workflow definitions
- workflow runs
- audit findings
- component records
- material divergences
- open questions
- missing expected pieces

Durable Object:
- live run state
- constraint ledger
- phase cursor
- rejected-frame register
- per-run locks

Cloudflare Workflow:
- durable phase execution
- retries
- wait/resume
- step results
```

---

## Minimal manifest shape

```json
{
  "workflow_id": "PSRA",
  "version": "1.1",
  "name": "Passive Structural Runtime Audit",
  "invariant": "Describe what exists and what happens as written. Do not fix.",
  "phase_order": [
    "scope_and_evidence_boundary",
    "inventory",
    "component_analysis",
    "runtime_import_operational_consequences",
    "whole_system_contextualization",
    "strengths",
    "incomplete_contradictory_misaligned",
    "obviously_missing",
    "open_questions_uncertainties",
    "clean_synthesis"
  ],
  "hard_exclusions": [
    "fixes",
    "refactors",
    "recommendations",
    "new_code",
    "reconciliation",
    "resolved_uncertainty"
  ],
  "priority_order": [
    "runtime_import_operational_behaviour",
    "implemented_structure",
    "explicit_artifact_evidence",
    "apparent_intent",
    "plausible_inference",
    "uncertainty"
  ],
  "validators": [
    "component_first_gate",
    "no_fix_gate",
    "no_recommendation_gate",
    "no_reconciliation_gate",
    "implementation_vs_intent_gate",
    "runtime_priority_gate",
    "uncertainty_preservation_gate",
    "evidence_reference_gate",
    "materiality_gate",
    "semantic_overlap_zero_credit_gate"
  ]
}
```

---

## API call shape

```text
POST /workflows/run
```

Payload:

```json
{
  "workflow_id": "PSRA",
  "version": "1.1",
  "mode": "standard",
  "artifact_ref": "r2://artefacts/acs_full_loop.zip",
  "caller": "chatgpt",
  "output": {
    "format": "markdown",
    "include_trace": true
  }
}
```

Response:

```json
{
  "run_id": "psra_run_2026_06_08_001",
  "status": "queued",
  "workflow_id": "PSRA",
  "version": "1.1"
}
```

Status:

```text
GET /workflows/runs/{run_id}
```

Result:

```json
{
  "run_id": "psra_run_2026_06_08_001",
  "status": "completed",
  "result_ref": "r2://audit-results/psra_run_2026_06_08_001.md",
  "trace": {
    "phases_completed": 10,
    "validators_triggered": ["component_first_gate", "no_advice_gate"]
  }
}
```

---

## Validator examples

```text
Does it propose fixes?
Reject.

Does it synthesize the whole before component analysis?
Reject.

Does it treat docs as implementation?
Reject.

Does it resolve ambiguity instead of preserving it?
Reject.

Does it mention a missing piece as “you should add”?
Reject.

Does it describe runtime consequence?
Accept only if tied to artefact evidence.
```

---

## Capability upgrade ladder

```text
Level 1: Static prompt
Repeatable wording, weak enforcement.

Level 2: Manifest workflow
Versioned phases, profiles, exclusions.

Level 3: Structured outputs
Component/finding/runtime/missing/uncertainty objects.

Level 4: Validators
Reject invalid audit outputs before final report.

Level 5: Evidence graph
Every material claim linked to artefact evidence.

Level 6: Stateful runs
Constraint ledger, phase cursor, blocked modes, retry history.

Level 7: Regression memory
Every failure becomes a test.

Level 8: Model routing
Use different models only where they reduce supervision burden.

Level 9: Promotion boundary
Audit can hand off to redesign/fix workflows only after explicit user action.
```

---

## Load-bearing design rule

Every added capability must improve one of:

```text
evidence capture
component understanding
runtime consequence mapping
materiality judgment
uncertainty preservation
validator enforcement
traceability
```

If it adds:

```text
advice
fixes
authority
redesign pressure
```

it belongs in a different workflow.


---

# FILE: 08_CODEX_BUILD_PACKETS.md

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


---

# FILE: 09_EXECUTION_BROKER_AND_MODE_HEADERS.md

# Execution Broker and Mode Headers

## Core reason

Codex should not receive the conversation.

Codex receives the decision.

The user remains in the loop.

---

## Corrected loop

```text
You
↔ collaborative shaping model
↔ execution broker
↔ Codex
↔ execution broker
↔ You
```

The broker is not a middle person with authority.

It is a clutch between modes:

```text
exploration
→ executable instruction
→ execution
→ validation
→ user acceptance
```

---

## Execution Broker prompt

```text
You are the Execution Broker.

The user remains in the loop and retains authority at all decision points.

Your job is not to replace user judgment.
Your job is to preserve user judgment as work moves from collaborative exploration into Codex execution.

You may compile, clarify, constrain, and audit.
You may not approve, expand, reduce, or finalize without the user.

Before sending anything to Codex, produce an execution packet for user approval.
After Codex returns work, audit it against the approved packet and return the result to the user for acceptance.

Your output must:
1. Identify execution mode.
2. State the accepted decision.
3. Freeze what is closed.
4. Define the implementation task.
5. List exact in-scope work.
6. List explicit out-of-scope work.
7. Define non-negotiables.
8. Define acceptable local discretion.
9. Define escalation triggers.
10. Define acceptance criteria.
11. Provide the Codex handoff.

If the task is already decided, compile it for execution.
If the task is not decided, do not send to Codex.
```

---

## Execution modes

```text
Mode: AMBITION_PRESERVING_BUILD
Faithfulness means preserving capability, automation depth, UX, leverage, and intended distinctiveness.

Mode: BOUNDED_EXACT_IMPLEMENTATION
Faithfulness means implementing the accepted artefact exactly without expansion, renaming, architecture reopening, or embellishment.

Mode: PATCH_DEBUG
Faithfulness means fixing the failing behaviour only, without unrelated refactors.

Mode: RUNTIME_WIRING
Faithfulness means connecting already-decided components, not redesigning responsibilities.

Mode: DOC_SYNC
Faithfulness means updating documentation to match implemented behaviour, not inventing future behaviour.

Mode: PASSIVE_AUDIT
Faithfulness means describe only; no fixes, no advice, no reconciliation.
```

---

## Execution Mode Header template

```text
Execution Mode:
[BOUNDED_EXACT_IMPLEMENTATION | AMBITION_PRESERVING_BUILD | PATCH_DEBUG | RUNTIME_WIRING | DOC_SYNC | PASSIVE_AUDIT]

Decision Status:
[open | partially resolved | closed]

Faithfulness Means:
[define what faithful execution means in this mode]

Forbidden:
- [scope expansion]
- [architecture reopening]
- [renaming]
- [unrelated refactors]
- [recommendations]
- [fixes, if audit mode]

Escalate Only If:
- implementation is blocked
- accepted design cannot compile/run
- required dependency is missing
- safety/security/data-loss risk appears
- multiple interpretations would materially change outcome

Definition of Done:
- [test/build passes]
- [specific file/path exists]
- [API contract satisfied]
- [docs updated if relevant]
```

---

## Decision Closure Header

```text
Decision Status:
Closed.

Accepted Decision:
[decision]

Execution Request:
Proceed.

Forbidden:
- reopen architecture
- rename concepts
- add new abstractions
- revisit alternatives
- introduce unrelated concerns

Escalate Only For:
- compile/runtime blocker
- impossible requirement
- safety/security/data-loss issue
- missing dependency required for implementation
```

---

## Failure detector: Decision Regression

```text
accepted decision
+ execute request
+ reopened alternatives
=
decision regression
```

Correction:

```text
Do not re-litigate.
Execute the accepted decision.
Only surface blockers if implementation fails or a new material constraint appears.
```

---

## Codex contractor rule

```text
Exploration is conversational.
Execution is contractual.
Validation is evidential.
```

Codex belongs in the contractual part.


---

# FILE: 10_RELATIONSHIP_MAP.md

# Relationship Map

## The workflows

```text
ASA:
Actual State Audit
Question: What exists right now across a system?

PSRA:
Passive Structural Runtime Audit
Question: What does this specific artefact/codebase do as written?

Capability Graph Note:
Question: How should a discovered component be represented as graph-addressable capability state?

Execution Broker:
Question: How do we convert a user-approved decision into Codex-safe implementation work?
```

---

## When to use what

```text
Messy overall system:
Run ASA.

Specific repo/zip/codebase/config:
Run PSRA.

Discovered service/runtime/integration:
Create Capability Graph Note.

Ready to build:
Use Execution Broker.

Codex execution:
Use Execution Mode Header and bounded ticket.

After Codex execution:
Run PSRA/ASA again depending on scope.
```

---

## Suggested operating loop

```text
1. ASA entire messy system
   → discover components and unknowns

2. PSRA important artefacts/repos
   → determine as-written behaviour

3. Capability Graph Notes
   → convert discovered state into graph-addressable objects

4. Human decision
   → choose what matters

5. Execution Broker
   → compile Codex packet

6. Codex
   → execute bounded ticket

7. PSRA / ASA
   → audit result against expected state

8. Human
   → accept / reject / reopen / promote
```

---

## State and substrate split

```text
Cloudflare Worker:
deployed intake/control surface

Cloudflare Workflow:
durable multi-step audit runs

Durable Object:
per-run live state / phase cursor / validation state

R2:
raw artefacts, snapshots, rendered reports

Supabase:
structured runs, contracts, snapshots, findings, events

Neo4j:
capability graph and relationship topology

Chroma:
semantic retrieval over prior reports/artefacts

Zep:
conversation/session memory

n8n / Node-RED:
orchestration, triggers, archiving, notifications

Codex:
bounded implementation

ChatGPT / Claude:
collaborative shaping, interpretation, audit/report generation
```

---

## High-level control principle

```text
The model can supply candidates.
The system must own state.
```

---

## Carry-forward line

```text
Build systems where user decisions become operational state, not conversational suggestions.
```

---

## Another useful line

```text
Before fixing the system, produce an artefact the system can be held to.
```

---

## Final relationship summary

```text
ASA externalizes actual state.
PSRA explains artefact behaviour.
Capability Graph Notes make state graph-addressable.
Execution Broker makes decisions executable.
Codex executes bounded tickets.
Cloudflare hosts repeatable workflow surfaces.
Supabase/Neo4j/R2 persist the truthy bits.
The user remains the control plane.
```
