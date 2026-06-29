# Agentic Workspace Tier‑3 Kit (ChatGPT + n8n + Home Assistant + Notion + Email)

This kit turns the “AGENTS — purpose-built AI workers” concept into an executable system inside your ChatGPT workspace.

## What you get
- 5 purpose-built intelligence modules (instructions + operating rules)
- A router spec for running them inside one Custom GPT
- A GPT Actions OpenAPI schema for a small **n8n gateway API**
- Your extracted Home Assistant artifacts (registry, inventory, cleaned YAML, writer script/snippet)

## High-level architecture (Tier 3)
ChatGPT (Custom GPT)
  → GPT Actions (HTTPS)
    → n8n Gateway (auth + audit)
      → Home Assistant API (read/write)
      → Notion API (write)
      → Email provider (write)
      → Optional: GitHub/Supabase for logs

## Setup steps (summary)
1) Deploy/confirm n8n is reachable over HTTPS (Cloudflare Tunnel recommended).
2) Create an n8n “GPT Gateway” workflow implementing:
   - GET /health
   - POST /read/ha/state
   - POST /read/ha/search
   - POST /write/batch (execute ordered ops)
3) In ChatGPT: create a Custom GPT and paste `gpt/CUSTOM_GPT_INSTRUCTIONS.md`.
4) Add an Action and paste `actions/n8n_gateway_openapi.yaml`.
5) Choose “API Key” auth in the GPT editor (store the key in ChatGPT; verify in n8n).
6) Upload “Knowledge” files to the GPT:
   - inventory/home_registry.json
   - inventory/homeassistant_entity_reference.md (treat as *candidate* list)
   - inventory/homelab_overview.txt
   - inventory/SYSTEM_MAP.md

## Why the batch endpoint
We mark /write/batch as **consequential**, so ChatGPT must always show a Confirm/Deny UI. This keeps you in the loop while still automating execution.

## Key note: entity naming conflicts
Your extracted files show multiple competing entity naming sets.
Before shipping any automation, run a read-only Entity Audit against live Home Assistant and reconcile.
