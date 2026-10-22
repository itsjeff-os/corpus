import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import { createClient } from "./services/unifi.js";
import { registerReadTools } from "./tools/read.js";
import { registerActionTools } from "./tools/actions.js";
import { UniFiWatcher, NetworkEvent } from "./watcher.js";

// ── Server ─────────────────────────────────────────────────────────────────────
const server = new McpServer({
  name:    "unifi-mcp-server",
  version: "2.0.0",
});

// ── Client + Tools ─────────────────────────────────────────────────────────────
const client = createClient();
registerReadTools(server, client);
registerActionTools(server, client);

// ── Watcher ────────────────────────────────────────────────────────────────────
const watcher = new UniFiWatcher(server, client, {
  intervalMs:        parseInt(process.env.WATCHER_INTERVAL_MS ?? "15000"),
  wanPacketLossWarn: parseFloat(process.env.WAN_PACKET_LOSS_WARN ?? "2"),
  wanPacketLossCrit: parseFloat(process.env.WAN_PACKET_LOSS_CRIT ?? "10"),
  wanLatencyWarnMs:  parseInt(process.env.WAN_LATENCY_WARN_MS   ?? "80"),
  wanLatencyCritMs:  parseInt(process.env.WAN_LATENCY_CRIT_MS   ?? "200"),
});

// ── SSE client registry (HTTP mode only) ───────────────────────────────────────
// Each connected SSE client gets a response stream registered here.
// When watcher fires an event, it fans out to all open streams.
const sseClients = new Set<Response>();

function fanOutSSE(event: NetworkEvent) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch { sseClients.delete(res); }
  }
}

// ── Transport: stdio ───────────────────────────────────────────────────────────
async function runStdio() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  watcher.start();
  console.error("UniFi MCP server v2 running on stdio (watcher active)");
}

// ── Transport: HTTP + SSE ──────────────────────────────────────────────────────
async function runHTTP() {
  const app = express();
  app.use(express.json());

  // MCP endpoint
  app.post("/mcp", async (req: Request, res: Response) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on("close", () => transport.close());
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  // SSE event stream — any client can subscribe here for live network events
  // GET /events  →  text/event-stream, keeps connection open
  app.get("/events", (req: Request, res: Response) => {
    res.setHeader("Content-Type",  "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection",    "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // nginx: disable buffering
    res.flushHeaders();

    // Send an initial heartbeat so the client knows it's connected
    res.write(`data: ${JSON.stringify({ type: "connected", server: "unifi-mcp-server", timestamp: new Date().toISOString() })}\n\n`);

    sseClients.add(res);
    console.error(`[sse] client connected — ${sseClients.size} active`);

    // Keepalive ping every 30s to prevent proxy timeouts
    const ping = setInterval(() => {
      try { res.write(": ping\n\n"); } catch { clearInterval(ping); }
    }, 30_000);

    req.on("close", () => {
      clearInterval(ping);
      sseClients.delete(res);
      console.error(`[sse] client disconnected — ${sseClients.size} active`);
    });
  });

  // Health
  app.get("/health", (_: Request, res: Response) => res.json({
    status:     "ok",
    server:     "unifi-mcp-server",
    version:    "2.0.0",
    watcher:    "active",
    sseClients: sseClients.size,
    timestamp:  new Date().toISOString(),
  }));

  const port = parseInt(process.env.PORT ?? "3000");
  app.listen(port, () => {
    console.error(`UniFi MCP server v2 running on http://localhost:${port}`);
    console.error(`  MCP endpoint : POST /mcp`);
    console.error(`  SSE stream   : GET  /events`);
    console.error(`  Health       : GET  /health`);

    // Wire watcher events to SSE fan-out
    watcher.subscribe(fanOutSSE);
    watcher.start();
  });
}

// ── Entry ──────────────────────────────────────────────────────────────────────
const transport = process.env.TRANSPORT ?? "stdio";

if (transport === "http") {
  runHTTP().catch((err) => { console.error(err); process.exit(1); });
} else {
  runStdio().catch((err) => { console.error(err); process.exit(1); });
}
