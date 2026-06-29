import http from "node:http";
import type { ZodSchema } from "zod";
import type { ControlService } from "../services/controlService";
import { getEnv } from "../config/env";
import {
  answerWithControlInputSchema,
  executeWriteInputSchema,
  explainIntegrityInputSchema,
  fetchInputSchema,
  prepareWriteInputSchema,
  searchInputSchema
} from "./toolSchemas";

const PROTOCOL_VERSION = "2026-01-26";
const SERVER_INFO = {
  name: "chatgpt-business-control-layer",
  version: "0.1.0"
};

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

function jsonRpcResult(id: JsonRpcRequest["id"], result: unknown) {
  return JSON.stringify({ jsonrpc: "2.0", id, result });
}

function jsonRpcError(id: JsonRpcRequest["id"], code: number, message: string, data?: unknown) {
  const payload: Record<string, unknown> = {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message
    }
  };

  if (data !== undefined) {
    (payload.error as Record<string, unknown>).data = data;
  }

  return JSON.stringify(payload);
}

function toArgs<T>(schema: ZodSchema<T>, params: Record<string, unknown> | undefined) {
  const parsed = schema.safeParse(params ?? {});
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

function withCorsHeaders(extraHeaders: Record<string, string> = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, mcp-session-id",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
    ...extraHeaders
  };
}

function textResult(value: unknown) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value)
      }
    ]
  };
}

function toolDescriptor(
  name: string,
  title: string,
  description: string,
  inputSchema: Record<string, unknown>,
  annotations: Record<string, unknown>,
  invoking: string,
  invoked: string
) {
  return {
    name,
    title,
    description,
    inputSchema,
    annotations,
    _meta: {
      "openai/toolInvocation/invoking": invoking,
      "openai/toolInvocation/invoked": invoked
    }
  };
}

const tools = [
  toolDescriptor(
    "search",
    "Search governed knowledge",
    "Use this when you need to find approved policy or knowledge documents for a governed answer.",
    {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 1,
          description: "Natural-language search query."
        }
      },
      required: ["query"],
      additionalProperties: false
    },
    { readOnlyHint: true, idempotentHint: true },
    "Searching governed knowledge…",
    "Governed search complete."
  ),
  toolDescriptor(
    "fetch",
    "Fetch governed document",
    "Use this when you need the full text for one approved document returned by search.",
    {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 1,
          description: "Approved document identifier."
        }
      },
      required: ["id"],
      additionalProperties: false
    },
    { readOnlyHint: true, idempotentHint: true },
    "Fetching governed document…",
    "Governed document ready."
  ),
  toolDescriptor(
    "answer_with_control",
    "Generate governed answer",
    "Use this when you need a non-trivial governed answer. This runs the control pipeline, integrity checks, and approval gating.",
    {
      type: "object",
      properties: {
        input: {
          type: "string",
          minLength: 1,
          description: "The user request to answer through the governed path."
        },
        mode: {
          type: "string",
          enum: ["auto", "knowledge", "decision_support"],
          description: "Request mode hint."
        },
        allow_write: {
          type: "boolean",
          description: "Allow the pipeline to move into a human-approved write path if needed."
        },
        actor_id: {
          type: "string",
          description: "Optional stable actor identifier."
        },
        thread_id: {
          type: "string",
          description: "Optional stable thread identifier."
        }
      },
      required: ["input"],
      additionalProperties: false
    },
    { readOnlyHint: true, idempotentHint: true },
    "Running governed control pipeline…",
    "Governed answer ready."
  ),
  toolDescriptor(
    "explain_integrity_report",
    "Explain integrity report",
    "Use this when you need the stored integrity report and checks for a previous governed answer run.",
    {
      type: "object",
      properties: {
        run_id: {
          type: "string",
          minLength: 1,
          description: "Run identifier returned by answer_with_control."
        }
      },
      required: ["run_id"],
      additionalProperties: false
    },
    { readOnlyHint: true, idempotentHint: true },
    "Loading integrity report…",
    "Integrity report ready."
  ),
  toolDescriptor(
    "prepare_write_action",
    "Prepare private-system write",
    "Use this when a governed run requires a human-approved private write. This prepares the action preview and returns a short-lived confirmation token.",
    {
      type: "object",
      properties: {
        run_id: {
          type: "string",
          minLength: 1,
          description: "Run identifier returned by answer_with_control."
        },
        action_type: {
          type: "string",
          minLength: 1,
          description: "The write action type. In v1 only create_internal_note is allowed."
        },
        payload: {
          type: "object",
          description: "Write payload for the private system."
        },
        justification: {
          type: "string",
          minLength: 1,
          description: "Human-readable justification for the write."
        },
        actor_id: {
          type: "string"
        },
        thread_id: {
          type: "string"
        }
      },
      required: ["run_id", "action_type", "payload", "justification"],
      additionalProperties: false
    },
    { destructiveHint: true, openWorldHint: false },
    "Preparing write approval…",
    "Write approval prepared."
  ),
  toolDescriptor(
    "execute_write_action",
    "Execute approved private write",
    "Use this when you have an approval_id and confirmation_token from prepare_write_action and want to execute the private-system write.",
    {
      type: "object",
      properties: {
        approval_id: {
          type: "string",
          minLength: 1
        },
        confirmation_token: {
          type: "string",
          minLength: 1
        },
        actor_id: {
          type: "string"
        },
        thread_id: {
          type: "string"
        }
      },
      required: ["approval_id", "confirmation_token"],
      additionalProperties: false
    },
    { destructiveHint: true, openWorldHint: false },
    "Executing approved write…",
    "Approved write complete."
  )
];

