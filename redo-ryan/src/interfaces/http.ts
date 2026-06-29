import http from "http";
import { env, envStatus } from "../config/env";
import { RyanCore } from "../ryan/core";

function readJson(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy(new Error("request body too large"));
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}

function sendJson(res: http.ServerResponse, status: number, payload: unknown) {
  const body = JSON.stringify(payload);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(body) });
  res.end(body);
}

export function createServer(ryan = new RyanCore()) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
    try {
      if (req.method === "GET" && url.pathname === "/health") {
        return sendJson(res, 200, {
          ok: true,
          service: "redo-ryan",
          zepConfigured: envStatus().zepConfigured,
          defaultThreadId: env.ryanThreadId,
        });
      }
      if (req.method === "POST" && url.pathname === "/chat") {
        const body = await readJson(req);
        const input = body as { message?: unknown; userId?: unknown; threadId?: unknown };
        if (typeof input.message !== "string" || !input.message.trim()) {
          return sendJson(res, 400, { error: "message is required" });
        }
        const result = await ryan.reply({
          message: input.message,
          userId: typeof input.userId === "string" ? input.userId : undefined,
          threadId: typeof input.threadId === "string" ? input.threadId : undefined,
        });
        return sendJson(res, 200, result);
      }
      return sendJson(res, 404, { error: "not found" });
    } catch (error) {
      return sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
    }
  });
}

export function startHttpServer() {
  const server = createServer();
  server.listen(env.port, "127.0.0.1", () => {
    console.log(`Redo Ryan HTTP listening on http://127.0.0.1:${env.port}`);
  });
  return server;
}
