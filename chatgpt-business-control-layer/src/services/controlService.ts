import { randomUUID } from "node:crypto";
import { candidateOutputSchema } from "../models/schemas";
import type { ModelClient } from "../models/modelClient";
import { classifyRequest } from "../pipeline/classifier";
import { IntegrityEvaluators } from "../pipeline/evaluators";
import { passesHardGate, scoreIntegrity } from "../pipeline/scoring";
import type {
  CandidateOutput,
  ControlledAnswer,
  ExplainIntegrityResult,
  IntegrityReport,
  PersistedRun,
  PreparedWriteAction,
  PreparedWriteActionResult,
  RequestClass,
  RequestContext,
  RequestMode,
  SearchResult
} from "../types/contracts";
import { createOpaqueToken, hashActor, sha256 } from "../utils/hash";
import type { ControlStore } from "../stores/controlStore";
import { CorpusService } from "./corpusService";
import { buildCandidatePrompt, buildRegenerationPrompt } from "./controlPolicy";
import { PrivateSystemWriteAdapter } from "./writeAdapter";
import { getEnv } from "../config/env";

export class ControlService {
  private readonly env = getEnv();
  private readonly evaluators: IntegrityEvaluators;
  private readonly writeAdapter = new PrivateSystemWriteAdapter();

  constructor(
    private readonly modelClient: ModelClient,
    private readonly store: ControlStore,
    private readonly corpusService = new CorpusService()
  ) {
    this.evaluators = new IntegrityEvaluators(modelClient);
  }

  search(query: string) {
    return this.corpusService.search(query);
  }

  fetch(id: string) {
    return this.corpusService.fetch(id);
  }

  async answerWithControl(
    input: string,
    mode: RequestMode,
    allowWrite: boolean,
    context: RequestContext = {}
  ): Promise<ControlledAnswer> {
    const actorHash = hashActor(context.actorId, context.threadId);
    const requestClass = classifyRequest(input, mode);
    const runCount = await this.store.getActorRunCount(actorHash);
    const shouldCheckpoint = (runCount + 1) % this.env.CHECKPOINT_INTERVAL_RUNS === 0;

    const searchTerms = input.length > 120 ? input.slice(0, 120) : input;
    const retrieved = this.corpusService.search(searchTerms, 5);
    const evidence = [
      ...this.corpusService.getPolicyDocuments(requestClass),
      ...this.corpusService.fetchMany(retrieved.map((result) => result.id))
    ];

    const primaryCandidate = await this.modelClient.generateStructured<CandidateOutput>({
      schema: candidateOutputSchema,
      ...buildCandidatePrompt(input, requestClass, evidence)
    });

    const firstPass = await this.evaluateCandidate({
      input,
      requestClass,
      evidence,
      candidate: primaryCandidate,
      shouldCheckpoint
    });

    let finalCandidate = primaryCandidate;
    let finalPass = firstPass;
    let regenerated = false;

    if (!firstPass.passed) {
      regenerated = true;
      const regeneratedCandidate = await this.modelClient.generateStructured<CandidateOutput>({
        schema: candidateOutputSchema,
        ...buildRegenerationPrompt(
          input,
          requestClass,
          evidence,
          primaryCandidate,
          firstPass.integrityReport.checks.filter((check) => !check.passed).map((check) => check.name)
        )
      });

      const secondPass = await this.evaluateCandidate({
        input,
        requestClass,
        evidence,
        candidate: regeneratedCandidate,
        shouldCheckpoint
      });

      finalCandidate = regeneratedCandidate;
      finalPass = secondPass;
    }

    const status = this.resolveStatus(finalPass, requestClass, finalCandidate, allowWrite);
    const runId = randomUUID();
    const sources = this.resolveSources(finalCandidate.citations, retrieved);

    const answer: ControlledAnswer = {
      status,
      answer:
        status === "insufficient_evidence"
          ? "I do not have enough approved evidence to answer this reliably."
          : finalCandidate.answer,
      sources,
      assumptions: finalCandidate.assumptions,
      confidence: finalCandidate.confidence,
      gaps: finalCandidate.gaps,
      integrity: {
        score: finalPass.integrityReport.score,
        checks: finalPass.integrityReport.checks
      },
      proposedActions:
        status === "requires_human_approval" && finalCandidate.writeIntent
          ? [`Prepare ${finalCandidate.writeIntent.actionType} for approval.`]
          : finalCandidate.proposedActions,
      runId,
      clarificationQuestion:
        status === "needs_clarification" ? finalCandidate.clarificationQuestion ?? null : null
    };

    const integrityReport: IntegrityReport = {
      ...finalPass.integrityReport,
      runId,
      regenerated
    };

    const persistedRun: PersistedRun = {
      runId,
      actorHash,
      threadId: context.threadId,
      appVersion: this.env.APP_VERSION,
      requestClass,
      requestedMode: mode,
      allowWrite,
      status,
      confidence: answer.confidence,
      integrityScore: integrityReport.score,
      sourceIds: sources.map((source) => source.id),
      scoreBreakdown: integrityReport.checks,
      evaluatorOutputs: integrityReport.evaluatorOutputs,
      integrityReport,
      answerPayload: answer,
      proposedActions: answer.proposedActions,
      rawInput: context.debugPersistRawInput || this.env.DEBUG_STORE_RAW_INPUT ? input : undefined,
      createdAt: new Date().toISOString()
    };

    await this.store.saveRun(persistedRun);
    return answer;
  }

