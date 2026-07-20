# Version Lineage Map

How projects evolved over time. Three independent lineages exist in this corpus.

---

## Runtime / Agentic Control Plane Lineage

The primary system lineage. Each version introduces a new reasoning or authorization model.

```
runtime-v0-intent-prototype/   ← Python prototype (ARCHIVED)
         │
         ▼
agentic-control-plane/         ← V1: TypeScript, Express, policy kernel, agent contracts
         │  (identical copy)
Compile - Agentic-Control-Plane/
         │
         ▼
runtime-core-v1/               ← V2: Hono, Reasoning Graph Core v1.1, Supabase, 1Password
         │
         ▼
acs_full_loop/                 ← V3: Signal governance layer, generator controls, full turn loop
         │
         ▼
personalos-core/               ← V4: Multi-specialist orchestration, file-based, no HTTP
```

---

### V0 — `runtime-v0-intent-prototype/` (Python, Archived)

**Stack:** Python, FastAPI (port 8788), OpenAI Agents SDK, Pydantic  
**Status:** Archived; superseded by V1

**Key types:**
```python
IntentPacket      # Structured user intent
NextAction        # Derived next action
AuthorityMode     # "talk_through" | "audit_only" | "proposal" | "bounded_execution" | "approval_required" | "blocked"
```

**What it did:** First structured intent compiler. LLM-generated intent packets with implicit authority modes (text descriptions, no formal grant system). No persistence.

**What it lacked:** No formal policy enforcement, no persistence, no multi-agent routing.

---

### V1 — `agentic-control-plane/` (TypeScript, Express, port 8791)

**Stack:** TypeScript, Express 5.2, Zod, JSONL ledger  
**What's new vs V0:**
- Explicit **Authorization Grant** system (5-dimensional capability matching)
- Declarative **agent contracts** (owns / mayRead / mayPropose / mayWrite / mayExecute / mustEscalate)
- **Policy kernel** is deterministic and testable (not LLM-driven)
- 9 named authorization scopes (`READ_ONLY` default)
- `ActionPacket` — typed action request that requires a matching `AuthorizationGrant`
- JSONL **ledger** persistence for audit trail
- **"Natural-language permission is not accepted by the executor"** — first formal statement of this principle

**Key types (Zod-validated):**
```typescript
SystemIdSchema           // "hue" | "home_assistant" | "node_red" | ...
AgentContractSchema      // owns[], mayRead[], mayPropose[], mayWrite[], forbidden[], mustEscalate[]
PolicyDecisionSchema     // allowed | blocked | dry_run_only
WorkOrderSchema          // intent + domain + mode + context
ActionPacketSchema       // system + operation + target + payload
AuthorizationGrant       // scope + systems + allowedOps + forbiddenSystems + forbiddenOps + expiry
EvidenceBundle           // observations[], conflicts[], confidence
```

**Grant matching logic:**
```typescript
capability.requiredGrant === grant.scope
  && grant.systems.includes(capability.system)
  && grant.allowedOperations.includes(capability.operationType)
  && !grant.forbiddenSystems.includes(capability.system)
  && !grant.forbiddenOperations.includes(capability.operationType)
  && (!target || !grant.allowedTargets?.length || grant.allowedTargets.includes(target))
```

**HTTP surface:**
```
GET  /health, /policy, /capabilities, /agents
POST /work-orders/dry-run, /work-orders/route
GET  /work-orders/:id, /ledger
POST /evals/run
```

**Domain agents:** orchestrator, research, home_map, home_assistant, node_red, documentation, audit, motion_placement, executor  
**V1 ships read-only** — mutation adapters intentionally absent.

---

### V2 — `runtime-core-v1/` (TypeScript, Hono)

