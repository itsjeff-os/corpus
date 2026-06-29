import { randomUUID } from "crypto";
import path from "path";
import {
  ActionExecution,
  ContextBundle,
  IntakeRequest,
  InteractionAssessment,
  InteractionContext,
  Ledger,
  NormalizedIntent,
  ReflectionEvent,
  ReviewScope,
  WorkItem
} from "../types";
import { ActionCoordinator } from "./action-coordinator";
import { ContextBuilder } from "./context-builder";
import { InteractionRouter } from "./interaction-router";
import { IntakeClassifier, Strategist, StrategistPlan } from "./specialists";
import { FileRuntimeStore } from "../storage/file-runtime-store";

export interface PersonalOSCoreOptions {
  lifeOsRoot?: string;
  stateFilePath?: string;
}

function cloneLedger(ledger: Ledger): Ledger {
  return JSON.parse(JSON.stringify(ledger)) as Ledger;
}

function createEmptyLedger(): Ledger {
  return {
    turnCount: 0,
    recentInputs: [],
    interactionHistory: [],
    decisions: [],
    assumptions: [],
    openQuestions: [],
    recoveryHistory: []
  };
}

function createEmptyContext(lifeOsRoot: string): ContextBundle {
  return {
    sourceOfTruth: "Life_OS",
    lifeOsRoot,
    candidatePaths: [],
    notes: [],
    recentWorkItemIds: [],
    memorySummaries: [],
    ledgerSnapshot: [],
    derivedSystems: {
      zep: "derived-memory-only",
      vectorStore: "derived-index-only"
    }
  };
}

export class PersonalOSCore {
  private readonly store: FileRuntimeStore;
  private readonly router: InteractionRouter;
  private readonly classifier: IntakeClassifier;
  private readonly strategist: Strategist;
  private readonly actionCoordinator: ActionCoordinator;
  private readonly contextBuilder: ContextBuilder;
  private readonly lifeOsRoot: string;

  constructor(options: PersonalOSCoreOptions = {}) {
    this.lifeOsRoot = options.lifeOsRoot ?? process.env.LIFE_OS_ROOT ?? path.resolve(process.cwd(), "runtime", "life-os");
    this.store = new FileRuntimeStore(options.stateFilePath);
    this.router = new InteractionRouter();
    this.classifier = new IntakeClassifier();
    this.strategist = new Strategist();
    this.actionCoordinator = new ActionCoordinator();
    this.contextBuilder = new ContextBuilder(this.lifeOsRoot);
  }

  submitIntake(request: IntakeRequest): WorkItem {
    const session = this.store.getOrCreateSession(request.userId, request.adapter);
    const priorLedger = cloneLedger(this.store.getLedger(request.userId));
    const recentWorkItems = this.store.getRecentWorkItems(request.userId, 3);
    const assessmentContext: InteractionContext = {
      adapter: request.adapter,
      recentTurnSummaries: recentWorkItems.map((workItem) => workItem.responseSummary),
      ledger: priorLedger,
      priorAssessment: recentWorkItems[0]?.interaction
    };
    const interaction = this.assessInteraction(request.input, assessmentContext);
    const { intent, specialistResult: classifierResult } = this.classifier.classify(request, interaction);
    const updatedLedger = this.updateLedger(priorLedger, request.input, interaction, intent);

    let workItem: WorkItem = {
      id: randomUUID(),
      sessionId: session.id,
      userId: request.userId,
      adapter: request.adapter,
      input: request.input,
      status: "planning",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      interaction,
      normalizedIntent: intent,
      context: createEmptyContext(this.lifeOsRoot),
      actionProposals: [],
      approvalIds: [],
      specialistResults: [classifierResult],
      ledger: updatedLedger,
      responseSummary: ""
    };

    const runtimeState = this.store.loadState();
    const { context, specialistResult: contextResult } = this.contextBuilder.buildContext(workItem, runtimeState);
    workItem.context = context;
    workItem.specialistResults.push(contextResult);

    const { plan, specialistResult: strategistResult } = this.strategist.plan(workItem);
    workItem.specialistResults.push(strategistResult);

    const { proposals, specialistResult: actionResult } = this.planActionsWithStrategy(workItem, context, plan);
    const approvals = this.actionCoordinator.createApprovalRequests(workItem.id, proposals);

    workItem.actionProposals = proposals;
    workItem.approvalIds = approvals.map((approval) => approval.id);
    workItem.specialistResults.push(actionResult);
    workItem.responseSummary = plan.summary;
    workItem.status = approvals.length > 0 ? "awaiting_approval" : "planned";
    workItem.updatedAt = new Date().toISOString();

    this.store.saveLedger(request.userId, workItem.ledger);
    this.store.saveWorkItem(workItem);
    approvals.forEach((approval) => this.store.saveApproval(approval));
    this.store.saveReflection(this.createContinuityReflection(workItem));

    return workItem;
  }