  async explainIntegrityReport(runId: string): Promise<ExplainIntegrityResult> {
    const run = await this.store.getRun(runId);
    if (!run) {
      throw new Error(`Run ${runId} was not found.`);
    }

    return {
      runId,
      status: run.status,
      report: run.integrityReport,
      answer: run.answerPayload
    };
  }

  async prepareWriteAction(
    runId: string,
    actionType: string,
    payload: Record<string, unknown>,
    justification: string,
    context: RequestContext = {}
  ): Promise<PreparedWriteActionResult> {
    const run = await this.store.getRun(runId);
    if (!run) {
      throw new Error(`Run ${runId} was not found.`);
    }

    if (run.status !== "requires_human_approval") {
      throw new Error("Writes can only be prepared from a run that requires human approval.");
    }

    const actorHash = hashActor(context.actorId, context.threadId);
    if (actorHash !== run.actorHash) {
      throw new Error("Actor mismatch for write preparation.");
    }

    this.writeAdapter.validateActionType(actionType);

    const payloadSummary = this.writeAdapter.summarizePayload(actionType, payload);
    const confirmationToken = createOpaqueToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const idempotencyKey = sha256(`${runId}:${actionType}:${JSON.stringify(payload)}`);

    const approval: PreparedWriteAction = {
      approvalId: randomUUID(),
      runId,
      actorHash,
      actionType,
      payload,
      payloadSummary,
      riskSummary: this.writeAdapter.riskSummary(),
      requiredScopes: this.writeAdapter.requiredScopes(),
      justification,
      confirmationTokenHash: sha256(confirmationToken),
      expiresAt,
      idempotencyKey,
      status: "pending"
    };

    const persisted = await this.store.saveApproval(approval);

    return {
      approvalId: persisted.approvalId,
      runId,
      actionType: persisted.actionType,
      payloadSummary: persisted.payloadSummary,
      riskSummary: persisted.riskSummary,
      requiredScopes: persisted.requiredScopes,
      expiresAt: persisted.expiresAt,
      confirmationToken
    };
  }