**Stack:** TypeScript, Hono 4.7, Zod 3.25, Supabase Edge Functions, 1Password SDK, Docker  
**What's new vs V1:**
- **Reasoning Graph Core v1.1** (`src/reasoning/graphCore.ts`, 442 lines) — the most novel type in the corpus
- Authorization gates are now **epistemically grounded** (gates evaluate against what the system *believes*)
- **Supabase integration** via three Edge Functions: `context`, `runtime-event-v2`, `approval-gate`
- **1Password environment loading** for runtime secrets
- Switched from Express → **Hono**
- In-memory event store + Supabase persistence

**Reasoning Graph Core — key concepts:**
```typescript
type ReasoningNodeKind = "observation" | "interpretation" | "inference" | "conclusion"
type ReasoningNodeStatus = "active" | "superseded" | "invalidated" | "challenged"

interface ReasoningNode {
  id, kind, status, claim, basis,   // basis = upstream node IDs (evidence chain)
  confidence, timestamp, meta
}

interface ReasoningEdge {
  from, to,
  rel: "supports" | "challenges" | "supersedes" | "requires"
}
```

**Graph operations:**
- `markInvalidatedAndChallengeDownstream()` — cascading invalidation when evidence changes
- `supersedeNode()` — replace old conclusion with new evidence
- `collectUpstreamNodes()` / `collectDownstreamNodes()` — evidence chain traversal
- Formal validation rules: duplicate IDs, legal status transitions, circular dependencies

**Gate slots** (authorization at claim level):
- `state_claim` — does system know this state?
- `authority` — does agent have authority?
- `evidence` — is there supporting evidence in the graph?
- `user_policy`, `project_policy`, `domain_policy`

**Runtime modes:**
```typescript
RuntimeMode = "observing" | "mapping" | "clarifying" | "responding" | "repairing"
ContextBudget = "minimal" | "standard" | "expanded"
ReasoningGraphDepth = "thin" | "expanded"
```

**HTTP surface:**
```
GET  /health, /context
POST /reasoning/validate, GET /reasoning/schema
POST /runtime/derive, /runtime/new-graph, /runtime/gates/evaluate
POST /log-turn, /snapshot-session, /propose-update, /approval-request
POST /memory/context, /memory/message, /memory/turn, /memory/seed
```

**Environment variable conventions:**
```
RUNTIME_CORE_SUPABASE_URL
RUNTIME_CORE_SUPABASE_SERVICE_ROLE_KEY
RUNTIME_CORE_ZEP_API_KEY
RUNTIME_CORE_TOKEN          (accepts CODEX_* aliases for compat)
```

**Not yet implemented:** Chroma retrieval, OpenAI Agents SDK execution, ChatGPT-facing MCP surface, autonomous action execution.

---

### V3 — `acs_full_loop/` (TypeScript, Express, port 3000)

**Stack:** TypeScript, Express, OpenAI, Zod, Supabase, Zep Cloud  
**What's new vs V2:**
- **Signal governance layer** — first formal model of how to handle *ambiguous* user input
- **Generator controls** — 8 named prevention locks applied before LLM generation
- **Output boundary** — no semantic mutation post-generation
- Single `POST /turn` entry point replaces multi-route surface; full pipeline per turn

**Signal types:**
```typescript
type SignalKind = "explicit" | "implicit"
// Explicit = direct instructions; safe to act on
// Implicit = tone, humor, pattern cues; require validation before action

interface ValidatedSignal {
  kind, content, actionable,
  permittedEffect: "response_only" | "candidate_update" | "both"
}
```

**Validation rule:** Implicit signals only actionable if repeated, confirmed, or unambiguous.  
**Budget:** max 2 actionable signals per turn.

**8 generator control locks** (in `src/controls/generator-controls.ts`):
Prevent LLM generation if conditions not met (e.g., unvalidated implicit signal, missing evidence, authority gap).

**`inferResponseMode()`** returns:
```typescript
ResponseMode = "answer" | "build" | "trace" | "explain"
```