  assessInteraction(turn: string, context: InteractionContext): InteractionAssessment {
    return this.router.assessInteraction(turn, context);
  }

  buildContext(workItem: WorkItem): ContextBundle {
    return this.contextBuilder.buildContext(workItem, this.store.loadState()).context;
  }

  planAction(workItem: WorkItem, context: ContextBundle) {
    return this.planActionsWithStrategy(workItem, context, this.strategist.plan(workItem).plan).proposals;
  }

  approveAction(id: string): ActionExecution {
    const approval = this.store.getApproval(id);
    if (!approval) {
      throw new Error(`Approval ${id} not found.`);
    }
    if (approval.status !== "pending") {
      throw new Error(`Approval ${id} is already ${approval.status}.`);
    }

    const workItem = this.requireWorkItem(approval.workItemId);
    const proposal = workItem.actionProposals.find((candidate) => candidate.id === approval.actionProposalId);
    if (!proposal) {
      throw new Error(`Action proposal ${approval.actionProposalId} not found for work item ${workItem.id}.`);
    }

    approval.status = "approved";
    approval.decidedAt = new Date().toISOString();
    proposal.status = "executed";
    workItem.status = "approved";
    workItem.updatedAt = approval.decidedAt;

    const execution: ActionExecution = {
      id: randomUUID(),
      workItemId: workItem.id,
      actionProposalId: proposal.id,
      status: "executed",
      resultSummary: `Approval recorded for "${proposal.description}". V1 stops at a safe execution stub instead of mutating external systems automatically.`,
      createdAt: approval.decidedAt
    };

    this.store.saveApproval(approval);
    this.store.saveExecution(execution);
    this.store.saveWorkItem(workItem);
    this.store.saveReflection({
      id: randomUUID(),
      workItemId: workItem.id,
      userId: workItem.userId,
      kind: "recovery",
      summary: `Approved gated action for ${workItem.normalizedIntent.route}.`,
      signals: ["approval", "safe-execution", workItem.interaction.optimalMode.mode],
      createdAt: execution.createdAt
    });

    return execution;
  }

  rejectAction(id: string): WorkItem {
    const approval = this.store.getApproval(id);
    if (!approval) {
      throw new Error(`Approval ${id} not found.`);
    }
    if (approval.status !== "pending") {
      throw new Error(`Approval ${id} is already ${approval.status}.`);
    }

    const workItem = this.requireWorkItem(approval.workItemId);
    const proposal = workItem.actionProposals.find((candidate) => candidate.id === approval.actionProposalId);
    if (!proposal) {
      throw new Error(`Action proposal ${approval.actionProposalId} not found for work item ${workItem.id}.`);
    }

    approval.status = "rejected";
    approval.decidedAt = new Date().toISOString();
    proposal.status = "rejected";
    workItem.status = "rejected";
    workItem.updatedAt = approval.decidedAt;

    this.store.saveApproval(approval);
    this.store.saveWorkItem(workItem);
    this.store.saveReflection({
      id: randomUUID(),
      workItemId: workItem.id,
      userId: workItem.userId,
      kind: "recovery",
      summary: `Rejected gated action for ${workItem.normalizedIntent.route}.`,
      signals: ["approval-rejected", workItem.interaction.optimalMode.mode],
      createdAt: approval.decidedAt
    });

    return workItem;
  }

