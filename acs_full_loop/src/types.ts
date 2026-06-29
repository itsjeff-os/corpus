export type UUID = string;

export type RuntimeIdentity = {
  userId: UUID;
  chatId: string;
  project?: string | null;
};

export type ExplicitSignals = {
  instructions: string[];
  constraints: string[];
  statedIntent: string | null;
};

export type ImplicitSignalSource =
  | "tone"
  | "sarcasm"
  | "humor"
  | "contextual_inference"
  | "pattern";

export type SignalValidityBasis =
  | "repeated_across_multiple_turns"
  | "explicit_confirmation"
  | "structurally_unambiguous"
  | "consistent_with_explicit_intent";

export type SignalCandidate = {
  id: string;
  signal: string;
  source: ImplicitSignalSource;
  confidence: number;
  evidence: string[];
};

export type ValidatedSignal = SignalCandidate & {
  actionable: true;
  validityBasis: SignalValidityBasis;
  permittedEffect: "response_only" | "candidate_update" | "both";
};

export type IgnoredSignal = SignalCandidate & {
  actionable: false;
  reason:
    | "detection_without_validation"
    | "ambiguous"
    | "lower_tier_conflict"
    | "exceeds_inference_budget"
    | "sarcasm_non_operational"
    | "humor_non_operational";
};

export type SignalGovernanceResult = {
  explicit: ExplicitSignals;
  implicit: {
    detected: SignalCandidate[];
    actionable: ValidatedSignal[];
    ignored: IgnoredSignal[];
  };
  decision: {
    operativeBasis: "explicit_content" | "validated_implicit_signal";
    responseEffects: string[];
    blockedEffects: string[];
    persistenceAllowed: boolean;
  };
};

export type MetacognitiveContext = {
  source: "supabase";
  assistant_state: Record<string, unknown> | null;
  active_constraints: unknown[];
  available_strategies: unknown[];
  recent_strategy_uses: unknown[];
  active_inferences: unknown[];
  permission_state: {
    pending_approvals: unknown[];
    rule: "external_action_requires_explicit_approval";
  };
  reflection_budget: Record<string, unknown> | null;
};

export type ConversationalContext = {
  source: "zep";
  user_context: string;
  relevant_facts: unknown[];
  recent_thread_summary: string;
};

export type SemanticContext = {
  source: "chroma";
  retrieved_protocols: unknown[];
  similar_examples: unknown[];
  pattern_references: unknown[];
};

export type RuntimeContext = {
  identity: RuntimeIdentity;
  user_message: string;
  recent_messages: string[];
  metacognitive_context: MetacognitiveContext;
  conversational_context: ConversationalContext;
  semantic_context: SemanticContext;
  signal_governance: SignalGovernanceResult;
};

export type ControlName =
  | "Explicit Content Lock"
  | "Build-State Lock"
  | "Authority Delegation Lock"
  | "Signal Validation Gate"
  | "Response Mode Lock"
  | "Object Contact Lock"
  | "Output Non-Interference Lock"
  | "Traceability Gate";

export type ResponseMode =
  | "answer"
  | "build"
  | "trace"
  | "explain"
  | "compare"
  | "redraft"
  | "question";

export type GeneratorControlDecision = {
  active_controls: Array<{
    name: ControlName;
    activated_by: string;
    blocks: string[];
    permits: string[];
  }>;
  forbidden_generation_paths: string[];
  required_output_properties: string[];
  selected_response_mode: ResponseMode;
  may_generate: boolean;
  reason_if_blocked?: string;
};

export type ReasoningPayload = {
  response_text: string;
  claims: Array<{
    content: string;
    certainty: "certain" | "probable" | "uncertain";
    scope: "turn" | "thread" | "project" | "global";
  }>;
  artefacts: Array<{
    name: string;
    kind: "code" | "schema" | "policy" | "plan" | "test" | "none";
    content: string;
  }>;
  selected_next_move: string | null;
  trace: {
    used_explicit_content: string[];
    used_validated_signals: string[];
    active_controls: ControlName[];
    blocked_paths: string[];
  };
};

export type LoopResult = {
  answer: string;
  reasoning_payload: ReasoningPayload;
  controls: GeneratorControlDecision;
  signal_governance: SignalGovernanceResult;
  trace: {
    conversation_user_message_id?: string;
    conversation_assistant_message_id?: string;
    signal_event_id?: string;
    event_ids: string[];
  };
};
