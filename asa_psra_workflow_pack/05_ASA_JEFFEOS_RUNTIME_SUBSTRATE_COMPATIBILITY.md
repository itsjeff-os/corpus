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
