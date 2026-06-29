# Constraint Integrity Worker

A deployable Cloudflare Worker that turns explicit constraints into hard validation gates for a conversation, design thread, or workflow session.

## What it does

- Stores per-session constraints in a Durable Object.
- Stores banned mechanism names and banned solution classes.
- Validates a proposed output *before* you accept or forward it.
- Records the last violation and increments a violation counter.

This addresses the failure mode where constraints are acknowledged in language but not enforced in generation.

## Architecture

- **Worker**: HTTP ingress + request routing.
- **Durable Object**: authoritative per-session state and validation.
- **Optional KV later**: shared policy templates or rule libraries.

## Session state

Each session stores:

- `constraints`: machine-checkable prohibitions/requirements
- `bannedSolutionClasses`: solution classes that must not reappear
- `bannedMechanisms`: mechanism flags that must not reappear
- `violationCount`
- `lastViolation`

## Constraint format

Use mechanism-level constraints, not preference language.

```json
{
  "constraints": [
    {
      "id": "C1",
      "type": "prohibition",
      "target": "manual_categorisation",
      "description": "Do not require manual categorisation"
    },
    {
      "id": "C2",
      "type": "prohibition",
      "target": "placement_decisions",
      "description": "Do not require placement decisions as normal operation"
    }
  ]
}
```

## Proposal format

A proposal is validated based on the mechanisms it requires from the user.

```json
{
  "proposal": {
    "solutionClass": "folder_based_placement_system",
    "mechanisms": {
      "manual_categorisation": true,
      "placement_decisions": true,
      "multi_location_workflow": false
    },
    "claims": [
      {
        "type": "structural_difference"
      },
      {
        "type": "intent_attribution",
        "evidenceQuote": ""
      }
    ],
    "structuralDelta": {
      "previousRequired": ["placement_decisions"],
      "currentForbidden": []
    }
  },
  "autoban": true
}
```

## Endpoints

All routes are session-scoped under `/sessions/:sessionId/...`.

### Health

- `GET /health`

### Read current session state

- `GET /sessions/:sessionId/state`

### Replace all constraints

- `PUT /sessions/:sessionId/constraints`

### Append constraints

- `POST /sessions/:sessionId/constraints/append`

### Ban a solution class

- `POST /sessions/:sessionId/ban-class`

### Ban one or more mechanisms

- `POST /sessions/:sessionId/ban-mechanisms`

### Validate a candidate proposal

- `POST /sessions/:sessionId/validate`

### Reset a session

- `DELETE /sessions/:sessionId/reset`

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Deploy

```bash
npm run deploy
```

Cloudflare recommends using Wrangler config as the source of truth, supports JSON/JSONC config, and requires Durable Object bindings plus a migration entry when you create a new Durable Object class. See the official docs for details.

## Example usage

### Seed constraints

```bash
curl -X PUT http://127.0.0.1:8787/sessions/demo/constraints \
  -H 'content-type: application/json' \
  -d '{
    "constraints": [
      {"id":"C1","type":"prohibition","target":"manual_categorisation"},
      {"id":"C2","type":"prohibition","target":"placement_decisions"}
    ]
  }'
```

### Validate a failing proposal

```bash
curl -X POST http://127.0.0.1:8787/sessions/demo/validate \
  -H 'content-type: application/json' \
  -d '{
    "proposal": {
      "solutionClass": "folder_based_placement_system",
      "mechanisms": {
        "manual_categorisation": true,
        "placement_decisions": true
      },
      "claims": [
        {"type":"structural_difference"},
        {"type":"intent_attribution"}
      ],
      "structuralDelta": {
        "previousRequired": ["placement_decisions"],
        "currentForbidden": []
      }
    },
    "autoban": true
  }'
```

### Read state

```bash
curl http://127.0.0.1:8787/sessions/demo/state
```

## Extending this

The next useful additions would be:

- upstream model proxying only after validation passes
- optional KV-backed shared rule templates
- signed audit logs
- environment-specific auth in front of write routes

## Notes

This zip is deployable as a Worker project. You will still need:

- a Cloudflare account
- Wrangler authentication (`npx wrangler login`)

No KV namespace is required for this version.
