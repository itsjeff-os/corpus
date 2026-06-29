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
