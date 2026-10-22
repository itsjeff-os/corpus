# unifi-mcp-server v2

MCP server for UniFi Network — full read/write control plus a live event watcher over SSE.

## What's in here

- **30+ read tools** — devices, clients, WANs, firewall policies, zones, ACL rules, DNS, DPI, VPN, rogue APs, alerts
- **20+ action tools** — restart devices, block/unblock clients, manage WiFi SSIDs, create/delete firewall policies with scheduling, ACL rules, DNS policies, traffic matching lists
- **Live event watcher** — polls UniFi every 15s and pushes events over SSE and MCP logging notifications when things change

## Events the watcher detects

| Category | What triggers it |
|----------|-----------------|
| `wan` | WAN goes down/up, packet loss above threshold, latency above threshold |
| `device` | Any adopted device goes offline or comes back online |
| `client` | New/unrecognised client connects to the network |
| `alert` | New UniFi system alert (not previously seen) |
| `security` | New rogue AP detected |

## Setup

```bash
cp .env.example .env
# fill in your values
npm install
npm run build
npm start
```

### Get your site UUID (v1 API)

```bash
curl -s -H "X-API-Key: YOUR_API_KEY" https://YOUR_CONTROLLER/v1/sites | jq '.[].id'
```

## Running modes

### stdio (Claude Desktop)

```bash
TRANSPORT=stdio npm start
```

Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "unifi": {
      "command": "node",
      "args": ["/path/to/unifi-mcp-server/dist/index.js"],
      "env": {
        "UNIFI_CONTROLLER": "https://192.168.1.1",
        "UNIFI_API_KEY": "your-key",
        "UNIFI_SITE_ID": "your-site-uuid",
        "UNIFI_SITE_NAME": "default"
      }
    }
  }
}
```

### HTTP + SSE (Cloudflare agents, orchestrators)

```bash
TRANSPORT=http PORT=3000 npm start
```

Endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/mcp` | POST | MCP JSON-RPC |
| `/events` | GET | SSE stream — live network events |
| `/health` | GET | Status + active SSE client count |

### Consuming the SSE stream

```javascript
const es = new EventSource("http://your-mini-pc:3000/events");

es.onmessage = (e) => {
  const event = JSON.parse(e.data);
  console.log(event.severity, event.title, event.detail);
};
```

Event shape:

```typescript
{
  id:        string;          // unique event ID
  severity:  "info" | "warning" | "critical";
  category:  "wan" | "device" | "client" | "security" | "alert";
  title:     string;          // short human-readable summary
  detail:    string;          // full detail
  timestamp: string;          // ISO 8601
  raw?:      unknown;         // raw UniFi API payload
}
```

### Watcher thresholds

All configurable via env vars — see `.env.example`.

## Test with MCP Inspector

```bash
npm run inspector
```
