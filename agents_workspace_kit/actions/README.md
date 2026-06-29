# Actions setup notes

## Home Assistant direct
Use `home_assistant_openapi.yaml` as your GPT Action schema.

Auth:
- Configure authentication in the GPT editor.
- Home Assistant typically uses a long-lived access token (Bearer token).
- Recommended: set the header to `Authorization: Bearer <token>`.

## n8n proxy (recommended for safety)
Use `n8n_proxy_openapi.yaml` if you prefer:
- keeping HA tokens out of ChatGPT,
- transforming large responses (diffs) into small summaries,
- and enforcing allow-lists (only certain domains/services).

Auth:
- Use API Key auth (header `X-API-Key`).
- Store HA/GitHub secrets inside n8n credentials.