  async executeWriteAction(
    approvalId: string,
    confirmationToken: string,
    context: RequestContext = {}
  ) {
    const approval = await this.store.getApproval(approvalId);
    if (!approval) {
      throw new Error(`Approval ${approvalId} was not found.`);
    }

    const actorHash = hashActor(context.actorId, context.threadId);
    if (actorHash !== approval.actorHash) {
      throw new Error("Actor mismatch for write execution.");
    }

    if (approval.status === "executed") {
      const existingExecution = await this.store.getExecutionByApprovalId(approvalId);
      if (!existingExecution) {
        throw new Error("Approval is executed but no execution receipt was found.");
      }

      return this.writeAdapter.toReceipt(existingExecution);
    }

    if (new Date(approval.expiresAt).getTime() < Date.now()) {
      throw new Error("Approval has expired.");
    }

    if (sha256(confirmationToken) !== approval.confirmationTokenHash) {
      throw new Error("Confirmation token did not match.");
    }

    const execution = await this.writeAdapter.execute(approval, approval.payload);
    await this.store.recordExecution(execution);
    await this.store.markApprovalExecuted(approvalId, execution.createdAt);
    return this.writeAdapter.toReceipt(execution);
  }

  private resolveSources(citationIds: string[], fallback: SearchResult[]) {
    const preferred = citationIds
      .map((id) => this.corpusService.fetch(id))
      .filter((document): document is NonNullable<typeof document> => Boolean(document))
      .map((document) => ({
        id: document.id,
        title: document.title,
        url: document.url
      }));

    if (preferred.length) {
      return preferred;
    }

    return fallback;
  }

  private resolveStatus(
    evaluation: Awaited<ReturnType<ControlService["evaluateCandidate"]>>,
    requestClass: RequestClass,
    candidate: CandidateOutput,
    allowWrite: boolean
  ) {
    if (evaluation.passed) {
      if (requestClass === "write_candidate" && allowWrite && candidate.writeIntent) {
        return "requires_human_approval";
      }
      return "approved";
    }

    if (candidate.clarificationQuestion) {
      return "needs_clarification";
    }

    return "insufficient_evidence";
  }

  private async evaluateCandidate({
    input,
    requestClass,
    evidence,
    candidate,
    shouldCheckpoint
  }: {
    input: string;
    requestClass: RequestClass;
    evidence: ReturnType<CorpusService["getPolicyDocuments"]>;
    candidate: CandidateOutput;
    shouldCheckpoint: boolean;
  }) {
    const assumptionAudit = await this.evaluators.runAssumptionAudit(input, requestClass, evidence, candidate);
    const crossExamination = await this.evaluators.runCrossExamination(input, requestClass, evidence, candidate);
    const failureModeWalkthrough =
      requestClass === "decision_support" || requestClass === "write_candidate"
        ? await this.evaluators.runFailureModeWalkthrough(input, requestClass, evidence, candidate)
        : undefined;
    const inversionTest =
      requestClass === "decision_support" || requestClass === "write_candidate"
        ? await this.evaluators.runInversionTest(input, requestClass, evidence, candidate)
        : undefined;
    const checkpoint = shouldCheckpoint
      ? await this.evaluators.runCheckpoint(requestClass, evidence, candidate, {
          assumptionAudit,
          crossExamination,
          failureModeWalkthrough,
          inversionTest
        })
      : undefined;

    const scoring = scoreIntegrity({
      requestClass,
      candidate,
      evidenceCoverage: assumptionAudit.coverageRatio,
      crossExamination,
      failureModeWalkthrough
    });

    const passed = passesHardGate(
      requestClass,
      scoring.score,
      assumptionAudit.coverageRatio,
      crossExamination.contradictions.length,
      crossExamination.unsupportedHighRiskClaims.length,
      candidate,
      failureModeWalkthrough
    );

    return {
      passed,
      integrityReport: {
        runId: "",
        requestClass,
        score: scoring.score,
        evidenceCoverage: assumptionAudit.coverageRatio,
        contradictionCount: crossExamination.contradictions.length,
        unsupportedHighRiskClaimCount: crossExamination.unsupportedHighRiskClaims.length,
        regenerated: false,
        checks: scoring.checks,
        evaluatorOutputs: {
          assumptionAudit,
          crossExamination,
          failureModeWalkthrough,
          inversionTest,
          checkpoint
        }
      } satisfies IntegrityReport
    };
  }
}
