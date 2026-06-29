# Build brief

## Goal

Build the initial repository foundation for `reasoning-agent`: a Cloudflare-first reasoning-accountable assistant runtime with Supabase as the durable epistemic/metacognitive substrate, Zep as conversational memory, Chroma as semantic pattern retrieval, and governed action surfaces through Home Assistant, Node-RED, n8n, Zapier, IFTTT, and GitHub automation.

## Why it matters

The goal is not generic assistant memory. The system must preserve inference accountability: observations, interpretations, inferences, conclusions, and feedback remain structurally distinct so the assistant can adapt without turning guesses into facts.

## Desired user experience

The assistant should feel capable, context-aware, and low-friction without constantly narrating its epistemics. It should infer boldly but behave responsibly: make useful moves, avoid over-explaining, preserve correction paths, and avoid acting without permission.

## Target capability gain

Create the foundation for an assistant that can:

- hydrate context from multiple substrates
- maintain permanent reasoning substrate with adaptive expansion
- select reasoning depth and response strategy
- track inference status, confidence, supporting signals, and feedback
- queue deeper reflection and substrate sync asynchronously
- expose small GPT action-compatible APIs
- trigger real-world automations only through governed action gates

## Non-negotiables

- Reasoning graph is always present; graph expansion is adaptive.
- Observation, interpretation, inference, conclusion, and feedback stay separable.
- Supabase is the metacognitive and epistemic source of truth.
- Zep is conversational memory.
- Chroma is semantic protocol/example retrieval.
- Cloudflare is runtime/control plane.
- Do not collapse memory, epistemics, metacognition, reasoning, governance, retrieval, and action surfaces into one generic layer.
- Do not assume consent from silence.
- Do not implement autonomy before approval gates and permission state exist.

## Acceptable tradeoffs

- Scaffold interfaces before full behavior.
- Use placeholder clients for external systems.
- Keep first implementation skeletal but semantically faithful.
- Prefer explicit contracts over premature deep functionality.
- Defer reflection, ingestion, rollups, and sync to queues.

## What must not be minimized

- Do not reduce the system to a RAG app.
- Do not reduce epistemics to logs.
- Do not reduce reasoning graphs to optional audits.
- Do not make visible epistemic narration the product.
- Do not flatten Cloudflare/Supabase/Zep/Chroma into interchangeable storage.
- Do not build the smallest conventional backend if that loses the reasoning-governance architecture.
