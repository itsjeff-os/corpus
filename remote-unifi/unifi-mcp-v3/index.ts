import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express, { Request, Response } from "express";
import { createClient } from "./services/unifi.js";
import { registerReadTools } from "./tools/read.js";
import { registerActionTools } from "./tools/actions.js";
import { UniFiWatcher } from "./watcher.js";

// ── Shared UniFi client ────────────────────────────────────────────────────────
const client = createClient();

// ── Session registry ───────────────────────────────────────────────────────────
// Each GET /sse creates a session. The transport holds the open SSE connection.
// POST /messages routes back to the right session by ID.
const transports: Record<string, SSEServerTransport> = {};

// ── Server factory ─────────────────────────────────────────────────────────────
// A fresh McpServer per session — required by the SSE transport model.
// Tools and watcher are wired into each instance independently.
function createServer(): McpServer {
  const server = new McpServer(
    { name: "unifi-mcp-server", version: "3.0.0" },
    { capabilities: { logging: {} } }
  );
  registerReadTools(server, client);
  registerActionTools(server, client);
  return server;
}

// ── Watcher ────────────────────────────────────────────────────────────────────
// Single watcher instance, shared across all sessions.
// On each event it fans out a logging notification to every connected session.
const watcherServer = createServer(); // used only for watcher's sendLoggingMessage
const watcher = new UniFiWatcher(watcherServer, client, {
  intervalMs:        parseInt(process.env.WATCHER_INTERVAL_MS  ?? "15000"),
  wanPacketLossWarn: parseFloat(process.env.WAN_PACKET_LOSS_WARN ?? "2"),
  wanPacketLossCrit: parseFloat(process.env.WAN_PACKET_LOSS_CRIT ?? "10"),
  wanLatencyWarnMs:  parseInt(process.env.WAN_LATENCY_WARN_MS  ?? "80"),
  wanLatencyCritMs:  parseInt(process.env.WAN_LATENCY_CRIT_MS  ?? "200"),
});

// Fan watcher events out to every active SSE session as MCP log notifications
watcher.subscribe(async (event) => {
  const level =
    event.severity === "critical" ? "error" :
    event.severity === "warning"  ? "warning" : "info";

  const payload = {
    source:    "unifi-watcher",
    event_id:  event.id,
    category:  event.category,
    title:     event.title,
    detail:    event.detail,
    timestamp: event.timestamp,
  };

  // Push to all open sessions
  for (const [sessionId, transport] of Object.entries(transports)) {
    try {
      // SSEServerTransport streams directly — sendLoggingMessage pushes down the open pipe
      // We need a server instance connected to this transport to send on it.
      // Sessions store their server ref alongside the transport.
      const srv = sessionServers[sessionId];
      if (srv) {
        await srv.sendLoggingMessage({ level, data: payload }, sessionId);
      }
    } catch {
      // Session may have just closed — fine, remove it
      delete transports[sessionId];
      delete sessionServers[sessionId];
    }
  }
});

// ── Session server registry ────────────────────────────────────────────────────
// Maps sessionId → McpServer so the watcher fan-out can call sendLoggingMessage
// on the right server instance.
const sessionServers: Record<string, McpServer> = {};

// ── Transport: stdio ───────────────────────────────────────────────────────────
async function runStdio() {
  const transport = new StdioServerTransport();
  const server = createServer();
  await server.connect(transport);
  watcher.start();
  console.error("UniFi MCP server v3 running on stdio (watcher active)");
}

// ── Transport: SSE (always-on) ─────────────────────────────────────────────────
async function runSSE() {
  const app = express();
  app.use(express.json());

  // ── GET /sse — client opens a persistent SSE connection ─────────────────────
  // This is the always-on channel. MCP protocol messages flow back down it.
  app.get("/sse", async (req: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    const sessionId = transport.sessionId;
    const server = createServer();

    transports[sessionId] = transport;
    sessionServers[sessionId] = server;

    transport.onclose = () => {
      console.error(`[sse] session closed: ${sessionId}`);
      delete transports[sessionId];
      delete sessionServers[sessionId];
    };

    await server.connect(transport);
    console.error(`[sse] session opened: ${sessionId} — ${Object.keys(transports).length} active`);
  });

  // ── POST /messages — client sends JSON-RPC tool calls here ──────────────────
  // The SSE transport model: server pushes down /sse, client posts up to /messages.
  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;

    if (!sessionId) {
      res.status(400).json({ error: "missing sessionId query param" });
      return;
    }

    const transport = transports[sessionId];
    if (!transport) {
      res.status(404).json({ error: `no active session: ${sessionId}` });
      return;
    }

    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (err) {
      console.error("[messages] error:", err);
      if (!res.headersSent) res.status(500).json({ error: "internal error" });
    }
  });

  // ── Health ───────────────────────────────────────────────────────────────────
  app.get("/health", (_: Request, res: Response) => res.json({
    status:       "ok",
    server:       "unifi-mcp-server",
    version:      "3.0.0",
    transport:    "sse",
    activeSessions: Object.keys(transports).length,
    watcher:      "active",
    timestamp:    new Date().toISOString(),
  }));

  const port = parseInt(process.env.PORT ?? "3000");
  app.listen(port, () => {
    console.error(`UniFi MCP server v3 — always-on SSE`);
    console.error(`  SSE stream  : GET  http://localhost:${port}/sse`);
    console.error(`  MCP calls   : POST http://localhost:${port}/messages?sessionId=<id>`);
    console.error(`  Health      : GET  http://localhost:${port}/health`);
    watcher.start();
  });

  // ── Graceful shutdown ────────────────────────────────────────────────────────
  process.on("SIGINT", async () => {
    console.error("[shutdown] closing all sessions...");
    watcher.stop();
    for (const [id, transport] of Object.entries(transports)) {
      try { await transport.close(); } catch {}
      delete transports[id];
      delete sessionServers[id];
    }
    process.exit(0);
  });
}

// ── Entry ──────────────────────────────────────────────────────────────────────
const mode = process.env.TRANSPORT ?? "sse"; // default is now SSE, not stdio

if (mode === "stdio") {
  runStdio().catch((err) => { console.error(err); process.exit(1); });
} else {
  runSSE().catch((err) => { console.error(err); process.exit(1); });
}
