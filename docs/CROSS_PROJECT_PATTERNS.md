# Cross-Project Patterns

Shared data models, API shapes, conventions, and copy-paste patterns found across all projects.

---

## Duplicate Projects (Identical Code)

The following pairs are confirmed byte-for-byte or near-identical duplicates:

| Canonical | Duplicate | What differs |
|---|---|---|
| `agentic-control-plane/src/` | `Compile - Agentic-Control-Plane/src/` | Nothing in src/; Compile adds RELATED reference folders |
| `systems/` (all Python files) | `Systems-dho1GH-zep/` (Python files) | Nothing in Python; Systems-dho1GH adds Dockerfile, k8s, Node.js |
| `cf-redo-ryan/src/` | `jeffe-os-main/src/` | Nothing; only package names differ |
| `ship-backend-v0/` | `ship-backend-v0 2/` | Nothing |
| `redo-ryan/` | `redo-ryan-main/` | Nothing |

**Total estimated duplicate lines:** ~10,000+ lines across 5 pairs.

---

## Shared Data Models

### Zep Memory Interface (TypeScript)

A near-identical `ZepMemoryService` pattern appears in three projects:

**Full version** — `runtime-core-v1/src/memory/zepMemory.ts` (288 lines):
```typescript
interface ZepMemoryStatus {
  configured: boolean
  threadReused: boolean
  contextUsed: boolean
  messageAddedToZep: boolean
  degraded: boolean
  error?: string
}

interface ZepContextResult {
  userId: string
  threadId: string
  context: string
  recentMessages: any[]
  memory: any
}

interface AddMessageInput { userId, threadId, role, name, content, returnContext }
interface AddTurnInput    { userId, threadId, userMessage, assistantMessage }

class ZepMemoryService {
  ensureUser(userId)
  ensureThread(userId, threadId)
  getUserContext(userId, threadId) -> ZepContextResult
  addMessages(input: AddMessageInput)
  addTurn(input: AddTurnInput)
}
```

**Subset version** — `redo-ryan/src/services/zepMemory.ts` (118 lines):  
Same core methods (`ensureUser`, `ensureThread`, `getUserContext`), simpler interfaces. `runtime-core-v1` is the superset.

**Also present in:** `redo-ryan-main/` (identical to redo-ryan version), `reasoning-agent/`, `ai-assistant/`

---

### Agentic Control Plane Schema (Zod)

Defined once in `agentic-control-plane/src/schemas.ts` (220 lines); duplicated verbatim in `Compile - Agentic-Control-Plane/src/schemas.ts`:

```typescript
// Enums
SystemIdSchema          // "hue" | "home_assistant" | "node_red" | "docs" | "memory" | "corpus" | "executor"
OperationTypeSchema     // "read" | "write" | "restart" | "execute" | "delete" | "create" | "update" | "audit"
AuthorizationScopeSchema // 9 scopes: READ_ONLY, APPLY_HUE_METADATA_ONLY, ..., EXECUTE_APPROVED_PACKET
AgentIdSchema
WorkDomainSchema

// Objects
AgentContractSchema     // owns[], mayRead[], mayPropose[], mayWrite[], mayExecute[], forbidden[], mustEscalate[]
PolicyDecisionSchema    // allowed | blocked | dry_run_only
WorkOrderSchema         // intent, domain, mode, context, constraints
ActionPacketSchema      // system, operationType, target, payload, requestedBy, timestamp
AuthorizationGrantSchema // scope, systems[], allowedOperations[], forbiddenSystems[], forbiddenOps[], expiry
EvidenceBundleSchema    // observations[], conflicts[], confidence, sourceAgents[]
```

---

### Runtime Core Types

`runtime-core-v1/src/runtime/router.ts`:
```typescript
type RuntimeMode    = "observing" | "mapping" | "clarifying" | "responding" | "repairing"
type ContextBudget  = "minimal" | "standard" | "expanded"
type ReasoningGraphDepth = "thin" | "expanded"

interface ReasoningRuntime { mode, contextBudget, graphDepth, rationale }
interface RuntimeDecision  { runtime, derivedFrom, timestamp }
```

`runtime-core-v1/src/reasoning/graphCore.ts`:
```typescript
type ReasoningNodeKind   = "observation" | "interpretation" | "inference" | "conclusion"
type ReasoningNodeStatus = "active" | "superseded" | "invalidated" | "challenged"

interface ReasoningNode {
  id, kind, status, claim, basis: string[],  // basis = upstream evidence IDs
  confidence: number, timestamp, meta?
}
interface ReasoningEdge {
  from, to,
  rel: "supports" | "challenges" | "supersedes" | "requires"
}
```

