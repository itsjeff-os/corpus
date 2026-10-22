# unifi-mcp-server v3

Always-on SSE MCP server for UniFi Network. Full read/write control + live event watcher.

## Architecture

```
client (agent / Claude Desktop)
  │
  ├─ GET /sse          ← opens persistent SSE connection (MCP protocol + watcher events)
  └─ POST /messages    ← sends tool calls (JSON-RPC) upstream
```

The MCP protocol itself runs over the persistent SSE connection — not request/response HTTP. 
The watcher polls UniFi every 15s and pushes events down every open session automatically.

## Tools

- **30+ read tools** — devices, clients, WANs, firewall policies/zones, ACL rules, DNS, DPI, VPN, rogue APs, alerts
- **20+ action tools** — restart devices, block/unblock clients, WiFi SSID management, firewall policies with scheduling, ACL rules, DNS policies, traffic matching lists

## Events pushed over SSE

| Category | Trigger |
|----------|---------|
| `wan` | WAN down/up, packet loss above threshold, latency above threshold |
| `device` | Device goes offline or comes back online |
| `client` | New/unrecognised MAC connects |
| `alert` | New UniFi system alert |
| `security` | New rogue AP detected |

## Setup

```bash
cp .env.example .env
# fill in UNIFI_CONTROLLER, UNIFI_API_KEY, UNIFI_SITE_ID
npm install
npm run build
npm start
```

### Get your site UUID

```bash
curl -s -H "X-API-Key: YOUR_API_KEY" https://YOUR_CONTROLLER/v1/sites | jq '.[].id'
```

## Transport modes

### SSE — always-on (default)

```bash
TRANSPORT=sse npm start
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/sse` | GET | Open persistent session (keep this alive) |
| `/messages` | POST | Send tool calls with `?sessionId=<id>` |
| `/health` | GET | Status + active session count |

Connecting from a Cloudflare agent or orchestrator:

```javascript
// 1. Open the SSE stream — hold this connection open
const eventSource = new EventSource("http://your-mini-pc:3000/sse");

// 2. The server sends an endpoint event with your session ID
eventSource.addEventListener("endpoint", (e) => {
  const messagesUrl = new URL(e.data, "http://your-mini-pc:3000");
  // messagesUrl = http://your-mini-pc:3000/messages?sessionId=<uuid>
  
  // 3. Send tool calls to that URL
});

// Watcher events arrive as MCP log notifications on the same stream
eventSource.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  // msg.params.data = { source, event_id, category, title, detail, timestamp }
});
```

### stdio — Claude Desktop

```bash
TRANSPORT=stdio npm start
```

Claude Desktop config:

```json
{
  "mcpServers": {
    "unifi": {
      "command": "node",
      "args": ["/path/to/unifi-mcp-server/dist/index.js"],
      "env": {
        "UNIFI_CONTROLLER": "https://192.168.1.1",
        "UNIFI_API_KEY": "your-key",
        "UNIFI_SITE_ID": "your-uuid",
        "UNIFI_SITE_NAME": "default",
        "TRANSPORT": "stdio"
      }
    }
  }
}
```

## Test

```bash
npm run inspector
```
