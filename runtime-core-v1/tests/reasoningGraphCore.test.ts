import test from "node:test";
import assert from "node:assert/strict";
import {
  createEmptyGraph,
  markInvalidatedAndChallengeDownstream,
  supersedeNode,
  type ReasoningGraphCore,
  type ReasoningNode,
  validateReasoningGraphCore
} from "../src/reasoning/graphCore.js";

function node(id: string, type: ReasoningNode["type"], basis: string[] = []): ReasoningNode {
  return {
    id,
    type,
    content: `${type} ${id}`,
    status: "active",
    support_class: type === "observation" ? "observed" : type === "interpretation" ? "interpretive" : "derived",
    scope: "local",
    basis,
    provenance: {
      source: type === "observation" ? "user" : "derived",
      ref: null,
      timestamp: "2026-05-16T00:00:00Z"
    },
    metadata: {}
  };
}

function validGraph(): ReasoningGraphCore {
  const graph = createEmptyGraph("test", "valid");
  graph.nodes = [
    node("O1", "observation"),
    node("I1", "interpretation", ["O1"]),
    node("N1", "inference", ["I1"]),
    node("C1", "conclusion", ["O1", "N1"])
  ];
  graph.edges = [
    { id: "E1", from: "O1", to: "I1", type: "supports", active: true },
    { id: "E2", from: "I1", to: "N1", type: "depends_on", active: true },
    { id: "E3", from: "N1", to: "C1", type: "depends_on", active: true },
    { id: "E4", from: "O1", to: "C1", type: "supports", active: true }
  ];
  return graph;
}

test("accepts a valid Reasoning Graph Core v1.1 path", () => {
  const result = validateReasoningGraphCore(validGraph());
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("blocks direct interpretation to conclusion", () => {
  const graph = validGraph();
  graph.edges.push({ id: "E5", from: "I1", to: "C1", type: "supports", active: true });

  const result = validateReasoningGraphCore(graph);
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "illegal_edge_pattern"), true);
});

test("blocks conclusion backflow", () => {
  const graph = validGraph();
  graph.edges.push({ id: "E5", from: "C1", to: "N1", type: "depends_on", active: true });

  const result = validateReasoningGraphCore(graph);
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "illegal_edge_pattern"), true);
});

test("blocks self loops", () => {
  const graph = validGraph();
  graph.edges.push({ id: "E5", from: "C1", to: "C1", type: "supports", active: true });

  const result = validateReasoningGraphCore(graph);
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "self_loop"), true);
});

test("requires basis ids to exist", () => {
  const graph = validGraph();
  graph.nodes.push(node("C2", "conclusion", ["missing"]));

  const result = validateReasoningGraphCore(graph);
  assert.equal(result.ok, false);
  assert.equal(result.errors.some((error) => error.code === "missing_basis"), true);
});

test("challenges downstream nodes when upstream support is invalidated", () => {
  const graph = markInvalidatedAndChallengeDownstream(validGraph(), "I1");
  const byId = new Map(graph.nodes.map((item) => [item.id, item]));

  assert.equal(byId.get("I1")?.status, "invalidated");
  assert.equal(byId.get("N1")?.status, "challenged");
  assert.equal(byId.get("C1")?.status, "challenged");
});

test("supersession is explicit rather than overwriting the old node", () => {
  const graph = validGraph();
  const replacement = {
    ...node("C2", "conclusion", ["O1", "N1"]),
    content: "replacement conclusion"
  };

  const next = supersedeNode(graph, "C1", replacement);
  const byId = new Map(next.nodes.map((item) => [item.id, item]));

  assert.equal(byId.get("C1")?.status, "superseded");
  assert.equal(byId.get("C1")?.metadata.superseded_by, "C2");
  assert.equal(byId.get("C2")?.content, "replacement conclusion");
});