  getWorkItem(id: string): WorkItem | undefined {
    return this.store.getWorkItem(id);
  }

  listPendingApprovals() {
    return this.store.listPendingApprovals();
  }

  runReview(scope: ReviewScope): ReflectionEvent[] {
    const limit = scope.limit ?? 5;
    const workItems = this.store.loadState().workItems
      .filter((workItem) => !scope.userId || workItem.userId === scope.userId)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, limit);

    const cueCounts = new Map<string, number>();
    const modeCounts = new Map<string, number>();

    for (const workItem of workItems) {
      for (const cue of workItem.interaction.cues) {
        cueCounts.set(cue.kind, (cueCounts.get(cue.kind) ?? 0) + 1);
      }
      modeCounts.set(
        workItem.interaction.optimalMode.mode,
        (modeCounts.get(workItem.interaction.optimalMode.mode) ?? 0) + 1
      );
    }

    const topCue = Array.from(cueCounts.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "no-dominant-cue";
    const topMode = Array.from(modeCounts.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "chief-of-staff";

    const reflection: ReflectionEvent = {
      id: randomUUID(),
      userId: scope.userId,
      kind: "review",
      summary: `Review over ${workItems.length} work item(s): dominant cue=${topCue}, dominant mode=${topMode}.`,
      signals: [topCue, topMode],
      createdAt: new Date().toISOString()
    };

    this.store.saveReflection(reflection);

    return this.store.listReflections({ userId: scope.userId, limit });
  }

  private planActionsWithStrategy(workItem: WorkItem, context: ContextBundle, plan: StrategistPlan) {
    return this.actionCoordinator.planActions(workItem, context, plan);
  }

  private updateLedger(ledger: Ledger, input: string, interaction: InteractionAssessment, intent: NormalizedIntent): Ledger {
    const nextLedger = cloneLedger(ledger);
    const now = new Date().toISOString();

    nextLedger.turnCount += 1;
    nextLedger.recentInputs = [...nextLedger.recentInputs.slice(-4), input];
    nextLedger.interactionHistory = [...nextLedger.interactionHistory.slice(-4), interaction.summary];
    nextLedger.decisions = [
      ...nextLedger.decisions.slice(-5),
      {
        decision: `Route work through ${intent.route}`,
        reason: interaction.correctInference.summary,
        tradeoff: interaction.failureRisks[0]?.description,
        revisitTrigger: interaction.recoveryMoves[0]?.description,
        at: now
      }
    ];
    nextLedger.assumptions = [
      ...nextLedger.assumptions.slice(-5),
      {
        assumption: interaction.correctInference.summary,
        evidence: interaction.cues.map((cue) => cue.label).join(", ") || "chief-of-staff default",
        invalidation: interaction.failureRisks[0]?.trigger ?? "A stronger local cue should override this interpretation.",
        at: now
      }
    ];
    nextLedger.openQuestions = Array.from(
      new Set([
        ...nextLedger.openQuestions.slice(-4),
        ...interaction.failureRisks.map((risk) => `How do we avoid: ${risk.description}`)
      ])
    ).slice(-5);
    nextLedger.recoveryHistory = [
      ...nextLedger.recoveryHistory.slice(-5),
      ...interaction.recoveryMoves.slice(0, 2).map((move) => ({
        move: move.description,
        appliedBecause: move.whenToApply,
        at: now
      }))
    ].slice(-6);

    return nextLedger;
  }

  private createContinuityReflection(workItem: WorkItem): ReflectionEvent {
    return {
      id: randomUUID(),
      workItemId: workItem.id,
      userId: workItem.userId,
      kind: "continuity",
      summary: `Captured corrected inference for ${workItem.normalizedIntent.route}: ${workItem.interaction.correctInference.summary}`,
      signals: [
        workItem.interaction.optimalMode.mode,
        ...workItem.interaction.cues.map((cue) => cue.kind)
      ],
      createdAt: workItem.updatedAt
    };
  }

  private requireWorkItem(id: string): WorkItem {
    const workItem = this.store.getWorkItem(id);
    if (!workItem) {
      throw new Error(`Work item ${id} not found.`);
    }

    return workItem;
  }
}
