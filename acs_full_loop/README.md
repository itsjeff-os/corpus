# Assistant Cognitive Substrate — Deployable Full Loop

This is a deployable TypeScript service for the end-to-end assistant runtime loop:

```text
POST /turn
→ persist user message to Supabase
→ hydrate metacognitive context from Supabase
→ hydrate conversational context from Zep adapter
→ hydrate semantic context from Chroma adapter
→ apply Signal Governance Layer
→ apply generator controls
→ call OpenAI Responses API with structured output
→ enforce Output Non-Interference boundary
→ persist assistant message, signal event, events, candidate updates
→ return answer + trace
```

## What it contains

```text
src/
  server.ts                       Express API
  loop.ts                         End-to-end turn loop
  context.ts                      Runtime hydration
  controls/
    signal-governance.ts          Binding Signal Governance Layer
    generator-controls.ts         Prevention-oriented control layer
    output-boundary.ts            Output non-interference validation
  openai/
    client.ts                     OpenAI SDK client
    generate.ts                   Structured Responses call
    reasoning-schema.ts           JSON schema for reasoning payload
  storage/
    supabase.ts                   Supabase reads/writes
  adapters/
    zep.ts                        Optional Zep adapter
    chroma.ts                     Optional Chroma adapter
supabase/migrations/
  001_metacognitive_substrate.sql
```

## Setup

```bash
npm install
cp .env.example .env
```

Fill `.env`:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.5
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Optional:

```bash
ZEP_API_URL=...
ZEP_API_KEY=...
CHROMA_URL=...
CHROMA_COLLECTION=assistant_protocols
```

If Zep or Chroma env vars are absent, those adapters return empty context and the loop still runs.

## Supabase

Run the SQL migration in `supabase/migrations/001_metacognitive_substrate.sql` if the substrate tables are not already present.

The loop expects these tables:

```text
conversation_history
events
assistant_state
signal_events
inference_logs
strategy_library
strategy_uses
soft_constraints
approval_requests
candidate_updates
```

## Run locally

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

Turn call:

```bash
curl -X POST http://localhost:3000/turn \
  -H 'content-type: application/json' \
  -d '{
    "userId":"00000000-0000-0000-0000-000000000001",
    "chatId":"demo-thread",
    "project":"acs",
    "message":"Supabase has been created. Build the next layer."
  }'
```

## Deploy

### Render / Railway / Fly.io

Use the included `Dockerfile`.

Required environment variables:

```text
OPENAI_API_KEY
OPENAI_MODEL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

### Vercel

This is currently an Express server. For Vercel, wrap `runAssistantTurn` in a route handler under `app/api/turn/route.ts` or `pages/api/turn.ts`.

## Control layer behaviour

The generator controls prevent bad paths before final output:

```text
Explicit Content Lock
Build-State Lock
Authority Delegation Lock
Signal Validation Gate
Response Mode Lock
Object Contact Lock
Output Non-Interference Lock
Traceability Gate
```

Example:

```text
Input: "Supabase has been created."
Control: Build-State Lock
Blocked path: regenerate_completed_build_state
```

The output layer returns `payload.response_text` only. It does not add, soften, reframe, or repair after the reasoning payload is selected.
