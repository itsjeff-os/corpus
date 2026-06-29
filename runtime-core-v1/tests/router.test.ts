import test from "node:test";
import assert from "node:assert/strict";
import { createEmptyGraph, type ReasoningNode } from "../src/reasoning/graphCore.js";
import { deriveRuntimeDecision } from "../src/runtime/router.js";

function observation(id: string): ReasoningNode {
  return {
    id,
    type: "observation",
    content: `observation ${id}`,
    status: "active",
    support_class: "observed",
    scope: "local",
    basis: [],
    provenance: {
      source: "user",
      ref: null,
      timestamp: "2026-05-16T00:00:00Z"
    },
    metadata: {}
  };
}

test("empty graph stays in observing mode", () => {
  const decision = deriveRuntimeDecision(createEmptyGraph("test", "empty"));
  assert.equal(decision.mode, "observing");
  assert.equal(decision.strategy, "start_with_reality");
});

test("observations without conclusions move into mapping", () => {
  const graph = createEmptyGraph("test", "observed");
  graph.nodes.push(observation("O1"));

  const decision = deriveRuntimeDecision(graph);
  assert.equal(decision.mode, "mapping");
  assert.equal(decision.strategy, "derive_interpretation_before_conclusion");
  assert.deepEqual(decision.basis, ["O1"]);
});