async function readBody(req: http.IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export function createMcpServer(controlService: ControlService) {
  const env = getEnv();

  return http.createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      res.end("Missing request URL");
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/") {
      res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      res.end(SERVER_INFO.name);
      return;
    }

    if (req.method === "GET" && url.pathname === "/healthz") {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: true, service: SERVER_INFO.name, version: SERVER_INFO.version }));
      return;
    }

    if (req.method === "OPTIONS" && url.pathname === env.MCP_PATH) {
      res.writeHead(204, withCorsHeaders());
      res.end();
      return;
    }

    if (url.pathname !== env.MCP_PATH) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    if (req.method !== "POST") {
      res.writeHead(405, {
        ...withCorsHeaders({ Allow: "POST, OPTIONS" }),
        "content-type": "application/json; charset=utf-8"
      });
      res.end(JSON.stringify({ error: "Method not allowed. Use POST on /mcp." }));
      return;
    }

    try {
      const rawBody = await readBody(req);
      const body = (rawBody ? JSON.parse(rawBody) : null) as JsonRpcRequest | null;

      if (!body || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
        res.writeHead(400, withCorsHeaders({ "content-type": "application/json; charset=utf-8" }));
        res.end(jsonRpcError(null, -32600, "Invalid Request"));
        return;
      }

      const { id, method, params } = body;

      if (id === undefined || id === null) {
        res.writeHead(204, withCorsHeaders());
        res.end();
        return;
      }

      if (method === "initialize") {
        res.writeHead(200, {
          ...withCorsHeaders(),
          "content-type": "application/json; charset=utf-8"
        });
        res.end(
          jsonRpcResult(id, {
            protocolVersion: PROTOCOL_VERSION,
            serverInfo: SERVER_INFO,
            capabilities: {
              tools: {}
            },
            instructions:
              "This server is the governed answer path for ChatGPT Business. Use answer_with_control for all non-trivial work."
          })
        );
        return;
      }

      if (method === "notifications/initialized") {
        res.writeHead(204, withCorsHeaders());
        res.end();
        return;
      }

      if (method === "tools/list") {
        res.writeHead(200, {
          ...withCorsHeaders(),
          "content-type": "application/json; charset=utf-8"
        });
        res.end(jsonRpcResult(id, { tools }));
        return;
      }

      if (method === "tools/call") {
        const name = String(params?.name ?? "");
        const argumentsObject = (params?.arguments as Record<string, unknown> | undefined) ?? {};
        const result = await handleToolCall(controlService, name, argumentsObject);

        res.writeHead(200, {
          ...withCorsHeaders(),
          "content-type": "application/json; charset=utf-8"
        });
        res.end(jsonRpcResult(id, result));
        return;
      }

      res.writeHead(200, {
        ...withCorsHeaders(),
        "content-type": "application/json; charset=utf-8"
      });
      res.end(jsonRpcError(id, -32601, `Method not found: ${method}`));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.writeHead(500, {
        ...withCorsHeaders(),
        "content-type": "application/json; charset=utf-8"
      });
      res.end(jsonRpcError(null, -32603, "Internal error", { message }));
    }
  });
}

async function handleToolCall(
  controlService: ControlService,
  name: string,
  args: Record<string, unknown>
) {
  if (name === "search") {
    const parsed = toArgs(searchInputSchema, args);
    return textResult({ results: controlService.search(parsed.query) });
  }

  if (name === "fetch") {
    const parsed = toArgs(fetchInputSchema, args);
    const document = controlService.fetch(parsed.id);
    return textResult(
      document ?? {
        id: parsed.id,
        title: "Not found",
        text: "",
        url: "",
        metadata: {
          error: "not_found"
        }
      }
    );
  }

  if (name === "answer_with_control") {
    const parsed = toArgs(answerWithControlInputSchema, args);
    const answer = await controlService.answerWithControl(parsed.input, parsed.mode, parsed.allow_write, {
      actorId: parsed.actor_id,
      threadId: parsed.thread_id
    });
    return textResult(answer);
  }

  if (name === "explain_integrity_report") {
    const parsed = toArgs(explainIntegrityInputSchema, args);
    const report = await controlService.explainIntegrityReport(parsed.run_id);
    return textResult(report);
  }

  if (name === "prepare_write_action") {
    const parsed = toArgs(prepareWriteInputSchema, args);
    const approval = await controlService.prepareWriteAction(
      parsed.run_id,
      parsed.action_type,
      parsed.payload,
      parsed.justification,
      {
        actorId: parsed.actor_id,
        threadId: parsed.thread_id
      }
    );
    return textResult(approval);
  }

  if (name === "execute_write_action") {
    const parsed = toArgs(executeWriteInputSchema, args);
    const receipt = await controlService.executeWriteAction(parsed.approval_id, parsed.confirmation_token, {
      actorId: parsed.actor_id,
      threadId: parsed.thread_id
    });
    return textResult(receipt);
  }

  throw new Error(`Unknown tool: ${name}`);
}
