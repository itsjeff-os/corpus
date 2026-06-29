# Memory Policy

## Principle

Memory can **route** retrieval.  
Memory must **not replace** retrieval.

The LLM should never silently remember everything it infers. Instead:

1. Candidate memory detected
2. Policy check (this document)
3. Source grounding check
4. Risk check
5. User confirmation if required
6. Memory created

---

## Memory Types and Rules

### Profile Memory
- **Durability:** Permanent until user deletes
- **Creation:** Explicit statement or strong confirmation from user
- **Grounding:** Required
- **Confirmation:** Always required
- **Example:** "My name is Jeffe." "I am the sole administrator of this network."

### Preference Memory
- **Durability:** Durable across sessions
- **Creation:** Stated preference or observed strong pattern
- **Grounding:** Soft (preference statements may not cite a source)
- **Confirmation:** Required when confidence < 0.95
- **Example:** "I prefer metric units." "Always show me the source file path."

### Environment Memory
- **Durability:** Durable but updatable when source changes
- **Creation:** Grounded in an ingested source
- **Grounding:** Required — must cite a source document
- **Confirmation:** Always required
- **Example:** "Home network uses VLAN segmentation. Source: infra/topology.md"
- **Restriction:** May route retrieval but must NOT be used as the authoritative answer for exact config values. Retrieval from the source is always preferred.

### Project Memory
- **Durability:** Durable per project lifecycle
- **Creation:** From project documents or explicit statement
- **Grounding:** Soft
- **Confirmation:** Optional (auto-promote at confidence ≥ 0.90)
- **Example:** "Project Aurora goal: migrate all services to K8s by Q3."

### Procedural Memory
- **Durability:** Versioned — old versions retained
- **Creation:** Derived from source documentation
- **Grounding:** Required — must cite source procedure document
- **Confirmation:** Always required
- **Example:** "To reset the router: 1) hold button 10s 2) ... Source: router-manual.pdf"

### Relationship Memory
- **Durability:** Durable
- **Creation:** From explicit statements or strong evidence
- **Grounding:** Soft
- **Confirmation:** Optional
- **Example:** "NAS Main is managed by Jeffe."

### Session Memory
- **Durability:** Session-scoped only (cleared on session end)
- **Creation:** Automatic — written by the Chat Orchestrator
- **Grounding:** None required
- **Confirmation:** Never (ephemeral)
- **Promotion:** Never auto-promoted — only with explicit policy approval

### Working Memory
- **Durability:** Turn-scoped (single reasoning cycle)
- **Creation:** Automatic during retrieval/reasoning
- **Grounding:** None required
- **Promotion:** Never

---

## Confidence Thresholds for Promotion

| Memory Type | Min Confidence | Auto-Promote Max |
|-------------|---------------|-----------------|
| profile | 0.85 | 0.00 (always confirm) |
| preference | 0.80 | 0.95 |
| environment | 0.90 | 0.00 (always confirm) |
| project | 0.80 | 0.90 |
| procedural | 0.90 | 0.00 (always confirm) |
| relationship | 0.75 | 0.00 (always confirm) |
| session | 1.00 | never |

---

## What Must Never Be Stored

- Raw credential values (passwords, tokens, API keys)
- Sensitive personal information not relevant to the user's context
- Facts inferred without any source grounding for `environment` and `procedural` types
- Any memory derived from conflicted, stale, or deprecated facts without explicit user review
