import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import { createMcpServer } from "../../src/mcp/server";
import { ControlService } from "../../src/services/controlService";
import { MemoryControlStore } from "../../src/stores/memoryControlStore";
import { SequenceModelClient } from "../helpers/sequenceModelClient";

describe("MCP server", () => {
  let server: ReturnType<typeof createMcpServer>;
  let baseUrl = "";

  beforeAll(async () => {
    const model = new SequenceModelClient([
      {
        answer: "Approved answers must cite approved sources.",
        assumptions: ["Approved sources were retrieved."],
        confidence: 90,
        gaps: [],
        proposedActions: [],
        citations: ["policy-answer-contract", "memo-reliability-review"]
      },
      {
        assumptions: [
          {
            assumption: "Approved sources were retrieved.",
            evidence: "Policy documents were loaded.",
            supported: true
          }
        ],
        coverageRatio: 0.9
      },
      {
        attacks: ["What evidence supports the answer?", "What remains unknown?", "What would falsify it?"],
        weakAssumptions: [],
        demandsForEvidence: [],
        contradictions: [],
        unsupportedHighRiskClaims: []
      }
    ]);

    const store = new MemoryControlStore();
    await store.initialize();
    const service = new ControlService(model, store);
    server = createMcpServer(service);

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => resolve());
    });

    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}/mcp`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("supports initialize and tools/list", async () => {
    const initialize = await rpcCall(baseUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2026-01-26",
        capabilities: {},
        clientInfo: {
          name: "vitest",
          version: "0.1.0"
        }
      }
    });

    expect(initialize.result.serverInfo.name).toBe("chatgpt-business-control-layer");

    const tools = await rpcCall(baseUrl, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    });

    expect(tools.result.tools.map((tool: { name: string }) => tool.name)).toEqual(
      expect.arrayContaining(["search", "fetch", "answer_with_control"])
    );
  });

  it("supports search, fetch, and answer_with_control", async () => {
    const search = await rpcCall(baseUrl, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "search",
        arguments: {
          query: "approval policy"
        }
      }
    });

    const searchPayload = JSON.parse(search.result.content[0].text);
    expect(searchPayload.results.length).toBeGreaterThan(0);

    const firstId = searchPayload.results[0].id;

    const fetch = await rpcCall(baseUrl, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "fetch",
        arguments: {
          id: firstId
        }
      }
    });

    const fetchPayload = JSON.parse(fetch.result.content[0].text);
    expect(fetchPayload.id).toBe(firstId);

    const answer = await rpcCall(baseUrl, {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "answer_with_control",
        arguments: {
          input: "What makes a governed answer reliable?",
          mode: "knowledge",
          allow_write: false,
          actor_id: "integration-user",
          thread_id: "integration-thread"
        }
      }
    });

    const answerPayload = JSON.parse(answer.result.content[0].text);
    expect(answerPayload.status).toBe("approved");
    expect(answerPayload.integrity.score).toBeGreaterThanOrEqual(85);
  });
});

async function rpcCall(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  expect(response.ok).toBe(true);
  return response.json() as Promise<Record<string, any>>;
}
