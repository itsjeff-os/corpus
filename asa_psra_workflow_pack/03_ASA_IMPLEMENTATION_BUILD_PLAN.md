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
