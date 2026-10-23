# Agentic Vault Hono Scaffold

A Cloudflare Workers + Hono TypeScript scaffold for routing text and voice intake through a clean agent pipeline using Supabase, Zep Cloud, Cloudflare Workers AI, and OpenAI.

## Structure

```text
src/
  index.ts          # Main Hono app, CORS, routes, and unified engine pipeline
  types.ts          # Strict shared interfaces
  services/
    zep.ts          # Zep memory adapter and degraded-memory fallback
    supabase.ts     # Control plane state and interaction logging
    openai.ts       # LLM orchestration boundary
supabase/
  schema.sql        # Minimal tables for control plane and interaction logs
```

## Routes

### `GET /health`

Returns a basic health check.

### `POST /text-intake`

Payload:

```json
{
  "message": "What should I remember from this?",
  "sessionId": "ios-session-text",
  "userId": "optional-user-id"
}
```

### `POST /stream-audio`

Send raw audio bytes. The worker transcribes with Cloudflare Workers AI Whisper and forwards the transcript through the same cognitive engine.

Optional header:

```text
x-session-id: ios-session-voice
```

## Setup

Install dependencies:

```bash
npm install
```

Create local secrets for development:

```bash
cp .dev.vars.example .dev.vars
```

Set production secrets:

```bash
wrangler secret put ZEP_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put OPENAI_API_KEY
```

Apply the Supabase schema in `supabase/schema.sql` before sending traffic.

Run locally:

```bash
npm run dev
```

Type check:

```bash
npm run typecheck
```

Deploy:

```bash
npm run deploy
```

## Notes

The Zep adapter is isolated in `src/services/zep.ts` on purpose. If your Zep Cloud endpoint shape differs from the placeholder REST paths, update that one adapter without changing the Hono route or engine architecture.

The OpenAI orchestration is also isolated in `src/services/openai.ts`, so you can replace the current chat-completions call with structured outputs or a richer tool loop later.
