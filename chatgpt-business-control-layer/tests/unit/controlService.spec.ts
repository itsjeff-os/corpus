import { describe, expect, it } from "vitest";
import { ControlService } from "../../src/services/controlService";
import { MemoryControlStore } from "../../src/stores/memoryControlStore";
import { SequenceModelClient } from "../helpers/sequenceModelClient";

describe("ControlService", () => {
  it("approves a well-supported knowledge answer and stores its report", async () => {
    const model = new SequenceModelClient([
      {
        answer: "Approved answers must cite approved sources and expose any remaining gaps.",
        assumptions: ["The approved corpus is authoritative for this request."],
        confidence: 93,
        gaps: [],
        proposedActions: [],
        citations: ["policy-answer-contract", "memo-reliability-review"],
        clarificationQuestion: null
      },
      {
        assumptions: [
          {
            assumption: "The approved corpus is authoritative for this request.",
            evidence: "Policy corpus was retrieved.",
            supported: true
          }
        ],
        coverageRatio: 0.95
      },
      {
        attacks: ["What evidence supports the answer?", "What remains unknown?", "What would falsify this?"],
        weakAssumptions: [],
        demandsForEvidence: [],
        contradictions: [],
        unsupportedHighRiskClaims: []
      }
    ]);

    const store = new MemoryControlStore();
    await store.initialize();
    const service = new ControlService(model, store);

    const answer = await service.answerWithControl("What makes a governed answer reliable?", "knowledge", false, {
      actorId: "user-1",
      threadId: "thread-1"
    });

    expect(answer.status).toBe("approved");
    expect(answer.sources.length).toBeGreaterThan(0);
    expect(answer.integrity.score).toBeGreaterThanOrEqual(85);

    const report = await service.explainIntegrityReport(answer.runId);
    expect(report.report.requestClass).toBe("knowledge");
    expect(report.answer.runId).toBe(answer.runId);
  });

  it("returns needs_clarification when both attempts fail and a clarification question is present", async () => {
    const model = new SequenceModelClient([
      {
        answer: "I think this might be fine.",
        assumptions: [],
        confidence: 40,
        gaps: ["No approved evidence matched the request."],
        proposedActions: [],
        citations: [],
        clarificationQuestion: "Which approved source should govern this answer?"
      },
      {
        assumptions: [
          {
            assumption: "A matching approved source exists.",
            invalidation: "No approved source was retrieved.",
            supported: false
          }
        ],
        coverageRatio: 0.3
      },
      {
        attacks: ["What evidence supports this?", "What is missing?", "Why is confidence low?"],
        weakAssumptions: ["A matching approved source exists."],
        demandsForEvidence: ["Need an approved source."],
        contradictions: ["The answer implies support that was not retrieved."],
        unsupportedHighRiskClaims: []
      },
      {
        answer: "I still cannot answer this reliably.",
        assumptions: [],
        confidence: 35,
        gaps: ["Still no approved evidence matched the request."],
        proposedActions: [],
        citations: [],
        clarificationQuestion: "Can you provide the approved document or policy name?"
      },
      {
        assumptions: [
          {
            assumption: "The request maps to the available corpus.",
            invalidation: "The corpus does not contain the needed topic.",
            supported: false
          }
        ],
        coverageRatio: 0.2
      },
      {
        attacks: ["What evidence supports this?", "What is missing?", "What should the user clarify?"],
        weakAssumptions: ["The request maps to the available corpus."],
        demandsForEvidence: ["Need a specific approved source."],
        contradictions: ["No evidence supports a direct answer."],
        unsupportedHighRiskClaims: []
      }
    ]);

    const store = new MemoryControlStore();
    await store.initialize();
    const service = new ControlService(model, store);

    const answer = await service.answerWithControl("Answer a topic not in the corpus.", "knowledge", false, {
      actorId: "user-2",
      threadId: "thread-2"
    });

    expect(answer.status).toBe("needs_clarification");
    expect(answer.clarificationQuestion).toMatch(/approved/i);
  });

  it("supports the write approval flow with idempotent execution", async () => {
    const model = new SequenceModelClient([
      {
        answer: "This should be recorded as an internal note after approval.",
        assumptions: ["The user wants a private internal note."],
        confidence: 88,
        gaps: [],
        proposedActions: ["Prepare an internal note write."],
        citations: ["policy-write-approvals", "policy-answer-contract"],
        tradeoffs: ["Recording the note improves traceability but requires approval."],
        revisitTriggers: ["Revisit if the note content changes materially."],
        writeIntent: {
          actionType: "create_internal_note",
          payload: {
            title: "Outage summary",
            body: "Create an internal note about the outage."
          },
          rationale: "The user explicitly requested an internal record."
        }
      },
      {
        assumptions: [
          {
            assumption: "The user wants a private internal note.",
            evidence: "The request asked to create an internal note.",
            supported: true
          }
        ],
        coverageRatio: 0.9
      },
      {
        attacks: ["What evidence supports this write?", "What are the risks?", "Is approval required?"],
        weakAssumptions: [],
        demandsForEvidence: [],
        contradictions: [],
        unsupportedHighRiskClaims: []
      },
      {
        failures: [
          {
            component: "approval",
            effect: "The write could occur without a clear human checkpoint.",
            mitigation: "Require a confirmation token and approval step.",
            severity: "medium"
          }
        ],
        passed: true
      },
      {
        inversion: "Do not write automatically; require approval first.",
        advantages: ["Prevents accidental writes."],
        risks: ["Adds one extra step."],
        insights: ["Approval is the correct v1 safeguard."]
      }
    ]);

    const store = new MemoryControlStore();
    await store.initialize();
    const service = new ControlService(model, store);

    const answer = await service.answerWithControl(
      "Create an internal note about the outage for the ops team.",
      "auto",
      true,
      {
        actorId: "writer-1",
        threadId: "thread-write"
      }
    );

    expect(answer.status).toBe("requires_human_approval");

    const prepared = await service.prepareWriteAction(
      answer.runId,
      "create_internal_note",
      {
        title: "Outage summary",
        body: "Create an internal note about the outage."
      },
      "The user requested a private internal note.",
      {
        actorId: "writer-1",
        threadId: "thread-write"
      }
    );

    expect(prepared.requiredScopes).toContain("internal_notes.write");

    const receipt = await service.executeWriteAction(prepared.approvalId, prepared.confirmationToken, {
      actorId: "writer-1",
      threadId: "thread-write"
    });

    expect(receipt.provider).toContain("private_system");

    const secondReceipt = await service.executeWriteAction(
      prepared.approvalId,
      prepared.confirmationToken,
      {
        actorId: "writer-1",
        threadId: "thread-write"
      }
    );

    expect(secondReceipt.executionId).toBe(receipt.executionId);
  });
});
