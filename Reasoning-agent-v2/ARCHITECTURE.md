# Architecture

## System shape

```text
ChatGPT / API caller
  -> Cloudflare Worker
  -> Context Orchestrator
  -> Cognitive Router
  -> Model call through AI Gateway
  -> Response
  -> State delta logging
  -> Queued reflection / ingestion / sync
```

## Substrate responsibilities

### Supabase
Durable metacognitive and epistemic state:

- assistant_state
- user_state
- reasoning_graphs
- reasoning_nodes
- reasoning_edges
- inference_logs
- epistemic_checks
- strategy_library
- strategy_uses
- soft_constraints
- constraint_updates
- assistant_reflections
- batch_logs
- approval_requests
- events
- session_deltas
- cognitive_state_snapshots

### Zep
Conversational and temporal memory:

- chat history
- user/project continuity
- temporal facts
- relationship memory
- cross-session context

### Chroma
Semantic pattern/protocol retrieval:

- interaction protocols
- landed examples
- failed examples
- schema docs
- reasoning examples
- PDF/thread excerpts
- similar-move retrieval

### Cloudflare D1
Edge runtime metadata:

- job ledger
- route config
- sync state
- queue metadata
- lightweight runtime cache indexes

### Durable Objects
Live coordination:

- session coordinator
- task coordinator
- lock/coherence guard
- live state holder for active interactions

### Cloudflare Queues
Async work:

- session rollup
- reflection flush
- Chroma ingestion
- Zep/Supabase sync checks
- automation/job dispatch

## Cognitive Router

The router decides:

```json
{
  "current_mode": "mapping",
  "reasoning_graph_depth": "thin",
  "strategy": "reduce_abstraction",
  "context_budget": "minimal",
  "visible_epistemics": "light",
  "permission_state": "suggest_only",
  "response_shape": "short_corrective_continuation"
}
```

The router decides expansion depth, not whether reasoning integrity matters.
