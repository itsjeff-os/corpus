import { describe, expect, it } from "vitest";
import { buildIntegrityChecks, passesHardGate, scoreIntegrity } from "../../src/pipeline/scoring";

describe("scoring", () => {
  it("passes the knowledge hard gate when the candidate is well-supported", () => {
    const candidate = {
      answer: "Use approved evidence only.",
      assumptions: ["Approved corpus is authoritative."],
      confidence: 91,
      gaps: [],
      proposedActions: [],
      citations: ["policy-answer-contract", "memo-reliability-review"]
    };

    const crossExamination = {
      attacks: ["What evidence supports this?"],
      weakAssumptions: [],
      demandsForEvidence: [],
      contradictions: [],
      unsupportedHighRiskClaims: []
    };

    const result = scoreIntegrity({
      requestClass: "knowledge",
      candidate,
      evidenceCoverage: 0.92,
      crossExamination
    });

    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(
      passesHardGate(
        "knowledge",
        result.score,
        0.92,
        0,
        0,
        candidate
      )
    ).toBe(true);
  });

  it("fails the decision-support hard gate when tradeoffs are missing", () => {
    const candidate = {
      answer: "Pick option A.",
      assumptions: ["Assumption A"],
      confidence: 78,
      gaps: [],
      proposedActions: [],
      citations: ["memo-decision-support"],
      revisitTriggers: ["If costs rise by 20%."]
    };

    const failureModeWalkthrough = {
      failures: [
        {
          component: "deployment",
          effect: "Could fail in production.",
          mitigation: "Roll back.",
          severity: "medium" as const
        }
      ],
      passed: true
    };

    const checks = buildIntegrityChecks({
      requestClass: "decision_support",
      candidate,
      evidenceCoverage: 0.9,
      crossExamination: {
        attacks: ["What evidence supports this?"],
        weakAssumptions: [],
        demandsForEvidence: [],
        contradictions: [],
        unsupportedHighRiskClaims: []
      },
      failureModeWalkthrough
    });

    expect(checks.find((check) => check.name === "tradeoffs_present")?.passed).toBe(false);
    expect(
      passesHardGate(
        "decision_support",
        88,
        0.9,
        0,
        0,
        candidate,
        failureModeWalkthrough
      )
    ).toBe(false);
  });
});
