import assert from "node:assert/strict";

const endpoint = process.env.MCP_URL ?? "http://127.0.0.1:8787/mcp";

async function rpc(id, method, params) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id,
      method,
      params,
    }),
  });

  assert.equal(response.status, 200);
  return response.json();
}

const initialize = await rpc(1, "initialize", {
  protocolVersion: "2026-01-26",
  capabilities: {},
  clientInfo: { name: "smoke", version: "0.1.0" },
});

assert.equal(initialize.result.protocolVersion, "2026-01-26");
assert.equal(initialize.result.serverInfo.name, "chatgpt-search-fetch-starter");

const tools = await rpc(2, "tools/list", {});
assert.equal(tools.result.tools.length, 2);
assert.deepEqual(
  tools.result.tools.map((tool) => tool.name),
  ["search", "fetch"]
);

const search = await rpc(3, "tools/call", {
  name: "search",
  arguments: { query: "developer mode" },
});
const searchPayload = JSON.parse(search.result.content[0].text);
assert.equal(searchPayload.results[0].id, "chatgpt-developer-mode");

const fetched = await rpc(4, "tools/call", {
  name: "fetch",
  arguments: { id: "chatgpt-developer-mode" },
});
const fetchPayload = JSON.parse(fetched.result.content[0].text);
assert.equal(fetchPayload.id, "chatgpt-developer-mode");
assert.match(fetchPayload.text, /Expose localhost over HTTPS/);

console.log("Smoke test passed");