**Persistence:** Supabase tables — `conversation_history`, `events`, `signal_events`, `state`  
**Also uses:** Chroma vector DB wrapper (adapter stub present)

---

### V4 — `personalos-core/` (TypeScript, no HTTP — library)

**Stack:** TypeScript, file-based JSON store (no HTTP framework)  
**What's new vs V3:**
- **Multi-specialist orchestration** — request flows through named specialist roles before execution
- **Work item model** — human-readable, explicit approval required before any action
- **Cue-based interaction assessment** vs pure NLP classification
- **Recovery moves** and **failure risk** tracking per interaction
- File-based persistence (JSON files in `runtime/`) — offline/local capable

**Specialists:**
```typescript
IntakeClassifier    // Classifies request domain and interaction mode
Strategist          // Plans action sequence
ActionCoordinator   // Coordinates execution with approval gates
InteractionRouter   // Routes to correct mode
ContextBuilder      // Assembles context for LLM
```

**Work item lifecycle:**
```
IntakeRequest
  → [IntakeClassifier] → InteractionAssessment
  → [Strategist] → NormalizedIntent
  → [Coordinator] → ActionProposal
  → ApprovalRequest   ← blocks here until approved
  → [execution stub]
```

**Work item statuses:** `planning → planned → awaiting_approval → approved → executed`

**Key types:**
```typescript
InteractionMode    // "chief-of-staff" | "stress-test" | "deep-work" | "reflect" | ...
CueKind            // Named interaction cues (boredom, urgency, exploratory, etc.)
WorkItem           // id, domain, status, proposal, approvalRequest, ledger
Ledger             // decisions[], assumptions[], openQuestions[], recoveryHistory[]
```

**File persistence:**
```typescript
FileRuntimeStore   // Writes WorkItems, Approvals, Reflections as JSON to runtime/
```

**Entry point:** `PersonalOSCore` class; no server, used as library.

---

### Authorization Model Evolution Summary

| Version | Model | Key Principle |
|---|---|---|
| V0 | `AuthorityMode` (text enum) | Implicit; no enforcement |
| V1 | `AuthorizationGrant` (5-dim matching) | Natural language permission not accepted |
| V2 | Gate slots (epistemic) | Authorization reflects belief state |
| V3 | Signal validity gates | Ambiguous signals cannot drive side effects |
| V4 | Specialist approval chains | Explicit human-readable work items |

---

### Reasoning Model Evolution Summary

| Version | Model | Representation |
|---|---|---|
| V0 | LLM-generated | `IntentPacket` (opaque) |
| V1 | Policy rules | `WorkOrder` + policy kernel |
| V2 | Belief graph | `ReasoningGraphCore` (epistemological levels, cascading invalidation) |
| V3 | Signal-refined | `ReasoningPayload` + signal validation |
| V4 | Cue-based | `Ledger` + `InteractionAssessment` |

---

## Python Agent Lineage

```
systems/                       ← Baseline: ZepOpenAIAgent + Flask REST
    │
    ├── Systems-dho1GH-zep/    ← Same Python code + cloud infrastructure (Dockerfile, k8s, Node.js)
    │
    └── dynamic advanced_v1 /  ← Same Python code, Flask removed (library-only)

         (paradigm shift — not a continuation)
         ▼
zep-autogen-workspace/         ← New: pyautogen GroupChat + MCP/FastMCP + FastAPI
```

---

### Baseline — `systems/`

**Stack:** Python, Flask, OpenAI, zep-python, tiktoken  
**Core classes:**

