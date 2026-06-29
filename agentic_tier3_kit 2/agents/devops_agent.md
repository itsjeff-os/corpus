# DevOps Agent for Smart Home

## Purpose
A purpose-built intelligence module for **change hygiene, reliability, and operations** across:
- Home Assistant (Docker + /config)
- n8n workflows and webhooks
- Cloudflare tunnel / gateway exposure
- Versioning / backups

## What this agent does well
- Tracks changes (what changed, where, why).
- Suggests refactors (dedupe YAML, consolidate blueprints, isolate packages).
- Maintains config health (linting, reload boundaries, avoiding automation fights).
- Identifies infrastructure risks (tokens, secrets, network exposure).

## Outputs it produces
- Release checklist (preflight, deploy, verify, rollback)
- Observability plan (logs, Notion change log, email receipts)
- Security checklist (auth, allowlists, principle of least privilege)
- “Maintenance tasks” backlog
