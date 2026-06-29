# Agentic Control Plane

Authority-controlled multi-agent runtime scaffold for `/srv/ai-stack`.

This app is a general-purpose orchestration layer. It is not a Hue/Home Assistant-specific tool, though home automation can be one domain plugin family.

## Intent

The runtime separates cognition, authority, and action:

- agents can route, reason, inspect, audit, and propose
- deterministic policy decides what is allowed
- executor accepts only typed action packets with matching grants
- v1 ships read-only adapters and blocked mutation scaffolds

No v1 command writes to Hue, Home Assistant, Node-RED, HomeKit, Google Home, or other live systems.

## Commands

```bash
npm install
npm run check
npm test
npm run evals
npm run build
npm run cli -- capabilities
npm run cli -- agents
npm run cli -- dry-run examples/hue-only-request.json
npm run dev
```

HTTP service defaults to port `8791`.

```bash
curl http://127.0.0.1:8791/health
curl http://127.0.0.1:8791/capabilities
```

## Safety Model

Default authorization is `READ_ONLY`.

Side-effecting capabilities are registered, but blocked unless a future typed grant matches:

- system
- operation type
- target
- forbidden systems
- forbidden operations
- expiry

Natural-language permission is not accepted by the executor. The executor requires an `ActionPacket` and matching `AuthorizationGrant`, and v1 still returns `dry_run_only` for policy-valid mutation packets.

## Runtime Surfaces

- `GET /health`
- `GET /policy`
- `GET /capabilities`
- `GET /agents`
- `POST /work-orders/dry-run`
- `POST /work-orders/route`
- `GET /work-orders/:id`
- `GET /ledger`
- `POST /evals/run`

## Domain Agents

- `orchestrator`
- `research`
- `home_map`
- `home_assistant`
- `node_red`
- `documentation`
- `audit`
- `motion_placement`
- `executor`

Agent contracts live in code and declare allowed reads, proposal boundaries, forbidden systems, escalation rules, and required evidence.

## V1 Adapters

Implemented:

- filesystem corpus inventory
- read-only unavailable evidence scaffold for future adapters

Registered but not live-mutating:

- Hue inventory/read capability
- Home Assistant read capability
- Node-RED read capability
- docs write capability
- memory write capability
- executor capability

Mutation adapters are intentionally absent in v1.

## Evals

The eval suite checks the observed failure modes:

- Hue-only requests cannot write HA
- docs require audit
- product/current-info requests require research
- Node-RED restart is blocked without grant
- executor rejects natural-language permission
- compound tasks route to multiple agents

Run:

```bash
npm run evals
```
