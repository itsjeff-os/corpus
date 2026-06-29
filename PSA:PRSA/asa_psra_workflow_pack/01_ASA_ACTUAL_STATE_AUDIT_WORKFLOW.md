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