```python
class ZepOpenAIAgent:
    def __init__(session_id: str, user_id: Optional[str] = None)
    def chat(user_message: str, use_history: bool = True) -> str
    def _get_conversation_history() -> List[Dict[str, str]]
    def _save_to_memory(user_message, assistant_message)
    def clear_memory()
    def get_memory_summary() -> Optional[str]

class ConversationNode:
    message_id, role, content, timestamp, children, parent, topics, relevance_score
    def to_dict() -> Dict[str, Any]

class ConversationGraph:
    def add_node(node, parent_id=None)
    def get_branch_history(node_id) -> List[ConversationNode]
    def get_relevant_context(query, max_nodes=10) -> List[ConversationNode]  # keyword matching

class DynamicContextManager:
    # tiktoken-based token counting
    def count_tokens(text) -> int
    def select_context(system_prompt, current_message, history, relevant_nodes) -> List[Dict]

class EnhancedZepOpenAIAgent(ZepOpenAIAgent):
    def chat(..., use_dynamic_context=True, parent_message_id=None)
    def get_conversation_branches() -> List[List[str]]
    def switch_branch(message_id) -> bool
    def get_graph_stats() -> Dict[str, Any]
    # NOTE: _load_graph_from_zep() and _save_graph_to_zep() are placeholder stubs
```

**Flask API routes:**
```
GET  /health
POST /api/v1/chat
POST /api/v1/chat/enhanced
GET  /api/v1/session/graph
POST /api/v1/message
```

**Dependencies:** `openai>=1.0.0`, `zep-python>=2.0.0`, `python-dotenv>=1.0.0`, `tiktoken>=0.5.0`, `flask>=3.0.0`, `flask-cors>=4.0.0`

---

### `Systems-dho1GH-zep/` — Infrastructure Extension

**Python code:** 100% identical to `systems/`  
**What's added:**
- `Dockerfile` + `docker-compose.yml` + `k8s-deployment.yaml`
- `init_cloud.sh` — cloud initialization script
- `CLOUD_DEPLOYMENT.md`, `CLOUD_QUICKSTART.md`, `ARCHITECTURE.md`
- `src/` — Node.js backend layer (`zep.js`, `openai.js`, `tools.js`, controllers, routes)

The Node.js layer appears to be a parallel backend, not integrated into the Python agent code.

---

### `dynamic advanced_v1 /` — Library Extraction

**Python code:** 100% identical to `systems/`  
**What changed:** Flask + flask-cors removed from `requirements.txt`  
**Purpose:** Use the agent as a library without the REST API dependency.

---

### `zep-autogen-workspace/` — Paradigm Shift

**Stack:** Python, FastAPI, pyautogen, MCP/FastMCP, zep-cloud  
**What changed:** Complete architectural redesign. No `ZepOpenAIAgent` class.

**New architecture:**
```python
# MCP tools instead of REST routes
@mcp.tool()
def chat(input: str, user_id: str = "default") -> dict
@mcp.tool()
def memory(user_id: str, limit: int = 10) -> dict

# 5-agent GroupChat instead of single agent
agents = [Planner, Executor, Critic, MemoryAgent, ToolAgent]  # AssistantAgent instances
groupchat = GroupChat(agents=agents + [user_proxy], max_round=8)
manager = GroupChatManager(groupchat=groupchat, llm_config=...)

# Simpler memory interface
def add_message(user_id, role, content)   # zep-cloud (not zep-python)
def get_context(user_id)
```

**Removed:** `ConversationGraph`, `DynamicContextManager`, tiktoken, conversation branching, Flask  
**Added:** `pyautogen`, `mcp[fastmcp]`, `zep-cloud`, `uvicorn`, `fastapi`  
**Config:** Hardcoded inline (`gpt-4o-mini`, `temperature=0.4`) — no `config.py`

---

### Python Agent Delta Table

