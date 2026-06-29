# Security & Privacy Guardrails (shared)

## Secrets
- Never paste long-lived access tokens, API keys, or passwords into chat.
- Store secrets in Home Assistant `secrets.yaml`, your password manager, or n8n credentials vault.

## Least privilege
- Use scoped tokens where possible.
- Prefer read-only endpoints for “state inspection”.

## External integrations
- If using GPT Actions, configure authentication in the GPT editor (encrypted storage).
- If using n8n, expose only the minimal endpoints required and protect with an API key and HTTPS.

## Logging
- Avoid logging sensitive payloads.
- For debugging, share only the minimal log snippet needed.
