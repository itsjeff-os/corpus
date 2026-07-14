# fictional-dollop

Reference scaffold for a **metacognitive assistant architecture** with strict separation of concerns:

- **Supabase/Postgres**: assistant state + governance substrate
- **Zep**: longitudinal conversational memory
- **Chroma**: semantic pattern/example retrieval
- **OpenAI Responses/Agents**: reasoning and orchestration
- **Custom GPT Actions**: constrained bridge surface
- **n8n**: async housekeeping workflows

## Core Principle

Reasoning integrity is a permanent substrate, not an audit extra.
Every durable decision is traceable through:

`observation → interpretation → inference → conclusion → feedback`

## Included Artifacts

- `supabase/schema.sql` — substrate schema, reasoning graph model, strategy model, governance/audit, and O/I/N/C/F integrity frames.
- `openapi/context-orchestrator.yaml` — constrained GPT Action/API surface:
  - `GET /context`
  - `POST /log-turn`
  - `POST /snapshot-session`
  - `POST /propose-update`
  - `POST /approval-request`

## Suggested Build Sequence

1. Deploy `supabase/schema.sql`.
2. Implement API using `openapi/context-orchestrator.yaml` as the contract.
3. Integrate Zep and Chroma behind `/context` hydration.
4. Run async rollups/compaction/sync jobs via n8n.
