# n8n middleware (optional)

This kit includes **example workflow stubs** you can import into n8n to expose a small HTTPS API that GPT Actions can call.

Why use n8n?
- Keep Home Assistant tokens out of ChatGPT.
- Add allow-lists (only permit certain services/entities).
- Summarize or truncate large responses (diffs, logs) before returning them to GPT Actions.

## Security checklist
- Put n8n behind HTTPS.
- Use an API key header (e.g., `X-API-Key`) and validate it in the workflow.
- Store HA/GitHub tokens in n8n credentials or environment variables.
- Prefer read-only endpoints unless you truly need write access.

## Workflows
- `workflow_ha_get_state.json` — POST entity_id → returns HA state
- `workflow_ha_call_service.json` — POST domain/service/data → calls HA service
- `workflow_git_latest_changes.json` — returns latest commit/diff summary (repo-specific)

## Important
n8n export formats can vary by version. Treat these as **stubs**:
- import,
- inspect nodes,
- then update parameter names/UI fields to match your n8n version.
