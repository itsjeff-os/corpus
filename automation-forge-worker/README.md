# Automation Forge Worker

A deploy-ready Cloudflare Worker that drafts, approves, deploys, lists, and rolls back personal automations for Node-RED and Home Assistant.

## Deploy

```bash
npm install
npx wrangler kv namespace create AUTOMATIONS
npx wrangler kv namespace create AUTOMATIONS --preview
# paste IDs into wrangler.toml
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put NODE_RED_BASE_URL
npx wrangler secret put NODE_RED_TOKEN
# optional
npx wrangler secret put HOME_ASSISTANT_BASE_URL
npx wrangler secret put HOME_ASSISTANT_TOKEN
npm run deploy
```

## Endpoints

All endpoints except `/health` require `Authorization: Bearer $ADMIN_TOKEN`.

### Draft from intent

```bash
curl -X POST https://YOUR_WORKER.workers.dev/draft \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "content-type: application/json" \
  -d '{"target":"node_red","intent":"Create a manual test webhook flow that logs the payload and sends a debug message."}'
```

### Approve

```bash
curl -X POST https://YOUR_WORKER.workers.dev/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "content-type: application/json" \
  -d '{"id":"AUTOMATION_ID"}'
```

### Deploy

```bash
curl -X POST https://YOUR_WORKER.workers.dev/deploy \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "content-type: application/json" \
  -d '{"id":"AUTOMATION_ID"}'
```

### Rollback

```bash
curl -X POST https://YOUR_WORKER.workers.dev/rollback \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "content-type: application/json" \
  -d '{"id":"AUTOMATION_ID"}'
```

## Notes

- Node-RED deployment is implemented end-to-end via Admin API `/flows`.
- Home Assistant deployment is intentionally conservative: the Worker validates the HA spec and calls `automation.reload`, but does not write YAML directly. For production HA writing, route through Node-RED, AppDaemon, or a small HA add-on endpoint that writes package files and reloads automations.
- No spec can deploy unless it is first approved.
