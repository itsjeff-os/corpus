import { randomUUID } from "crypto";
import { ActionProposal, ApprovalRequest, ContextBundle, SpecialistResult, WorkItem } from "../types";
import { StrategistPlan } from "./specialists";

const MUTATION_PATTERN = /\b(update|create|write|save|file|schedule|send|organize|move|delete|rename|log)\b/i;

export class ActionCoordinator {
  planActions(workItem: WorkItem, context: ContextBundle, strategistPlan: StrategistPlan): {
    proposals: ActionProposal[];
    specialistResult: SpecialistResult;
  } {
    const proposals: ActionProposal[] = [
      {
        id: randomUUID(),
        type: workItem.normalizedIntent.requestedOutcome === "review" ? "open_review" : "draft_plan",
        status: "proposed",
        description: `Produce the primary ${workItem.normalizedIntent.requestedOutcome} artifact for ${workItem.normalizedIntent.route}.`,
        rationale: strategistPlan.summary,
        requiresApproval: false,
        targetPath: context.candidatePaths[0],
        artifact: {
          nextSteps: strategistPlan.nextSteps,
          openQuestions: strategistPlan.openQuestions,
          mode: workItem.interaction.optimalMode.mode
        }
      },
      {
        id: randomUUID(),
        type: "capture_memory",
        status: "proposed",
        description: "Capture the interaction assessment and plan as derived memory.",
        rationale: "Persist the corrected inference, recovery moves, and routing outcome for continuity.",
        requiresApproval: false,
        artifact: {
          cues: workItem.interaction.cues.map((cue) => cue.kind),
          correctedInference: workItem.interaction.correctInference.summary
        }
      }
    ];

    if (MUTATION_PATTERN.test(workItem.input)) {
      proposals.push({
        id: randomUUID(),
        type: "request_approval",
        status: "pending_approval",
        description: `Create or update an artifact under ${context.candidatePaths[0] ?? context.lifeOsRoot}.`,
        rationale: "The request implies a write or external action, so approval is required in v1.",
        requiresApproval: true,
        targetPath: context.candidatePaths[0] ?? context.lifeOsRoot,
        artifact: {
          requestedBy: workItem.adapter,
          approvalGate: "v1-write-policy"
        }
      });
    }

    return {
      proposals,
      specialistResult: {
        specialist: "action-coordinator",
        summary: `Prepared ${proposals.length} action proposal(s); ${proposals.filter((proposal) => proposal.requiresApproval).length} require approval.`,
        payload: proposals
      }
    };
  }

  createApprovalRequests(workItemId: string, proposals: ActionProposal[]): ApprovalRequest[] {
    const now = new Date().toISOString();

    return proposals
      .filter((proposal) => proposal.requiresApproval)
      .map((proposal) => ({
        id: randomUUID(),
        workItemId,
        actionProposalId: proposal.id,
        status: "pending",
        reason: proposal.rationale,
        createdAt: now
      }));
  }
}
