# ChatGPT Search Fetch Starter

`tool-only` Apps SDK starter for connector-like or sync-oriented use cases.

This repo exposes the standard read-only `search` and `fetch` tools over a local sample corpus. It does not register a UI resource.

## What it contains

- A small Node HTTP server on `/mcp`
- Standard MCP `search` and `fetch` tools
- Read-only tool annotations
- A local corpus so the app is runnable without external services

## Run

```bash
node src/server.js
```

The server listens on `http://localhost:8787` and exposes MCP at `http://localhost:8787/mcp`.

## Smoke test

If the server is already running:

```bash
npm run smoke
```

Initialize the server:

```bash
curl -s http://localhost:8787/mcp \
  -H 'content-type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"initialize",
    "params":{"protocolVersion":"2026-01-26","capabilities":{},"clientInfo":{"name":"curl","version":"0.1"}}
  }'
```

List tools:

```bash
curl -s http://localhost:8787/mcp \
  -H 'content-type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":2,
    "method":"tools/list",
    "params":{}
  }'
```

Call `search`:

```bash
curl -s http://localhost:8787/mcp \
  -H 'content-type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":3,
    "method":"tools/call",
    "params":{"name":"search","arguments":{"query":"developer mode"}}
  }'
```

Call `fetch`:

```bash
curl -s http://localhost:8787/mcp \
  -H 'content-type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":4,
    "method":"tools/call",
    "params":{"name":"fetch","arguments":{"id":"chatgpt-developer-mode"}}
  }'
```

## ChatGPT developer mode

1. Start the server locally.
2. Expose it over HTTPS with a tunnel such as `ngrok http 8787`.
3. Add the public `https://.../mcp` URL in ChatGPT developer mode.
4. Refresh the app after changing tools or metadata.

## Notes

- `search` returns a JSON string with a `results` array.
- `fetch` returns a JSON string with `id`, `title`, `text`, `url`, and `metadata`.
- The repository intentionally avoids a widget resource because the archetype is `tool-only`.
