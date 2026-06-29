# Runtime map

## Primary runtime

Cloudflare Worker is the primary runtime/control plane.

## Edge components

- Worker routes expose context, logging, proposal, and approval APIs.
- Queues handle deferred work.
- Durable Objects coordinate live sessions/tasks.
- D1 stores edge runtime/job/config metadata.
- AI Gateway routes and observes model calls.

## Durable cognition

Supabase is the durable epistemic and metacognitive substrate.

## Specialist memory/retrieval

- Zep: conversational memory
- Chroma: semantic pattern/protocol/example retrieval
- OpenAI vector store: assistant/file retrieval where useful

## Local/heavy runtime

Python assistant and Docker PCs are useful for heavier ingestion, MCP tools, evaluation, local development, and non-edge workloads.
