# PSRA Drop Index

**Scope:** Thread-local drop index. Not saved memory.
**Active count:** 15/20 indexed
**Next new payload:** 16/20
**Updated:** 2026-06-09T12:03:34.761061+00:00

## Tracking Rules

- Focus on this thread’s drop index only.
- Do not cross-check the zip unless explicitly asked.
- Duplicate detection applies against the drop index only.
- Direct duplicates are not double-indexed.
- Material overlaps are flagged but separately indexed.
- Commentary is allowed only beside the payload and must not reinterpret, edit, classify, evaluate, or mutate the payload.

## Indexed Drops

### Drop 1/20: Passive Structural Runtime Audit v1

**What it is:** Full PSRA audit prompt/protocol for evidence-bound component-first artefact analysis without fixes, refactors, reconciliation, or advice.

**Anchor:** The constraints in this prompt are controls, not content. Do not merely mention them. Enforce them by excluding output that violates them.

**Status:** indexed

**Overlap:**
- None recorded

### Drop 2/20: Cognitive Substrate Loop Audit

**What it is:** Passive audit writeup of a zipped TypeScript/Node assistant cognitive substrate runtime, including package/config, loop, context hydration, adapters, controls, OpenAI generation, Supabase storage, migration, tests, runtime consequences, gaps, and synthesis.

**Anchor:** The architecture says “constraints become controls.” The implementation currently mostly says “constraints become model-visible context plus some substring gates.”

**Status:** indexed

**Overlap:**
- Drop 1/20 at audit method/protocol level

### Drop 3/20: API-first Audit Workflow Architecture

**What it is:** Architecture note for implementing PSRA using an API-first core, MCP/tool interface, n8n orchestration wrapper, optional Custom GPT front-end, and optional multi-pass/multi-agent layers.

**Anchor:** Build the brainstem as API. Expose it through MCP. Let n8n move things around. Use Custom GPT as a comfy cockpit. Add multi-agent only where it beats single-agent plus validation.

**Status:** indexed

**Overlap:**
- Drop 1/20 on PSRA workflow
- Drop 2/20 on cognitive substrate/enforcement architecture

### Drop 4/20: PSRA v1.1 Invocation Contract

**What it is:** Named workflow call pattern for invoking PSRA without pasting the full prompt each time, including canonical call, short call, structured call, router entry, failure detection, and variants.

**Anchor:** PSRA this, component-first, as-written, no fixes.

**Status:** indexed

**Overlap:**
- Drop 1/20 on PSRA protocol
- Drop 3/20 on workflow/API routing

### Drop 5/20: Dynamic PSRA Cloudflare Workflow Definition

**What it is:** Architecture note for making PSRA a manifest-driven, stateful, versioned Cloudflare Workflow with phase order, validators, output contracts, R2 artefact storage, Supabase/D1 records, Durable Object run state, n8n orchestration, and AI Gateway/model-call observability.

**Anchor:** Make PSRA a dynamic workflow definition, not a static mega-prompt.

**Status:** indexed

**Overlap:**
- Drop 3/20 on API/MCP/n8n/Custom GPT architecture
- Drop 4/20 on PSRA invocation/workflow contract
- Drop 1/20 on PSRA protocol phases and exclusions

### Drop 6/20: PSRA v1.1 Optimized Prompt

**What it is:** Shorter, stricter PSRA v1.1 prompt with non-negotiable controls, priority order, materiality rule, fixed audit workflow, and silent self-check rejection conditions.

**Anchor:** I’d optimize it by making it shorter, stricter, and more enforceable.

**Status:** indexed

**Overlap:**
- Drop 1/20 on full PSRA audit protocol
- Drop 4/20 on PSRA v1.1 invocation/workflow contract
- Drop 5/20 on validator-shaped PSRA controls

### Drop 7/20: PSRA Capability Upgrade Ladder

**What it is:** Capability design note for making PSRA more intelligent through phase-specific passes, artefact graph/state, validators, materiality scoring, evidence references, capability profiles, regression memory, audit trace, and human promotion boundaries while preserving the passive audit invariant.

**Anchor:** That is how PSRA grows teeth without growing hands.

**Status:** indexed

**Overlap:**
- Drop 5/20 on manifest-driven Cloudflare workflow execution, validators, R2, Durable Objects, AI Gateway, and stateful PSRA runs
- Drop 6/20 on stricter validator-shaped PSRA controls
- Drop 4/20 on PSRA profiles/variants and named workflow invocation

### Drop 8/20: PSRA Dynamic Workflow Codex Build Schema

**What it is:** Codex-ready build contract for implementing PSRA v1.1 as a Cloudflare-hosted, manifest-driven, stateful workflow runner with API endpoints, Durable Object run state, R2 artefact/result storage, Supabase persistence, structured phase outputs, validators, tests, security boundaries, and definition of done.

**Anchor:** Schema accepted. Debate closed. Build exactly this.

**Status:** indexed

**Overlap:**
- Drop 5/20 on dynamic Cloudflare workflow architecture
- Drop 7/20 on phase-specific PSRA execution, validators, evidence graph, state controller, regression tests, and audit trace
- Drop 6/20 on validator-shaped PSRA controls
- Drop 4/20 on PSRA v1.1 workflow identity/profiles

### Drop 15/20: ASA Local-First Codex Build Path

**Role:** variant

**Canon status:** rejected_initially

**Family:** ASA / Codex / Execution Broker

**What it is:** Local-first ASA implementation path that proposes starting with a read-only TypeScript CLI collector, then adding an audit runner, Cloudflare Worker wrapper, Cloudflare Workflow, and capability graph export. User context: this was initially rejected because the preferred direction was a live service surface from the start rather than a local-first build.

**Anchor:** Schema accepted. Debate closed. Build ticket 1 only.

**Status:** indexed

**Context note:** Initially rejected because it starts local-first, while the preferred direction at that point was to focus on a live service surface from the beginning.

**Overlap:**
- Drop 13/20 on ASA v0.1 as an Actual State Audit sibling workflow
- Drop 14/20 on Codex building ASA execution machinery rather than judging system meaning
- Drop 10/20 on Execution Broker bounded tickets and Codex receiving decisions rather than conversations
- Drop 8/20 on Codex build-schema framing and accepted build contracts
- Drop 12/20 on artefacts as operational state

## Duplicate/Non-indexed Repeats

- Repeated Cognitive Substrate Loop Audit → duplicate of **Drop 2/20**
- Repeated PSRA v1.1 Optimized Prompt → duplicate of **Drop 6/20**
- Repeated Passive Structural Runtime Audit v1 → duplicate of **Drop 1/20**