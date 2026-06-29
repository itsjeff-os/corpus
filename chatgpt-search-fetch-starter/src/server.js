import http from "node:http";
import { readFileSync } from "node:fs";

const PORT = Number.parseInt(process.env.PORT ?? "8787", 10);
const HOST = process.env.HOST ?? "127.0.0.1";
const MCP_PATH = "/mcp";
const PROTOCOL_VERSION = "2026-01-26";
const SERVER_INFO = { name: "chatgpt-search-fetch-starter", version: "0.1.0" };

const corpus = JSON.parse(
  readFileSync(new URL("../data/corpus.json", import.meta.url), "utf8")
);

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(query) {
  return normalizeText(query)
    .split(/\s+/)
    .filter(Boolean);
}

function toArgs(params) {
  if (typeof params === "string") {
    return { query: params };
  }

  return params && typeof params === "object" ? params : {};
}

function scoreDocument(document, tokens) {
  if (tokens.length === 0) {
    return 0;
  }

  const title = normalizeText(document.title);
  const text = normalizeText(document.text);
  const url = normalizeText(document.url);
  const tags = normalizeText((document.metadata?.tags ?? []).join(" "));

  let score = 0;
  const haystack = `${title} ${text} ${url} ${tags}`;

  for (const token of tokens) {
    if (title.includes(token)) {
      score += 8;
    }
    if (tags.includes(token)) {
      score += 6;
    }
    if (text.includes(token)) {
      score += 3;
    }
    if (haystack.startsWith(token)) {
      score += 2;
    }
  }

  const phrase = tokens.join(" ");
  if (phrase && title.includes(phrase)) {
    score += 20;
  }

  return score;
}

function searchCorpus(query) {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return [];
  }

  return corpus
    .map((document) => ({
      document,
      score: scoreDocument(document, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.document.title.localeCompare(right.document.title);
    })
    .slice(0, 5)
    .map(({ document }) => ({
      id: document.id,
      title: document.title,
      url: document.url,
    }));
}

function fetchDocument(id) {
  const document = corpus.find((entry) => entry.id === id);
  if (!document) {
    return {
      id,
      title: "Not found",
      text: "",
      url: "",
      metadata: {
        error: "not_found",
      },
    };
  }

  return {
    id: document.id,
    title: document.title,
    text: document.text,
    url: document.url,
    metadata: {
      ...(document.metadata ?? {}),
      source: document.metadata?.source ?? "local-corpus",
    },
  };
}

function jsonRpcResult(id, result) {
  return JSON.stringify({ jsonrpc: "2.0", id, result });
}

function jsonRpcError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) {
    error.data = data;
  }

  return JSON.stringify({ jsonrpc: "2.0", id, error });
}

function toolDescriptor(tool) {
  return {
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: tool.inputSchema,
    annotations: tool.annotations,
    _meta: {
      "openai/toolInvocation/invoking": tool.invoking,
      "openai/toolInvocation/invoked": tool.invoked,
    },
  };
}

const TOOLS = [
  {
    name: "search",
    title: "Search knowledge",
    description:
      "Use this when you need to find matching documents in the local knowledge corpus.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 1,
          description: "Natural-language search query.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
    invoking: "Searching…",
    invoked: "Results ready.",
  },
  {
    name: "fetch",
    title: "Fetch document",
    description:
      "Use this when you need the full text for one result returned by search.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 1,
          description: "Unique document identifier.",
        },
      },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, idempotentHint: true },
    invoking: "Fetching…",
    invoked: "Document ready.",
  },
];

function handleToolsCall(params) {
  const toolName = params?.name;
  const args = toArgs(params?.arguments);

  if (toolName === "search") {
    const query = String(args.query ?? "").trim();
    if (!query) {
      return {
        content: [{ type: "text", text: JSON.stringify({ results: [] }) }],
      };
    }

    const results = searchCorpus(query);
    return {
      content: [{ type: "text", text: JSON.stringify({ results }) }],
    };
  }

  if (toolName === "fetch") {
    const id = String(args.id ?? "").trim();
    return {
      content: [{ type: "text", text: JSON.stringify(fetchDocument(id)) }],
    };
  }

  return {
    error: {
      code: -32601,
      message: `Unknown tool: ${toolName}`,
    },
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function withCorsHeaders(extraHeaders = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, mcp-session-id",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
    ...extraHeaders,
  };
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("Missing request URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end("chatgpt-search-fetch-starter");
    return;
  }

  if (req.method === "GET" && url.pathname === "/healthz") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, service: SERVER_INFO.name }));
    return;
  }

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, withCorsHeaders());
    res.end();
    return;
  }

  if (url.pathname !== MCP_PATH) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, {
      ...withCorsHeaders({ Allow: "POST, OPTIONS" }),
      "content-type": "application/json; charset=utf-8",
    });
    res.end(
      JSON.stringify({
        error: "Method not allowed. Use POST on /mcp.",
      })
    );
    return;
  }

  try {
    const rawBody = await readBody(req);
    const body = rawBody ? JSON.parse(rawBody) : null;

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
        "content-type": "application/json; charset=utf-8",
      });
      res.end(
        jsonRpcResult(id, {
          protocolVersion: PROTOCOL_VERSION,
          serverInfo: SERVER_INFO,
          capabilities: {
            tools: {},
          },
          instructions:
            "This server exposes read-only search and fetch tools over a local sample corpus.",
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
        "content-type": "application/json; charset=utf-8",
      });
      res.end(
        jsonRpcResult(id, {
          tools: TOOLS.map(toolDescriptor),
        })
      );
      return;
    }

    if (method === "tools/call") {
      const result = handleToolsCall(params);
      if (result.error) {
        res.writeHead(200, {
          ...withCorsHeaders(),
          "content-type": "application/json; charset=utf-8",
        });
        res.end(jsonRpcError(id, result.error.code, result.error.message));
        return;
      }

      res.writeHead(200, {
        ...withCorsHeaders(),
        "content-type": "application/json; charset=utf-8",
      });
      res.end(jsonRpcResult(id, result));
      return;
    }

    res.writeHead(200, {
      ...withCorsHeaders(),
      "content-type": "application/json; charset=utf-8",
    });
    res.end(jsonRpcError(id, -32601, `Method not found: ${method}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.writeHead(500, {
      ...withCorsHeaders(),
      "content-type": "application/json; charset=utf-8",
    });
    res.end(jsonRpcError(null, -32603, "Internal error", { message }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
  console.log(`MCP endpoint: http://${HOST}:${PORT}${MCP_PATH}`);
});