| Feature | systems/ | Systems-dho1GH-zep | dynamic_v1 | zep-autogen |
|---|---|---|---|---|
| Agent class | ZepOpenAIAgent | identical | identical | None |
| Enhanced class | EnhancedZepOpenAIAgent | identical | identical | None |
| Conversation graph | ✅ | ✅ | ✅ | ❌ |
| Dynamic context | ✅ (tiktoken) | ✅ | ✅ | ❌ |
| Flask REST API | ✅ | ✅ | ❌ | ❌ |
| MCP tools | ❌ | ❌ | ❌ | ✅ |
| Multi-agent | ❌ | ❌ | ❌ | ✅ (GroupChat) |
| Cloud infra | ❌ | ✅ (Docker/k8s) | ❌ | ❌ |
| Zep client | zep-python | zep-python | zep-python | zep-cloud |
| Model | gpt-4 (configurable) | gpt-4 (configurable) | gpt-4 (configurable) | gpt-4o-mini (hardcoded) |

---

## redo-ryan Lineage

The name `redo-ryan` covers two unrelated project pairs.

```
redo-ryan/           ← Backend reasoning agent (TypeScript, OpenAI, Zep, Rituals)
     │
redo-ryan-main/      ← Byte-for-byte identical copy (snapshot / version artifact)


cf-redo-ryan/        ← Cloudflare Workflows demo UI (React, Vite, Durable Objects)
     │               ← Derived from Cloudflare official starter template
jeffe-os-main/       ← Identical to cf-redo-ryan; only package name changed to "jeffe-os"
```

These two pairs share nothing in code or architecture. The name overlap appears to be coincidental or represents a naming period where "ryan" was the agent persona name.

---

### `redo-ryan/` — Reasoning Agent with Rituals

**Stack:** TypeScript, ts-node, OpenAI Responses API, Zep Cloud, Zod  
**Unique contribution:** A **Rituals system** for structured reasoning — not found in any other project.

**Rituals system:**
```typescript
// Signal extraction
detectSleightOfHand(text)   // detects evasive/adversarial language
detectAssumptions(text)
extractSignals(text)

// Frame routing (5 frames)
FrameType = "explore" | "converge" | "audit" | "adversarial" | "synthesize"

// 6 ritual types
RitualType = "checkpoint" | "assumption_audit" | "sleight_of_hand" |
             "inversion_test" | "failure_mode_walkthrough" | "cross_examination"

// Ledger (reasoning state)
interface Ledger {
  decisions: string[]
  assumptions: string[]
  openQuestions: string[]
}
```

**Ritual scheduling:** Checkpoint every 60 turns; condition-based for others.  
**RyanCore flow:**
```
User message
  → Zep context retrieval
  → Signal extraction → Frame detection
  → Ritual planning → Ritual execution (structured OpenAI output)
  → Ledger update
  → Main response generation
  → Zep memory save
```

**`memory-zep/zepClient.py`:** Python Zep Cloud stub (3 lines, not integrated into TS codebase — future integration point).

---

### `cf-redo-ryan/` / `jeffe-os-main/` — Cloudflare Workflows UI

**Stack:** React 19, Vite 7, Tailwind, TypeScript, Cloudflare Workers, Durable Objects  
**Origin:** Cloudflare's official "Workflows Starter Template" (metadata confirms `"publish": true`)

**Architecture:**
```
React App
  └─ App.tsx
  └─ components/WorkflowDiagram.tsx   (4-step visual workflow)
  └─ hooks/useWorkflowWebSocket.ts    (WebSocket reducer)
       ↕ WebSocket
Cloudflare Worker (worker/index.ts)
  └─ POST /api/workflow/start         → creates workflow instance
  └─ GET  /api/workflow/status/:id    → fetch status
  └─ POST /api/workflow/event/:id     → send approval event
  └─ GET  /ws                         → WebSocket upgrade
       ↕ RPC
MyWorkflow (worker/workflow.ts)       (4 steps: do/sleep/waitForEvent/do)
       ↕ updateStep() RPC
WorkflowStatusDO (durable-object.ts)  (Durable Object: WebSocket pool + step state)
```

**`jeffe-os-main` delta:** Only `package.json` name (`"cf-redo-ryan"` → `"jeffe-os"`) and `wrangler.jsonc` name changed. All source files byte-identical.
