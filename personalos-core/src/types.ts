export type AdapterKind = "chatgpt" | "local" | "cloudflare" | "mcp" | "memory-vector";

export type Domain =
  | "self"
  | "home"
  | "money"
  | "work"
  | "projects"
  | "knowledge"
  | "operations"
  | "admin"
  | "media"
  | "inbox";

export type RequestedOutcome =
  | "plan"
  | "decision"
  | "synthesis"
  | "audit"
  | "action"
  | "draft"
  | "review"
  | "guidance";

export type InteractionMode =
  | "chief-of-staff"
  | "casual-high-resolution"
  | "interpretive-unpacking"
  | "scoped-co-design"
  | "stress-test"
  | "interaction-analysis"
  | "context-sensitive-partner"
  | "direct-evidence"
  | "archivist-formatter";

export type CueKind =
  | "casual-playful-serious-analysis"
  | "metaphor-as-diagnosis"
  | "broad-problem-iterative-preference"
  | "assumption-testing-language"
  | "interest-in-production-mechanics"
  | "contextual-mode-preference"
  | "positive-response-to-direct-honesty"
  | "request-for-symbolic-artifact";

export type Severity = "low" | "medium" | "high";

export type WorkItemStatus =
  | "planning"
  | "planned"
  | "awaiting_approval"
  | "approved"
  | "rejected";

export type ActionType =
  | "respond"
  | "draft_plan"
  | "queue_follow_up"
  | "request_approval"
  | "capture_memory"
  | "open_review";

export type ActionStatus = "proposed" | "pending_approval" | "approved" | "rejected" | "executed";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type ExecutionStatus = "approved" | "rejected" | "executed";

export type ReflectionKind = "review" | "recovery" | "continuity";

export interface CueMatch {
  kind: CueKind;
  label: string;
  description: string;
  evidence: string[];
  confidence: number;
}

export interface LikelyInference {
  summary: string;
  rationale: string;
  confidence: number;
  cueKinds: CueKind[];
}

export interface CorrectInference {
  summary: string;
  rationale: string;
  cueKinds: CueKind[];
}

export interface ModeSelection {
  mode: InteractionMode;
  rationale: string;
  confidence: number;
}

export interface FailureRisk {
  id: string;
  description: string;
  trigger: string;
  severity: Severity;
  cueKinds: CueKind[];
}

export interface RecoveryMove {
  id: string;
  description: string;
  instruction: string;
  whenToApply: string;
  cueKinds: CueKind[];
}

export interface InteractionAssessment {
  cues: CueMatch[];
  likelyInference: LikelyInference;
  correctInference: CorrectInference;
  optimalMode: ModeSelection;
  failureRisks: FailureRisk[];
  recoveryMoves: RecoveryMove[];
  summary: string;
}

export interface IntakeRequest {
  adapter: AdapterKind;
  userId: string;
  input: string;
  metadata?: Record<string, string>;
}

export interface InteractionContext {
  adapter: AdapterKind;
  recentTurnSummaries: string[];
  ledger?: Ledger;
  priorAssessment?: InteractionAssessment;
}

export interface NormalizedIntent {
  domain: Domain;
  subdomain: string;
  requestedOutcome: RequestedOutcome;
  urgency: "low" | "medium" | "high";
  confidence: number;
  route: string;
}

export interface DecisionRecord {
  decision: string;
  reason: string;
  tradeoff?: string;
  revisitTrigger?: string;
  at: string;
}

export interface AssumptionRecord {
  assumption: string;
  evidence: string;
  invalidation: string;
  at: string;
}

export interface RecoveryRecord {
  move: string;
  appliedBecause: string;
  at: string;
}

export interface Ledger {
  turnCount: number;
  recentInputs: string[];
  interactionHistory: string[];
  decisions: DecisionRecord[];
  assumptions: AssumptionRecord[];
  openQuestions: string[];
  recoveryHistory: RecoveryRecord[];
}

export interface ContextBundle {
  sourceOfTruth: "Life_OS";
  lifeOsRoot: string;
  candidatePaths: string[];
  notes: string[];
  recentWorkItemIds: string[];
  memorySummaries: string[];
  ledgerSnapshot: string[];
  derivedSystems: {
    zep: string;
    vectorStore: string;
  };
}

export interface SpecialistResult {
  specialist: "intake-classifier" | "context-builder" | "strategist" | "action-coordinator";
  summary: string;
  payload: unknown;
}

export interface ActionProposal {
  id: string;
  type: ActionType;
  status: ActionStatus;
  description: string;
  rationale: string;
  requiresApproval: boolean;
  targetPath?: string;
  artifact?: Record<string, unknown>;
}

export interface ApprovalRequest {
  id: string;
  workItemId: string;
  actionProposalId: string;
  status: ApprovalStatus;
  reason: string;
  createdAt: string;
  decidedAt?: string;
}

export interface ActionExecution {
  id: string;
  workItemId: string;
  actionProposalId: string;
  status: ExecutionStatus;
  resultSummary: string;
  createdAt: string;
}

export interface ReflectionEvent {
  id: string;
  workItemId?: string;
  userId?: string;
  kind: ReflectionKind;
  summary: string;
  signals: string[];
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  sourceAdapters: AdapterKind[];
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLedgerRecord {
  userId: string;
  ledger: Ledger;
  updatedAt: string;
}

export interface WorkItem {
  id: string;
  sessionId: string;
  userId: string;
  adapter: AdapterKind;
  input: string;
  status: WorkItemStatus;
  createdAt: string;
  updatedAt: string;
  interaction: InteractionAssessment;
  normalizedIntent: NormalizedIntent;
  context: ContextBundle;
  actionProposals: ActionProposal[];
  approvalIds: string[];
  specialistResults: SpecialistResult[];
  ledger: Ledger;
  responseSummary: string;
}

export interface RuntimeState {
  sessions: Session[];
  workItems: WorkItem[];
  approvals: ApprovalRequest[];
  executions: ActionExecution[];
  reflections: ReflectionEvent[];
  ledgers: UserLedgerRecord[];
}

export interface ReviewScope {
  userId?: string;
  limit?: number;
}
