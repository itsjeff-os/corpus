import assert from "node:assert/strict";
import test from "node:test";
import { createPassThroughGate, runGates, type Gate } from "../src/runtime/gates.js";

test("gate scaffold allows a slot when no policy is attached", () => {
  const result = runGates({
    slot: "state_claim",
    candidate: { text: "candidate claim" },
    scope: { project_id: "runtime-core" },
    evidence: [{ type: "file", reference: "README.md" }]
  }, [createPassThroughGate("state_claim_scaffold", "state_claim")]);

  assert.equal(result.ok, true);
  assert.equal(result.decisions[0].outcome, "allow");
});

test("gate runner blocks when an attached policy blocks", () => {
  const gate: Gate = {
    id: "example_policy",
    slot: "handoff",
    evaluate(input) {
      return {
        gate_id: "example_policy",
        slot: input.slot,
        outcome: "block",
        reason: "Example policy blocked this candidate.",
        receipts: input.evidence
      };
    }
  };

  const result = runGates({
    slot: "handoff",
    candidate: { text: "candidate handoff" },
    scope: { interaction_id: "thread_1" }
  }, [gate]);

  assert.equal(result.ok, false);
  assert.equal(result.blocked.length, 1);
});

test("gate runner sends review outcomes to review queue", () => {
  const gate: Gate = {
    id: "example_review_policy",
    slot: "authority",
    evaluate(input) {
      return {
        gate_id: "example_review_policy",
        slot: input.slot,
        outcome: "review",
        reason: "Example policy requires review.",
        receipts: input.evidence
      };
    }
  };

  const result = runGates({
    slot: "authority",
    candidate: { text: "candidate authority move" },
    scope: { domain: "home" }
  }, [gate]);

  assert.equal(result.ok, false);
  assert.equal(result.review.length, 1);
});

test("gate context can vary by project, user, domain, and interaction", () => {
  const seen: unknown[] = [];
  const gate: Gate = {
    id: "scope_capture",
    slot: "domain_policy",
    evaluate(input) {
      seen.push(input.scope);
      return {
        gate_id: "scope_capture",
        slot: input.slot,
        outcome: "allow",
        reason: "Captured scope.",
        receipts: []
      };
    }
  };

  const result = runGates({
    slot: "domain_policy",
    candidate: { text: "candidate domain action" },
    scope: {
      project_id: "runtime-core",
      user_id: "user_a",
      interaction_id: "thread_a",
      domain: "home_assistant"
    }
  }, [gate]);

  assert.equal(result.ok, true);
  assert.deepEqual(seen[0], {
    project_id: "runtime-core",
    user_id: "user_a",
    interaction_id: "thread_a",
    domain: "home_assistant"
  });
});
