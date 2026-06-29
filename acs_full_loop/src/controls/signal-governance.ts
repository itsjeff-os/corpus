import crypto from "node:crypto";
import type {
  ExplicitSignals,
  IgnoredSignal,
  SignalCandidate,
  SignalGovernanceResult,
  ValidatedSignal
} from "../types.js";

export function applySignalGovernance(args: {
  message: string;
  recentMessages: string[];
  activeInstructions?: string[];
  statedIntent?: string | null;
}): SignalGovernanceResult {
  const explicit = extractExplicitSignals(args.message, args.activeInstructions ?? [], args.statedIntent ?? null);
  const detected = detectImplicitSignals(args.message, args.recentMessages, explicit);

  const actionable: ValidatedSignal[] = [];
  const ignored: IgnoredSignal[] = [];

  for (const signal of detected) {
    const validation = validateImplicitSignal(signal, explicit, args.recentMessages);

    if (!validation.valid) {
      ignored.push({ ...signal, actionable: false, reason: validation.reason });
      continue;
    }

    if (actionable.length >= 2) {
      ignored.push({ ...signal, actionable: false, reason: "exceeds_inference_budget" });
      continue;
    }

    actionable.push({
      ...signal,
      actionable: true,
      validityBasis: validation.basis,
      permittedEffect: validation.permittedEffect
    });
  }

  return {
    explicit,
    implicit: { detected, actionable, ignored },
    decision: {
      operativeBasis: actionable.length > 0 ? "validated_implicit_signal" : "explicit_content",
      responseEffects: deriveResponseEffects(explicit, actionable),
      blockedEffects: deriveBlockedEffects(ignored),
      persistenceAllowed: actionable.some((s) => s.permittedEffect === "candidate_update" || s.permittedEffect === "both")
    }
  };
}

function extractExplicitSignals(message: string, activeInstructions: string[], statedIntent: string | null): ExplicitSignals {
  const lower = message.toLowerCase();
  const instructions = [...activeInstructions];
  const constraints: string[] = [];

  const directInstructionMarkers = [
    "do ",
    "don't",
    "do not",
    "stop",
    "remove",
    "wait",
    "proceed",
    "build",
    "explain",
    "compare",
    "operationalize",
    "as written",
    "binding"
  ];

  if (directInstructionMarkers.some((marker) => lower.includes(marker))) {
    instructions.push(message);
  }

  if (lower.includes("as written")) constraints.push("apply provided rule exactly as written");
  if (lower.includes("binding")) constraints.push("treat provided rule as binding");
  if (lower.includes("do not") || lower.includes("don't")) constraints.push("honor explicit negative instruction");
  if (lower.includes("must")) constraints.push("honor explicit must-level constraint");
  if (lower.includes("not negotiable")) constraints.push("treat instruction as non-negotiable in this thread");

  return { instructions, constraints, statedIntent };
}

function detectImplicitSignals(message: string, recentMessages: string[], explicit: ExplicitSignals): SignalCandidate[] {
  const lower = message.toLowerCase();
  const signals: SignalCandidate[] = [];

  if (/\blol\b|haha|jail/i.test(message)) {
    signals.push({
      id: crypto.randomUUID(),
      signal: "possible humor or relational texture",
      source: "humor",
      confidence: 0.4,
      evidence: [message]
    });
  }

  if (lower.includes("again") || lower.includes("same") || repeatedCorrectionPattern(recentMessages)) {
    signals.push({
      id: crypto.randomUUID(),
      signal: "possible repeated correction pattern",
      source: "pattern",
      confidence: 0.72,
      evidence: recentMessages.slice(-6)
    });
  }

  if (explicit.instructions.length === 0 && lower.includes("maybe")) {
    signals.push({
      id: crypto.randomUUID(),
      signal: "possible low-confidence exploratory direction",
      source: "contextual_inference",
      confidence: 0.45,
      evidence: [message]
    });
  }

  return signals;
}

function repeatedCorrectionPattern(recentMessages: string[]): boolean {
  const correctionTerms = ["not what i asked", "wrong", "that's not", "don't", "do not", "stop"];
  return recentMessages.slice(-8).filter((msg) => correctionTerms.some((term) => msg.toLowerCase().includes(term))).length >= 2;
}

function validateImplicitSignal(
  signal: SignalCandidate,
  explicit: ExplicitSignals,
  recentMessages: string[]
):
  | { valid: true; basis: ValidatedSignal["validityBasis"]; permittedEffect: ValidatedSignal["permittedEffect"] }
  | { valid: false; reason: IgnoredSignal["reason"] } {
  if (signal.source === "sarcasm") return { valid: false, reason: "sarcasm_non_operational" };

  if (signal.source === "humor") {
    const explicitlyConfirmed = explicit.instructions.some((instruction) => instruction.toLowerCase().includes(signal.signal.toLowerCase()));
    if (!explicitlyConfirmed) return { valid: false, reason: "humor_non_operational" };
    return { valid: true, basis: "explicit_confirmation", permittedEffect: "response_only" };
  }

  const repeated = signal.source === "pattern" && recentMessages.length > 1;
  if (repeated) return { valid: true, basis: "repeated_across_multiple_turns", permittedEffect: "response_only" };

  if (signal.confidence >= 0.85) return { valid: true, basis: "structurally_unambiguous", permittedEffect: "response_only" };

  const consistentWithExplicitIntent =
    explicit.statedIntent !== null &&
    signal.evidence.some((evidence) => evidence.toLowerCase().includes(explicit.statedIntent!.toLowerCase()));

  if (consistentWithExplicitIntent) {
    return { valid: true, basis: "consistent_with_explicit_intent", permittedEffect: "response_only" };
  }

  return { valid: false, reason: "detection_without_validation" };
}

function deriveResponseEffects(explicit: ExplicitSignals, actionable: ValidatedSignal[]): string[] {
  const effects: string[] = [];
  for (const instruction of explicit.instructions) effects.push(`follow explicit instruction: ${instruction}`);
  for (const constraint of explicit.constraints) effects.push(`apply explicit constraint: ${constraint}`);
  for (const signal of actionable) effects.push(`apply validated signal: ${signal.signal}`);
  if (effects.length === 0) effects.push("respond using explicit content only");
  return effects;
}

function deriveBlockedEffects(ignored: IgnoredSignal[]): string[] {
  return ignored.map((signal) => `do not apply ${signal.signal}: ${signal.reason}`);
}
