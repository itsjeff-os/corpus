# RuntimeCore v1 Contract

RuntimeCore starts from graph state and conversation/project context.

```text
hydrate graph/context
update current reasoning frame
derive current state from graph
derive candidate moves
evaluate candidate moves through gate slots
select strategy or repair
respond through a response contract
write later evidence as normal graph material
```

This scaffold implements the first usable surface of that contract. It derives a lightweight routing decision from graph status, scope, and active conclusions. It does not call a model yet.

## Gate Scaffold

RuntimeCore now has a gate scaffold, not a completed policy layer.

The scaffold defines slots where policy can be attached:

```text
state_claim
maturity_claim
handoff
authority
action
evidence
domain_policy
user_policy
project_policy
```

Each gate receives:

```text
candidate
scope
evidence
metadata
```

Each gate returns:

```text
allow
block
review
```

The scaffold is deliberately domain/user/project portable. It does not decide
the policy content that belongs inside the slots.

RuntimeCore v1 is the promoted continuation of the former `project-codex`
service. The Python intent-runtime prototype is archived as
`/srv/ai-stack/archive/runtime-v0-intent-prototype` and is retained only as
historical reference for the first structured intent compiler.

## Context Bundle Shape

```json
{
  "cognitive_state": {},
  "assistant_state": {},
  "reasoning_runtime": {
    "active_graph_id": "",
    "current_observations": [],
    "current_interpretations": [],
    "current_inferences": [],
    "active_conclusions": [],
    "challenged_nodes": []
  },
  "zep_context": {},
  "chroma_retrieval": {},
  "strategies": [],
  "constraints": [],
  "governance": {}
}
```

## Current Storage Boundary

Storage is in-memory only in this scaffold. Zep is used as conversational and
project recall assist. Docs remain canonical project truth; machine inspection
remains runtime truth.
