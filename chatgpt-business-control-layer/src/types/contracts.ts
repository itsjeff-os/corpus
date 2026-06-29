export type RequestMode = "auto" | "knowledge" | "decision_support";

export type RequestClass = "knowledge" | "decision_support" | "write_candidate";

export type AnswerStatus =
  | "approved"
  | "needs_clarification"
  | "insufficient_evidence"
  | "requires_human_approval";

export type EvaluatorName =
  | "assumption_audit"
  | "cross_examination"
  | "failure_mode_walkthrough"
  | "inversion_test"
  | "checkpoint";

export interface RequestContext {
  actorId?: string;
  threadId?: string;
  debugPersistRawInput?: boolean;
}

export interface CorpusDocument {
  id: string;
  title: string;
  text: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
}

export interface AssumptionItem {
  assumption: string;
  evidence?: string;
  invalidation?: string;
  supported?: boolean;
}

export interface CandidateOutput {
  answer: string;
  assumptions: string[];
  confidence: number;
  gaps: string[];
  proposedActions: string[];
  citations: string[];
  tradeoffs?: string[];
  revisitTriggers?: string[];
  clarificationQuestion?: string | null;
  highRiskClaims?: string[];
  writeIntent?: {
    actionType: string;
    payload: Record<string, unknown>;
    rationale: string;
  } | null;
}

export interface AssumptionAuditOutput {
  assumptions: AssumptionItem[];
  coverageRatio: number;
}

export interface CrossExaminationOutput {
  attacks: string[];
  weakAssumptions: string[];
  demandsForEvidence: string[];
  contradictions: string[];
  unsupportedHighRiskClaims: string[];
}

export interface FailureModeOutput {
  failures: Array<{
    component: string;
    effect: string;
    mitigation: string;
    severity: "low" | "medium" | "high";
  }>;
  passed: boolean;
}

export interface InversionTestOutput {
  inversion: string;
  advantages: string[];
  risks: string[];
  insights: string[];
}

export interface CheckpointOutput {
  snapshot: string[];
  decisions: string[];
  assumptions: string[];
  openQuestions: string[];
  nextIteration: string[];
}

export interface IntegrityCheck {
  name: string;
  passed: boolean;
  expected: string;
  observed: string;
  details?: string[];
}

export interface IntegrityReport {
  runId: string;
  requestClass: RequestClass;
  score: number;
  evidenceCoverage: number;
  contradictionCount: number;
  unsupportedHighRiskClaimCount: number;
  regenerated: boolean;
  checks: IntegrityCheck[];
  evaluatorOutputs: {
    assumptionAudit: AssumptionAuditOutput;
    crossExamination: CrossExaminationOutput;
    failureModeWalkthrough?: FailureModeOutput;
    inversionTest?: InversionTestOutput;
    checkpoint?: CheckpointOutput;
  };
}

export interface ControlledAnswer {
  status: AnswerStatus;
  answer: string;
  sources: SearchResult[];
  assumptions: string[];
  confidence: number;
  gaps: string[];
  integrity: {
    score: number;
    checks: IntegrityCheck[];
  };
  proposedActions: string[];
  runId: string;
  clarificationQuestion?: string | null;
}

export interface PersistedRun {
  runId: string;
  actorHash: string;
  threadId?: string;
  appVersion: string;
  requestClass: RequestClass;
  requestedMode: RequestMode;
  allowWrite: boolean;
  status: AnswerStatus;
  confidence: number;
  integrityScore: number;
  sourceIds: string[];
  scoreBreakdown: IntegrityCheck[];
  evaluatorOutputs: IntegrityReport["evaluatorOutputs"];
  integrityReport: IntegrityReport;
  answerPayload: ControlledAnswer;
  proposedActions: string[];
  rawInput?: string;
  createdAt: string;
}

export interface PreparedWriteAction {
  approvalId: string;
  runId: string;
  actorHash: string;
  actionType: string;
  payload: Record<string, unknown>;
  payloadSummary: {
    title: string;
    preview: string;
  };
  riskSummary: string;
  requiredScopes: string[];
  justification: string;
  confirmationTokenHash: string;
  expiresAt: string;
  idempotencyKey: string;
  status: "pending" | "executed" | "expired";
}

export interface PreparedWriteActionResult {
  approvalId: string;
  runId: string;
  actionType: string;
  payloadSummary: PreparedWriteAction["payloadSummary"];
  riskSummary: string;
  requiredScopes: string[];
  expiresAt: string;
  confirmationToken: string;
}

export interface WriteExecutionReceipt {
  executionId: string;
  approvalId: string;
  provider: string;
  targetRef: string;
  createdAt: string;
}

export interface StoredWriteExecution extends WriteExecutionReceipt {
  actorHash: string;
  requestPayload: Record<string, unknown>;
  providerResponse: Record<string, unknown>;
}

export interface ExplainIntegrityResult {
  runId: string;
  status: AnswerStatus;
  report: IntegrityReport;
  answer: ControlledAnswer;
}
