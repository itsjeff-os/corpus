# Corpus Project Map

Top-level relationship overview for all projects in this repository.

---

## Project Clusters

### 1. Runtime / Agentic Control (TypeScript — Core System)

The primary lineage. Each project adds a new layer of sophistication on top of the previous.

| Project | Role | Status |
|---|---|---|
| `runtime-v0-intent-prototype/` | Python proof-of-concept; first intent compiler | Archived |
| `agentic-control-plane/` | Authority-controlled multi-agent runtime; policy kernel | Active reference |
| `Compile - Agentic-Control-Plane/` | Identical copy of above (version control artifact) | Duplicate |
| `runtime-core-v1/` | Promoted canonical runtime; Reasoning Graph Core v1.1; Supabase + Hono | Active production |
| `acs_full_loop/` | Full turn loop with signal governance + generator controls | Active |
| `personalos-core/` | Multi-specialist orchestration; file-based; no HTTP | Active library |

**See:** [LINEAGE.md](./LINEAGE.md#runtime--agentic-control-plane-lineage)

---

### 2. Python Agent System (OpenAI + Zep)

Single-agent conversational implementations with memory.

| Project | Role | Status |
|---|---|---|
| `systems/` | Foundation: ZepOpenAIAgent + Flask REST API | Baseline |
| `Systems-dho1GH-zep/` | Identical Python code + cloud infrastructure (Dockerfile, k8s) | Extended deploy variant |
| `dynamic advanced_v1 /` | Identical Python code, Flask removed (library-only) | Stripped variant |
| `zep-autogen-workspace/` | Complete redesign: pyautogen GroupChat + MCP + FastAPI | New paradigm |

**See:** [LINEAGE.md](./LINEAGE.md#python-agent-lineage)

---

### 3. redo-ryan Family (TypeScript)

Two unrelated project pairs that share a naming prefix.

| Project | Role | Status |
|---|---|---|
| `redo-ryan/` | Backend reasoning agent (OpenAI + Zep + Rituals system) | Original |
| `redo-ryan-main/` | Byte-for-byte copy of redo-ryan | Duplicate / snapshot |
| `cf-redo-ryan/` | Cloudflare Workflows demo UI (React + Durable Objects + WebSocket) | Cloudflare starter fork |
| `jeffe-os-main/` | Rebrand of cf-redo-ryan (only package name changed) | Personal deploy fork |

**See:** [LINEAGE.md](./LINEAGE.md#redo-ryan-lineage)

---

### 4. Cloudflare / Edge Projects

Workers, D1, Durable Objects deployments.

| Project | Role |
|---|---|
| `cloudflare-main/` | Documentation-heavy; CI/CD setup guides |
| `cloudflare-worker-d1/` | D1 database worker examples |
| `smexy-beast/` | Cloudflare Worker (wrangler.jsonc) |
| `smexybeast-openapi/` | OpenAPI-typed Worker with D1 migrations |
| `ship-core/` | SHIP smart home Cloudflare Worker |
| `constraint-integrity-worker/` | Data integrity enforcement Worker |
| `default/` | Bare wrangler.toml with D1, Queues, Durable Objects bindings |
| `fictional-dollop-copilot-add-supabase-governance-layer/` | Turborepo monorepo adding Supabase governance + OpenAPI |

---

### 5. Smart Home / SHIP

| Project | Role |
|---|---|
| `ship-backend-v0/` | Python/FastAPI smart home backend: rooms, devices, action execution |
| `ship-backend-v0 2/` | Identical copy of ship-backend-v0 |

---

### 6. GPT / ChatGPT Integrations

| Project | Role |
|---|---|
| `gpt-assistant/` | Python MCP server + OpenAI Assistants API |
| `chatgpt-business-control-layer/` | TypeScript request classifier + routing for ChatGPT |
| `chatgpt-search-fetch-starter/` | Search/fetch starter for ChatGPT Actions |
| `ai-assistant/` | TypeScript AI assistant with message persistence |

---

### 7. Reasoning Agents

| Project | Role |
|---|---|
| `reasoning-agent/` | TypeScript reasoning agent with Zep memory |
| `Reasoning-agent-v2/` | v2 with extended architecture docs |
| `Zep_Temporal/` | Zep temporal memory integration |

---

### 8. Context Engine

| Project | Role |
|---|---|
| `e-version/` | Python "Context Intelligence Platform" — the most architecturally complete single project; trust-scored facts, typed memory, policy gates, retrieval planning |

---

### 9. Documentation / Planning Corpus

| Project | Role |
|---|---|
| `PSA:PRSA/` | Chat salvage pack + workflow planning materials |
| `asa_psra_workflow_pack/` | Actual State Audit + PSRA workflow documentation |
| `agentic_tier3_kit 2/` | Home automation agent kit with HA/GPT/actions templates |
| `agents_workspace_kit/` | All-in-one agent workspace kit; protocols, templates |

---

## Duplicate Projects (Safe to Consolidate)

| Canonical | Duplicate | Delta |
|---|---|---|
| `agentic-control-plane/` | `Compile - Agentic-Control-Plane/` | Identical src/; Compile version adds RELATED reference folders |
| `systems/` | `Systems-dho1GH-zep/` | Python code identical; Systems-dho1GH-zep adds Dockerfile, k8s, Node.js layer |
| `cf-redo-ryan/` | `jeffe-os-main/` | Identical except package name (`cf-redo-ryan` → `jeffe-os`) |
| `ship-backend-v0/` | `ship-backend-v0 2/` | Identical |
| `redo-ryan/` | `redo-ryan-main/` | Identical |

---

## Technology Map

| Technology | Used In |
|---|---|
| TypeScript + Hono | `runtime-core-v1`, `smexybeast-openapi` |
| TypeScript + Express | `agentic-control-plane`, `acs_full_loop`, `ai-assistant`, `chatgpt-business-control-layer` |
| Python + FastAPI | `ship-backend-v0`, `e-version`, `runtime-v0-intent-prototype` |
| Python + Flask | `systems`, `Systems-dho1GH-zep`, `gpt-assistant` |
| Python + MCP/FastMCP | `zep-autogen-workspace`, `gpt-assistant` |
| React + Vite + Tailwind | `cf-redo-ryan`, `jeffe-os-main` |
| Cloudflare Workers + Wrangler | `cf-redo-ryan`, `jeffe-os-main`, `smexy-beast`, `smexybeast-openapi`, `ship-core`, `constraint-integrity-worker` |
| Cloudflare D1 | `smexybeast-openapi`, `cloudflare-worker-d1`, `default` |
| Cloudflare Durable Objects | `cf-redo-ryan`, `jeffe-os-main`, `default` |
| Supabase | `runtime-core-v1`, `acs_full_loop`, `personalos-core`, `fictional-dollop-*` |
| Zep Cloud | `runtime-core-v1`, `redo-ryan`, `redo-ryan-main`, `reasoning-agent`, `ai-assistant`, `Zep_Temporal` |
| Zep Python | `systems`, `Systems-dho1GH-zep`, `dynamic advanced_v1` |
| pyautogen | `zep-autogen-workspace` |
| OpenAI Responses API | `redo-ryan`, `redo-ryan-main` |
| OpenAI Assistants API | `gpt-assistant` |
| Turborepo | `fictional-dollop-copilot-add-supabase-governance-layer` |
| Docker | `runtime-core-v1`, `acs_full_loop`, `ship-backend-v0`, `gpt-assistant`, `Systems-dho1GH-zep` |
