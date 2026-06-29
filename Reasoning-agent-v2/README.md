# reasoning-agent

Cloudflare-first scaffold for a reasoning-accountable assistant runtime.

This repository is not primarily a memory app, RAG wrapper, or automation dashboard. It is a stateful epistemic control system for assistant behavior: reasoning frames, inference tracking, metacognitive state, governance, context orchestration, specialist memory substrates, and action surfaces.

## Core invariant

Reasoning graph is always present. Graph expansion is adaptive. Visible epistemics are minimal unless useful.

Every durable assistant belief, inference, strategy update, or memory-relevant change should remain traceable through:

```text
observation -> interpretation -> inference -> conclusion -> feedback
```

## Runtime map

- Cloudflare Worker: public API/runtime/control plane
- Cloudflare Queues: async ingestion, reflection, rollups, sync jobs
- Durable Objects: live session/task coordinators
- Cloudflare D1: edge runtime ledger, route config, queue/job metadata
- Cloudflare AI Gateway: model routing and observability
- Supabase: durable metacognitive and epistemic substrate
- Zep: conversational and temporal memory
- Chroma: semantic retrieval over protocols, examples, schemas, patterns
- Home Assistant / Node-RED / n8n / Zapier / IFTTT / GitHub Actions: action and event surfaces

## First milestone

The assistant can hydrate state, create a thin reasoning frame, select a response strategy, produce a response, log inference/state deltas, and queue heavier reflection when needed.
