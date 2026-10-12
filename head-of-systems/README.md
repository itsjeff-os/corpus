# Head of Systems

A governed CrewAI service that exposes Jeff's systems crew through a small
FastAPI boundary. It is designed to sit behind the future conversational UI;
it is not the UI itself.

## What exists

Nine named agents are registered:

- `systems_engineer_lead` — the only agent allowed to delegate
- `architect`
- `ha_specialist`
- `node_red_specialist`
- `cloudflare_specialist`
- `networking_specialist`
- `linux_ssh_operator`
- `reviewer`
- `deployer` — execution mode only

Requests are routed deterministically before CrewAI runs. Exploration includes
the lead, architect, relevant specialists, and independent reviewer. Execution
uses a fixed lead/Linux/deployer crew and accepts only a previously staged,
digest-matched, explicitly approved change set.

## Safety boundary

The service defaults to read-only investigation. Its persistent write surface
is only `./staging`, which stores approval records, execution reports, and an
audit ledger.

It does **not** receive:

- the Docker socket
- the host filesystem
- an SSH private key
- Home Assistant write/service-call tooling
- Node-RED deploy/admin tooling
- Cloudflare mutation tooling

`POST /execute` means “validate and consume this approved staged packet.” The
returned report always declares `execution_authority: staging_only` and
`live_mutation_performed: false`. A future live executor must be a separate,
explicitly authorized adapter.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Configuration-safe service status |
| `GET` | `/agents` | Agent roster and delegation boundary |
| `POST` | `/route` | Deterministic routing preview |
| `POST` | `/explore` | Run a read-only specialist/reviewer/lead crew |
| `POST` | `/stage` | Store a candidate change set and issue its digest |
| `GET` | `/approvals/{id}` | Read approval state |
| `POST` | `/approve` | Approve an exact digest with an explicit actor |
| `POST` | `/approvals/{id}/revoke` | Revoke an unused approval |
| `POST` | `/execute` | Validate and consume an approved staged packet |

Interactive OpenAPI documentation is available at `/docs`.

## Provider configuration

The model is selected with `MODEL`. The mini-PC deployment defaults to:

```text
MODEL=gemini/gemini-3.5-flash
```

The Compose service reads the already-generated Gemini credential from:

```text
/home/sysadmin/ops/secrets/generated/gemini-sandbox.env
```

Both the standard `GEMINI_API_KEY` name and the generated
`ai-studio_gemini_api_key` name are accepted without copying the secret.

The application contains no OpenAI imports or OpenAI-specific configuration.
Other CrewAI-compatible providers can be selected with `MODEL`,
`MODEL_BASE_URL`, and `MODEL_API_KEY`.

Private integration payloads are not exported to the model by default.
Head of Systems performs routed reads locally, but Gemini receives only status,
HTTP code, and aggregate count metadata. Raw HA state, Node-RED flows,
Cloudflare data, RuntimeCore context, and Zep context require the explicit
operator setting `MODEL_PRIVATE_CONTEXT_ENABLED=true`. Enabling it means those
payloads may leave the mini-PC for the configured model provider.

## Mini-PC deployment

The live host inspection on 2026-07-20 showed that the old documented
`/srv/ai-stack` path no longer exists. The current writable AI root is
`/srv/ai/ai-stack`, so this service is deployed at:

```text
/srv/ai/ai-stack/head-of-systems
```

Start and verify:

```bash
cd /srv/ai/ai-stack/head-of-systems
docker compose config
docker compose build
docker compose run --rm head-of-systems pytest
docker compose up -d
curl http://127.0.0.1:5070/health
```

The service binds only to `127.0.0.1:5070`. A Cloudflare tunnel or local reverse
proxy can expose it later without opening port 5070 to the LAN.

Compose runs the process as host UID/GID `1000:1000` by default so the
`sysadmin`-owned staging bind mount remains writable without granting root or
world-writable permissions. Override `HOS_UID` and `HOS_GID` if the service is
moved to a host with a different owner.

## Approval example

Stage a change set:

```json
{
  "change_set": {
    "request_id": "req_example",
    "objective": "Enable one reviewed Node-RED flow",
    "changes": [
      {
        "system": "node_red",
        "operation": "config_write",
        "target": "flow/example",
        "before": {"enabled": false},
        "after": {"enabled": true},
        "purpose": "Enable the reviewed flow"
      }
    ],
    "rollback_plan": ["Restore the captured disabled flow"],
    "verification_plan": ["Read the resulting flow and run its test injection"],
    "stop_conditions": ["Stop if the current flow differs from the captured before value"],
    "risks": [],
    "evidence_refs": []
  }
}
```

The `/stage` response supplies `approval_id` and `digest`. Both must be sent to
`/approve`, and then again to `/execute`. Any changed staged content, reused
approval, missing rollback, or missing verification fails closed.

## Integrations

Read-only adapters exist for Home Assistant, Node-RED, RuntimeCore, Zep, and
Cloudflare. `/health` reports whether their required settings are present but
never returns credential values. Missing or stopped dependencies degrade the
corresponding inspection; they do not prevent routing, staging, approval, or
health checks.

Copy `.env.example` to `.env` only for non-secret settings. Keep credentials in
generated environment files or 1Password-managed secret injection.
