# RuntimeCore v1 Promotion Receipt

Date: 2026-05-26

## Summary

Promoted the former `project-codex` mini-PC service into `RuntimeCore v1`.

RuntimeCore v1 is now the canonical mini-PC runtime core at:

```text
/srv/ai-stack/runtime-core-v1
```

The Python intent-runtime prototype is superseded and archived at:

```text
/srv/ai-stack/archive/runtime-v0-intent-prototype
```

## Intent Preserved

This preserves the Runtime direction as one coherent object:

```text
conversation/project input
-> graph/context state
-> route decision
-> governance/action boundary
-> memory/receipt support
```

The work does not turn RuntimeCore into a narrow assistant or HA-specific agent.
It promotes the strongest existing control-loop substrate and keeps the earlier
Agents SDK prototype as reference material.

## Changes Made

- Renamed package identity from `project-codex` to `runtime-core-v1`.
- Renamed Docker Compose service/container from `project-codex` to
  `runtime-core-v1`.
- Updated health service identity to `runtime-core-v1`.
- Updated startup log identity to `runtime-core-v1`.
- Updated 1Password integration label to `itsjeff.org runtime-core-v1`.
- Added preferred RuntimeCore env aliases:
  - `RUNTIME_CORE_TOKEN`
  - `RUNTIME_CORE_ZEP_API_KEY`
  - `RUNTIME_CORE_USER_ID`
  - `RUNTIME_CORE_THREAD_ID`
- Preserved existing `CODEX_*` env aliases as fallbacks so current 1Password
  setup keeps working.
- Updated Zep metadata source to `runtime-core-v1`.
- Updated README to describe RuntimeCore v1 lineage, boundary, routes, and
  memory model.
- Updated runtime contract docs to identify RuntimeCore v1 as the promoted
  continuation of `project-codex`.
- Added `RUNTIME_CORE_THREAD_ID=runtime-core-v1` and
  `RUNTIME_CORE_USER_ID=jeff` to the mini-PC `.env` without changing existing
  secret values.

## Verification

On the mini-PC:

```text
npm run check
```

passed:

```text
build passed
9 tests passed
```

Docker service was rebuilt and recreated:

```text
container: runtime-core-v1
port: 0.0.0.0:5061->5061/tcp
```

Health check:

```json
{
  "ok": true,
  "service": "runtime-core-v1",
  "version": "0.1.0",
  "storage": "memory_only",
  "port": 5061,
  "authConfigured": false,
  "zepConfigured": true,
  "defaultUserId": "jeff",
  "defaultThreadId": "runtime-core-v1"
}
```

Context endpoint returns the RuntimeCore context bundle with:

```text
cognitive_state
assistant_state
reasoning_runtime
router_decision
zep_context
chroma_retrieval
strategies
constraints
governance
```

## Current Boundary

RuntimeCore v1 is now service-identity-clean, but still intentionally bounded:

- no ChatGPT-facing MCP surface yet
- no OpenAI Agents SDK integration inside RuntimeCore yet
- no durable Supabase/Postgres persistence yet
- no Chroma retrieval yet
- no autonomous external actions

## Followups

Recommended next build slice:

```text
RuntimeCore v1 active loop:
thread identity
route/message endpoint
Zep thread isolation
event/receipt logging
ChatGPT-facing MCP surface
```

## Distortion Test

This preserves the spirit, capability ambition, automation depth, and
experiential intent of the Runtime work. It does not reduce the project into a
smaller assistant wrapper. It promotes the existing control-loop substrate and
clears identity drift before adding new capability.
