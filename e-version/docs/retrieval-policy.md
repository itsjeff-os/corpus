# Retrieval Policy

## Core Principle

Every query executes a **retrieval plan** — not a direct vector search.

The retrieval planner decides:
- What do I need to know before answering?
- Where should I look?
- Which sources are authoritative?
- How fresh does the context need to be?
- What would make this answer unsafe or unreliable?

---

## Retrieval Modes

| Mode | Use Case |
|------|----------|
| `semantic` | General question answering, summarization |
| `lexical` | Exact matches, config values, device names, file paths |
| `fact_lookup` | Structured fact retrieval from the fact store |
| `graph_traversal` | Entity-linked context expansion |
| `temporal` | Time-sensitive queries, recent events |
| `procedural` | How-to questions, setup procedures |
| `preference` | User preference retrieval |
| `recent_session` | Cross-session context continuity |

---

## Retrieval Plan Schema

```json
{
  "intent": "network_troubleshooting",
  "entities": ["apple_tv_lounge", "nas_main", "vlan_20", "mdns"],
  "needed_context": [
    "device_facts",
    "network_topology",
    "vlan_rules",
    "firewall_rules",
    "known_issues",
    "recent_session_state"
  ],
  "retrieval_modes": [
    "fact_lookup",
    "graph_traversal",
    "semantic",
    "lexical"
  ],
  "freshness_requirement": "high",
  "risk_level": "operational"
}
```

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

**Note:** For technical config queries (`risk_level: operational`), exact match and trust weights should be increased. The planner adjusts weights by intent class.

---

## Permission Filtering

Source permissions flow all the way through retrieval. The retrieval engine must:

1. Resolve the user's permission set from the tenant context
2. Filter all chunks against their `permissions` list
3. Filter all facts against source permissions
4. Never surface content the active context is not permitted to see

This is enforced by the **Policy Engine** before any content reaches the LLM.

---

## Context Budget

The model receives context in layers. When token budget is constrained:

1. Task/instruction context (always included)
2. Relevant durable preferences
3. Current session state
4. High-trust structured facts (pinned → canonical → machine_verified)
5. Supporting retrieved chunks (by final_score)
6. Conflicts / stale warnings (always included if present)
7. Raw excerpts — only if budget remains

Never waste context on large raw documents when structured facts are available.

---

## Conflict Handling

Conflicts are **first-class objects** — not errors.

When the retrieval engine detects conflicting claims:
1. Surface both claims with their sources and trust levels
2. Apply the default resolution strategy (prefer machine_verified + newer)
3. Flag conflicts that require user review
4. Always show the conflict in the answer, do not silently pick one

Example surfaced conflict:
```
⚠ Conflict on vlan_20.subnet:
  - 192.168.20.0/24 (source: vlans.md, trust: canonical)
  - 10.20.0.0/24 (source: router_export.json, trust: machine_verified)
  Resolution: prefer router_export.json (machine_verified, newer)
  Requires user review: true
```

---

## Staleness

Freshness classification:
- `current` — updated within 7 days
- `recent` — updated within 30 days  
- `aging` — updated within 90 days
- `stale` — updated within 365 days
- `expired` — not updated in over a year

For `risk_level: operational` queries, stale and expired facts should be surfaced with explicit warnings and not used as primary answers.
