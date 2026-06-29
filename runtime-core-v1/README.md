# RuntimeCore v1

RuntimeCore v1 is the canonical mini-PC runtime core.

It receives conversational/project state, derives a routing/context decision,
keeps continuity through Zep, and exposes a small HTTP surface for engineering
runtime work.

## Lineage

RuntimeCore v1 is the promoted continuation of the former
`/srv/ai-stack/project-codex` app.

That scaffold was promoted because it already contained the stronger Runtime
base:

- TypeScript/Hono service shell
- Docker deployment shape
- health and context endpoints
- Reasoning Graph Core v1.1
- graph validation tests
- runtime route derivation
- context bundle shell
- Zep Cloud continuity
- 1Password Environment loading
- proposal and approval request endpoints

The earlier Python Agents SDK prototype formerly at `/srv/ai-stack/runtime` is
superseded and archived at:

```text
/srv/ai-stack/archive/runtime-v0-intent-prototype
```

It remains useful historical reference for the first structured intent compiler,
but it is not an active RuntimeCore module.

## Current App Root

```text
/srv/ai-stack/runtime-core-v1
```

## Current Boundary

RuntimeCore v1 currently implements:

- Reasoning Graph Core v1.1 types
- graph validation rules
- status propagation helpers
- context bundle shell
- runtime route derivation from graph state
- gate scaffold for state, maturity, handoff, authority, action, evidence, user, project, and domain policy checks
- in-memory event store
- Supabase ACS connectivity/status surface
- Supabase `context` Edge Function hydration lane
- Supabase `approval-gate` Edge Function boundary lane
- Supabase `runtime-event-v2` Edge Function turn/event persistence lane
- proposal and approval request capture
- optional Zep-backed continuity endpoints
- 1Password Environment loading for runtime secrets

It does not yet implement:

- Chroma retrieval
- OpenAI Agents SDK execution inside RuntimeCore
- ChatGPT-facing MCP surface
- autonomous action execution

## Supabase ACS Boundary

RuntimeCore uses the trusted server path through Supabase Edge Functions:

- `context` hydrates ACS context.
- `runtime-event-v2` writes message/content rows and linked timeline events.
- `approval-gate` records approval boundaries.

The RuntimeCore credential authenticates the pipe. `x-runtime-core-user-id` is
only the ACS compatibility/partition UUID; it is not actor, owner, thread,
human user, or authority. `chat_id` remains the interaction scope, and actual
actor/source details are carried in metadata or payload.

RuntimeCore does not write directly to ACS tables.

## Public Routes

- `GET /health`

Protected if `RUNTIME_CORE_TOKEN`, `CODEX_RUNTIME_TOKEN`, or
`COGNITIVE_RUNTIME_TOKEN` is set:

- `GET /context`
- `POST /log-turn`
- `POST /snapshot-session`
- `POST /propose-update`
- `POST /approval-request`
- `POST /reasoning/validate`
- `GET /reasoning/schema`
- `POST /runtime/derive`
- `POST /runtime/new-graph`
- `POST /runtime/gates/evaluate`
- `POST /memory/context`
- `POST /memory/message`
- `POST /memory/turn`
- `POST /memory/seed`

## Memory Boundary

Zep is continuity support, not canonical truth:

```text
Docs = canonical project truth
Machine inspection = runtime truth
Zep = conversational/project recall assist
RuntimeCore = routing/context/governance substrate
```

RuntimeCore prefers the new environment names:

- `RUNTIME_CORE_SUPABASE_URL`
- `RUNTIME_CORE_SUPABASE_SERVICE_ROLE_KEY`
- `RUNTIME_CORE_SUPABASE_FUNCTION_JWT`
- `RUNTIME_CORE_SUPABASE_SCHEMA`
- `RUNTIME_CORE_ZEP_API_KEY`
- `RUNTIME_CORE_USER_ID`
- `RUNTIME_CORE_THREAD_ID`
- `RUNTIME_CORE_TOKEN`

It still accepts the older `CODEX_*` aliases for continuity while the 1Password
Environment is normalized.

## 1Password Runtime Secrets

RuntimeCore can load runtime variables directly from a 1Password Environment
using the 1Password JavaScript SDK.

Default Environment ID:

```text
vsl3suvn4s2dnekt6hr5fpykl4
```

The mini-PC needs one bootstrap credential:

```text
OP_SERVICE_ACCOUNT_TOKEN
```

Health reports 1Password status without printing secret values.

## Local Commands

```bash
npm install
npm run check
npm run dev
```

`npm run check` runs build, unit tests, and evals. The current evals verify the
gate scaffold itself: slots, decisions, blocking, review, receipts, and scoped
context. They do not encode project/user/domain policy content yet.

## Docker

```bash
cp .env.example .env
docker compose up -d --build
curl http://127.0.0.1:5061/health
```