---

### Python Agent Models

Identical across `systems/`, `Systems-dho1GH-zep/`, `dynamic advanced_v1 /`:
```python
class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL   = os.getenv("OPENAI_MODEL", "gpt-4")
    ZEP_API_URL    = os.getenv("ZEP_API_URL", "http://localhost:8000")
    ZEP_API_KEY    = os.getenv("ZEP_API_KEY")
    AGENT_NAME     = os.getenv("AGENT_NAME", "Assistant")
    MAX_TOKENS     = int(os.getenv("MAX_TOKENS", "2000"))
    TEMPERATURE    = float(os.getenv("TEMPERATURE", "0.7"))

@dataclass
class ConversationNode:
    message_id: str
    role: str
    content: str
    timestamp: datetime
    children: List[str]
    parent: Optional[str]
    topics: List[str]
    relevance_score: float
```

---

## Shared API Endpoint Patterns

### Universal `/health` Endpoint

Every API project implements a health check. Pattern is consistent:

```typescript
// TypeScript (Express)
app.get("/health", (req, res) => res.json({ status: "ok", ... }))

// TypeScript (Hono)
app.get("/health", async (c) => c.json({ status: "ok", ... }))
```
```python
# Python (FastAPI)
@app.get("/health")
async def health(): return {"status": "ok"}

# Python (Flask)
@app.route('/health', methods=['GET'])
def health(): return jsonify({"status": "ok"})
```

---

### `/context` + `/log-turn` Pattern

`runtime-core-v1` introduced this pair; the pattern carries intent from `agentic-control-plane`'s `work-orders`:

| Project | Context endpoint | Turn/event logging |
|---|---|---|
| `agentic-control-plane` | `GET /capabilities` | `GET /ledger` |
| `runtime-core-v1` | `GET /context` | `POST /log-turn` |
| `acs_full_loop` | `POST /turn` (single unified endpoint) | embedded in turn handler |
| `systems/` Python | (none) | `/api/v1/chat` (implicit) |

---

### Endpoint Shape Comparison

```
agentic-control-plane (8791)    runtime-core-v1              acs_full_loop (3000)
─────────────────────────────   ──────────────────────────   ──────────────────────
GET  /health                    GET  /health                 GET  /health
GET  /policy                    GET  /context                POST /turn
GET  /capabilities
GET  /agents
POST /work-orders/dry-run       POST /reasoning/validate
POST /work-orders/route         GET  /reasoning/schema
GET  /work-orders/:id           POST /runtime/derive
GET  /ledger                    POST /runtime/new-graph
POST /evals/run                 POST /runtime/gates/evaluate
                                POST /log-turn
                                POST /snapshot-session
                                POST /propose-update
                                POST /approval-request
                                POST /memory/context
                                POST /memory/message
                                POST /memory/turn
                                POST /memory/seed
```

---

## Shared Conventions

### Zod Schema Export Pattern

Used in 13+ TypeScript projects. Consistent pattern everywhere:

```typescript
// Define schema
export const XSchema = z.object({ ... })
// Derive type
export type X = z.infer<typeof XSchema>
```

---

### Error Handling with Degraded Flag

Originated in `runtime-core-v1`, also in `redo-ryan`:

```typescript
// Rather than throwing, return a status with degraded flag
{
  ...baseStatus(),
  degraded: true,
  error: error instanceof Error ? error.message : String(error)
}
```

---

### Environment Config Pattern (`config/env.ts`)

Every TypeScript project uses this structure:

```
src/
  config/
    env.ts    ← loads from process.env / dotenv / 1Password
```

`runtime-core-v1` additionally supports 1Password SDK loading and `CODEX_*` aliases for backward compatibility.

---

### HTTP Framework Split

| Framework | Projects | Notes |
|---|---|---|
| **Express** | `agentic-control-plane`, `Compile - Agentic-Control-Plane`, `ai-assistant`, `acs_full_loop`, `chatgpt-business-control-layer` | 5 projects |
| **Hono** | `runtime-core-v1`, `smexybeast-openapi` | 2 projects — newer convention |
| **FastAPI** | `ship-backend-v0`, `e-version`, `runtime-v0-intent-prototype` | Python |
| **Flask** | `systems`, `Systems-dho1GH-zep`, `gpt-assistant` | Python |
| **FastMCP** | `zep-autogen-workspace`, `gpt-assistant` | MCP protocol |

**Trend:** Newer TypeScript projects use Hono over Express. Hono is also more Cloudflare Workers-compatible.

---

### Session/User ID Convention

