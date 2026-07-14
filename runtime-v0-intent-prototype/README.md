# OpenAI Intent Runtime

This is the first OpenAI Agents SDK slice for the personal operating layer.

It treats conversation as the control plane:

```text
natural language
-> structured intent
-> authority boundary
-> risk/distortion check
-> next actions
-> receipt plan
```

Cloudflare, Home Assistant, Node-RED, Zep, Chroma, GitHub, and local services
are execution surfaces. This app is not the whole backend; it is the small
runtime kernel that turns conversation into auditable operational intent.

## Run

The app expects `OPENAI_API_KEY` to be injected by the environment. On this
mini-PC, prefer the existing 1Password agent setup.

`INTENT_RUNTIME_MODEL` defaults to `gpt-4o` so this app does not inherit an
incompatible model setting from another app's env file.

CLI:

```bash
cd /srv/ai-stack/openai-sdk
op run -- uv run intent-runtime compile "Make HA lighting naming coherent and prep evening scenes"
```

With the existing GPT Assistant env file:

```bash
cd /srv/ai-stack/openai-sdk
op run --env-file /srv/ai-stack/apps/gpt-assistant/.env -- \
  uv run intent-runtime compile --project home-assistant \
  "Make HA lighting naming coherent and prep evening scenes"
```

HTTP:

```bash
cd /srv/ai-stack/openai-sdk
op run -- env PORT=8788 uv run python -m intent_runtime.main
```

Then:

```bash
curl -s http://127.0.0.1:8788/health
curl -s http://127.0.0.1:8788/intent \
  -H 'content-type: application/json' \
  -d '{"text":"Make HA lighting naming coherent and prep evening scenes","project":"home-assistant"}'
```

## Current Boundary

This prototype does not write to Home Assistant, Node-RED, Zep, Cloudflare, or
the filesystem. It compiles intent and identifies which approval/execution lane
would be required.

The intended next step is adding read-only project hydration tools, starting
with Home Assistant entity/area/scene inventory.
