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
