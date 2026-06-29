# Project Plan — “Agents” to Execution (Tier 3)

## Goal
Make the “AGENTS — purpose-built AI workers” concept operational inside ChatGPT, with the ability to:
- design and generate HA changes
- keep you in the loop (HITL)
- execute approved changes via external tooling (n8n → HA/Notion/Email)

## Phase 0 — Foundations (inventory + truth sources)
Deliverables:
- Canonical inventory: `inventory/home_registry.json`
- Entity audit + mapping doc: `inventory/ENTITY_MAP.md` (to be created after live HA audit)
- Naming standards + conventions (room codes, logical entities)

Exit criteria:
- We can reliably answer: “what entity controls X?” without guessing.

## Phase 1 — Build the Agent modules
Deliverables:
- 5 modules (Automation, Lighting, DevOps, Life, Curator)
- Router + mode system
- Approval Packet protocol

Exit criteria:
- Any request produces a structured spec + an approval-ready change packet.

## Phase 2 — Tier‑3 Execution Layer (n8n gateway)
Deliverables:
- HTTPS gateway endpoints + auth
- Read-only endpoints for HA audit
- Consequential batch endpoint for deploy + doc + email

Exit criteria:
- From chat: we can read HA state and (after approval) execute an HA service call.

## Phase 3 — Automation Deployment Pipeline
Deliverables:
- HA writer script + shell command (already included in ha_cleaned_yaml)
- “Automation Writer” flow in n8n: write YAML → automation.reload → verify

Exit criteria:
- From chat: generate a YAML package → approve → deploy to HA without manual steps.

## Phase 4 — Documentation + Observability
Deliverables:
- Notion change log page template
- Email receipts for deployments
- Optional: Git/Supabase logging

Exit criteria:
- Every deployment produces a durable record with rollback notes.

## Phase 5 — Hardening and evolution
Deliverables:
- Regression checks (avoid automation fights)
- Rate limiting, allowlists, key rotation runbook
- Refactor backlog (blueprints, packages)

Exit criteria:
- Safe, repeatable releases; minimal drift.