Consistent across Python and TypeScript:
```python
# Python
session_id = data.get('session_id') or str(uuid.uuid4())
active_sessions: Dict[str, Any] = {}
```
```typescript
// TypeScript
const sessionId = req.body.sessionId ?? crypto.randomUUID()
```

---

## Common External Dependencies

### Top Dependencies Across 3+ Projects

| Dependency | Count | Key Projects |
|---|---|---|
| **zod** | 13+ | All major TypeScript projects |
| **dotenv** | 12+ | Nearly all TS and Python projects |
| **openai** | 9 | agentic-control-plane, runtime-core-v1, chatgpt-business, reasoning-agent, ai-assistant, redo-ryan, systems, gpt-assistant |
| **@getzep/zep-cloud** | 6 | runtime-core-v1, reasoning-agent, ai-assistant, redo-ryan, redo-ryan-main, Zep_Temporal |
| **express** | 5 | agentic-control-plane, Compile-Agentic-Control-Plane, ai-assistant, acs_full_loop, chatgpt-business |
| **typescript** | 13+ | All TS projects |
| **fastapi** | 3 | ship-backend-v0, e-version, runtime-v0-intent-prototype |
| **pg** (PostgreSQL) | 2 | chatgpt-business-control-layer, ship-backend-v0 |
| **hono** | 2 | runtime-core-v1, smexybeast-openapi |
| **@supabase/supabase-js** | 3 | runtime-core-v1, acs_full_loop, personalos-core |

---

## Zep Integration Pattern

Zep is the most consistently used external service across the corpus. Three distinct integration styles:

### TypeScript (Cloud) — `@getzep/zep-cloud`

Used in: `runtime-core-v1`, `redo-ryan`, `reasoning-agent`, `ai-assistant`

```typescript
import { ZepClient } from "@getzep/zep-cloud"
const client = new ZepClient({ apiKey: process.env.ZEP_CLOUD_API_KEY })

// Initialization (idempotent)
await client.user.add({ userId })
await client.memory.addSession({ sessionId, userId })

// Usage
await client.memory.add(sessionId, { messages: [...] })
const context = await client.memory.get(sessionId)
const { context: contextText, messages } = context
```

### Python (v1) — `zep-python`

Used in: `systems`, `Systems-dho1GH-zep`, `dynamic advanced_v1`

```python
from zep_python.client import Zep
from zep_python import Message

client = Zep(api_key=os.getenv("ZEP_API_KEY"))
client.memory.add_session(session_id=session_id)
client.memory.add(session_id, messages=[
    Message(role_type="user", content=user_msg),
    Message(role_type="assistant", content=assistant_msg)
])
memory = client.memory.get(session_id)
```

### Python (v2) — `zep-cloud`

Used in: `zep-autogen-workspace`

```python
from zep_cloud.client import Zep
client = Zep(api_key=os.environ.get("ZEP_API_KEY"))
# Simpler API — no explicit session initialization
```

---

## Cloudflare Infrastructure Patterns

### Shared wrangler.toml Bindings

The `default/wrangler.toml` appears to be a reference/template config. Several bindings appear across Cloudflare projects:

```toml
# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "..."
database_id = "..."

# Queues
[[queues.producers]]
binding = "REFLECTION_QUEUE"
queue = "reasoning-agent-reflection"

# Durable Objects
[[durable_objects.bindings]]
name = "SESSION_COORDINATOR"
class_name = "SessionCoordinator"
```

The combination of `REFLECTION_QUEUE` + `SESSION_COORDINATOR` suggests a planned architecture where reasoning reflection events are queued and a Durable Object coordinates session state — seen in embryonic form but not fully implemented in any single project.

---

## Patterns Present in Design Docs but Not Yet in Code

Based on cross-referencing `asa_psra_workflow_pack/`, `PSA:PRSA/`, and `runtime-core-v1/README.md`:

| Planned Feature | Described In | Implemented In |
|---|---|---|
| ChatGPT-facing MCP surface | `runtime-core-v1/README.md` | Not yet |
| Chroma retrieval | `runtime-core-v1/README.md`, `acs_full_loop/src/adapters/chroma.ts` (stub) | Stub only |
| OpenAI Agents SDK inside RuntimeCore | `runtime-core-v1/README.md` | Not yet |
| Autonomous action execution | `runtime-core-v1/README.md` | Not yet (dry_run_only in V1) |
| Hue / HA / Node-RED live mutation | `agentic-control-plane/README.md` | Blocked in V1 |
| `_save_graph_to_zep()` / `_load_graph_from_zep()` | `systems/agent_enhanced.py` | Placeholder stubs |
| Conversation graph Zep persistence | Python agent design | Stubs only |
