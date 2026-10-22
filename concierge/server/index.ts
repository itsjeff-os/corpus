import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import WebSocket, { WebSocketServer } from "ws";
import { CONCIERGE_INSTRUCTIONS } from "./prompt.js";

dotenv.config({ path: ".env.local", override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT ?? 8787);
const model = process.env.REALTIME_MODEL ?? "gpt-realtime-2.1";
const voice = process.env.REALTIME_VOICE ?? "marin";
const transcriptionModel = process.env.TRANSCRIPTION_MODEL ?? "gpt-live-transcribe";

const app = express();
app.disable("x-powered-by");

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    gateway: process.env.CLOUDFLARE_AI_GATEWAY_ID ?? "api-gateway",
    model,
    configured: Boolean(
      process.env.CLOUDFLARE_ACCOUNT_ID &&
        process.env.CLOUDFLARE_AI_GATEWAY_TOKEN,
    ),
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(root, "dist")));
  app.get("/{*path}", (_request, response) => {
    response.sendFile(path.join(root, "dist", "index.html"));
  });
}

const server = createServer(app);
const browserSockets = new WebSocketServer({ noServer: true, maxPayload: 512 * 1024 });

function relayEvent(socket: WebSocket, event: unknown) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(event));
  }
}

function bearer(value: string) {
  return value.toLowerCase().startsWith("bearer ") ? value : `Bearer ${value}`;
}

function openGatewaySocket() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const gatewayId = process.env.CLOUDFLARE_AI_GATEWAY_ID ?? "api-gateway";
  const gatewayToken = process.env.CLOUDFLARE_AI_GATEWAY_TOKEN;
  const providerKey = process.env.OPENAI_API_KEY;

  if (!accountId || !gatewayToken) {
    throw new Error(
      "Cloudflare AI Gateway is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_AI_GATEWAY_TOKEN.",
    );
  }

  const url = new URL(
    `wss://gateway.ai.cloudflare.com/v1/${encodeURIComponent(accountId)}/${encodeURIComponent(gatewayId)}/openai`,
  );
  url.searchParams.set("model", model);

  const headers: Record<string, string> = {
    "cf-aig-authorization": bearer(gatewayToken),
    "cf-aig-collect-log-payload": "false",
    "OpenAI-Beta": "realtime=v1",
  };

  // Cloudflare BYOK can supply the provider credential. If it is not configured,
  // the normal OpenAI key remains server-only and is forwarded upstream here.
  if (providerKey) {
    headers.Authorization = bearer(providerKey);
  }

  return new WebSocket(url, { headers, handshakeTimeout: 10_000 });
}

const allowedBrowserEvents = new Set([
  "input_audio_buffer.append",
  "input_audio_buffer.clear",
  "response.cancel",
]);

browserSockets.on("connection", (browser) => {
  let upstream: WebSocket;

  relayEvent(browser, { type: "concierge.upstream.connecting", model });

  try {
    upstream = openGatewaySocket();
  } catch (error) {
    relayEvent(browser, {
      type: "concierge.relay.error",
      message: error instanceof Error ? error.message : "Gateway configuration failed.",
      recoverable: false,
    });
    browser.close(1011, "Gateway configuration failed");
    return;
  }

  upstream.on("open", () => {
    relayEvent(browser, { type: "concierge.upstream.open", model });
    upstream.send(
      JSON.stringify({
        type: "session.update",
        session: {
          type: "realtime",
          model,
          instructions: CONCIERGE_INSTRUCTIONS,
          output_modalities: ["audio"],
          max_output_tokens: 1400,
          audio: {
            input: {
              format: { type: "audio/pcm", rate: 24000 },
              transcription: {
                model: transcriptionModel,
                delay: "low",
                prompt: "A live creative strategy and worldbuilding session. Expect invented names, systems language, and playful metaphors.",
              },
              turn_detection: {
                type: "semantic_vad",
                eagerness: "auto",
                create_response: true,
                interrupt_response: true,
              },
            },
            output: {
              format: { type: "audio/pcm", rate: 24000 },
              voice,
            },
          },
        },
      }),
    );
  });

  upstream.on("message", (data, isBinary) => {
    if (browser.readyState === WebSocket.OPEN) {
      browser.send(data, { binary: isBinary });
    }
  });

  upstream.on("error", (error) => {
    console.error("Realtime gateway error:", error.message);
    relayEvent(browser, {
      type: "concierge.relay.error",
      message: "The gateway connection failed. Check the relay logs and credentials.",
      recoverable: true,
    });
  });

  upstream.on("close", (code, reason) => {
    relayEvent(browser, {
      type: "concierge.upstream.closed",
      code,
      reason: reason.toString(),
    });
    if (browser.readyState === WebSocket.OPEN) browser.close(1012, "Upstream closed");
  });

  browser.on("message", (data, isBinary) => {
    if (isBinary || upstream.readyState !== WebSocket.OPEN) return;

    try {
      const event = JSON.parse(data.toString()) as { type?: string; audio?: unknown };
      if (!event.type || !allowedBrowserEvents.has(event.type)) return;
      if (event.type === "input_audio_buffer.append" && typeof event.audio !== "string") return;
      upstream.send(JSON.stringify(event));
    } catch {
      relayEvent(browser, {
        type: "concierge.relay.error",
        message: "The relay rejected a malformed client event.",
        recoverable: true,
      });
    }
  });

  browser.on("close", () => {
    if (upstream.readyState === WebSocket.OPEN || upstream.readyState === WebSocket.CONNECTING) {
      upstream.close(1000, "Browser session ended");
    }
  });
});

server.on("upgrade", (request, socket, head) => {
  if (request.url !== "/api/realtime") {
    socket.destroy();
    return;
  }

  browserSockets.handleUpgrade(request, socket, head, (webSocket) => {
    browserSockets.emit("connection", webSocket, request);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Concierge relay listening on http://127.0.0.1:${port}`);
  console.log(`Realtime route: Cloudflare AI Gateway / ${model}`);
});
