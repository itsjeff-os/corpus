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
