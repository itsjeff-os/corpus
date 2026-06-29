# ChatGPT Business Control Layer

Internal, tool-only MCP service for a governed ChatGPT Business app.

## What it does

- exposes exact `search` and `fetch` tools for company-knowledge style retrieval
- routes non-trivial requests through `answer_with_control`
- runs structured integrity evaluators before approving an answer
- persists runs and approval events in Postgres
- supports one human-approved write path: `create_internal_note`

## Tools

- `search`
- `fetch`
- `answer_with_control`
- `explain_integrity_report`
- `prepare_write_action`
- `execute_write_action`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in the required values:

```bash
cp .env.example .env
```

3. Start Postgres and create a database that matches `DATABASE_URL`.

4. Start the server:

```bash
npm run dev
```

The server listens on `http://127.0.0.1:8788/mcp` by default.

## Notes

- Postgres is the production store. `ALLOW_MEMORY_STORE=true` exists only to keep local development and tests runnable without a database.
- `search` and `fetch` return JSON strings in MCP `content` to stay compatible with company-knowledge style retrieval.
- Write execution is limited to one private-system adapter and always requires `prepare_write_action` followed by `execute_write_action`.
