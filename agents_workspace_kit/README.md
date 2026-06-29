# Agents Workspace Kit (Smart Home + Life Systems)

This kit turns the “purpose‑built AI workers” concept into a working **multi‑agent setup** you can run inside your **ChatGPT workspace**.

It supports three tiers:

1) **Tier 1 — Project-only (no integrations):**  
   Works immediately in a ChatGPT **Project** using project instructions + uploaded files. You copy/paste outputs into Home Assistant manually.

2) **Tier 2 — Custom GPTs (optional):**  
   One Custom GPT per agent for cleaner separation (still manual copy/paste unless you add Actions).

3) **Tier 3 — Actions + (optional) n8n middleware:**  
   Add GPT Actions to let agents **read state** and/or **call services** in Home Assistant, fetch GitHub diffs, etc. n8n can act as a secure proxy / transformer.

---

## Quickstart (Tier 1 — recommended)

### A) Create a Project
Create a ChatGPT Project named something like:
- **“Agents — Smart Home & Life”**

### B) Upload files
If you have a low file limit, upload just:
- `AGENTS_ALL_IN_ONE.md`
- `INVENTORY_TEMPLATE.md`
- `PROJECT_INSTRUCTIONS.txt`

Otherwise upload the whole folder.

### C) Paste project instructions
Open the Project → **Project settings** → paste the content of:
- `PROJECT_INSTRUCTIONS.txt`

### D) Start using agents
Inside the project, start a new chat and type:
- `/agents` (shows the menu)
- `@AE …` (Automation Engineer)
- `@LD …` (Lighting Designer)
- `@DO …` (DevOps Smart Home)
- `@LA …` (Life Architect)

---

## What’s in this kit

### Core
- `PROJECT_INSTRUCTIONS.txt` — the *router* instructions to paste into Project settings
- `AGENTS_ALL_IN_ONE.md` — all agent specs in one file (best for low file limits)
- `agents/` — individual agent spec files (same content, split)
- `protocols/` — shared “Build Mode”, QA, and guardrail protocols
- `templates/` — Home Assistant YAML skeletons + planning templates
- `tests/` — a simple smoke test pack

### Optional integrations
- `actions/` — OpenAPI schemas for GPT Actions (Home Assistant + n8n proxy)
- `n8n/` — example workflow stubs and setup notes

---

## Safety & responsibility
These agents generate automation/config suggestions. Always:
- run config checks,
- test changes in a safe way,
- and keep secrets/tokens out of chat logs.
