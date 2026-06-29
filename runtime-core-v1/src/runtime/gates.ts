import { z } from "zod";

export const gateSlotSchema = z.enum([
  "state_claim",
  "maturity_claim",
  "handoff",
  "authority",
  "action",
  "evidence",
  "domain_policy",
  "user_policy",
  "project_policy"
]);

export const gateScopeSchema = z.object({
  project_id: z.string().min(1).optional(),
  user_id: z.string().min(1).optional(),
  interaction_id: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  thread_id: z.string().min(1).optional()
}).strict();

export const gateEvidenceSchema = z.object({
  type: z.string().min(1),
  reference: z.string().min(1),
  result: z.string().min(1).optional(),
  metadata: z.record(z.unknown()).default({})
}).strict();

export const gateInputSchema = z.object({
  slot: gateSlotSchema,
  candidate: z.unknown(),
  scope: gateScopeSchema.default({}),
  evidence: z.array(gateEvidenceSchema).default([]),
  metadata: z.record(z.unknown()).default({})
}).strict();

export const gateDecisionSchema = z.object({
  gate_id: z.string().min(1),
  slot: gateSlotSchema,
  outcome: z.enum(["allow", "block", "review"]),
  reason: z.string().min(1),
  receipts: z.array(gateEvidenceSchema).default([]),
  metadata: z.record(z.unknown()).default({})
}).strict();

export const gateResultSchema = z.object({
  ok: z.boolean(),
  decisions: z.array(gateDecisionSchema),
  blocked: z.array(gateDecisionSchema),
  review: z.array(gateDecisionSchema)
}).strict();

export type GateSlot = z.infer<typeof gateSlotSchema>;
export type GateInput = z.infer<typeof gateInputSchema>;
export type GateDecision = z.infer<typeof gateDecisionSchema>;
export type GateResult = z.infer<typeof gateResultSchema>;

export interface Gate {
  id: string;
  slot: GateSlot;
  evaluate(input: GateInput): GateDecision;
}

export function runGates(input: unknown, gates: Gate[]): GateResult {
  const parsed = gateInputSchema.safeParse(input);
  if (!parsed.success) {
    const decision: GateDecision = {
      gate_id: "gate_input_schema",
      slot: "evidence",
      outcome: "block",
      reason: parsed.error.issues.map((issue) => issue.message).join("; "),
      receipts: [],
      metadata: {}
    };
    return { ok: false, decisions: [decision], blocked: [decision], review: [] };
  }

  const matchingGates = gates.filter((gate) => gate.slot === parsed.data.slot);
  const decisions = matchingGates.map((gate) => gate.evaluate(parsed.data));
  const blocked = decisions.filter((decision) => decision.outcome === "block");
  const review = decisions.filter((decision) => decision.outcome === "review");

  return {
    ok: blocked.length === 0 && review.length === 0,
    decisions,
    blocked,
    review
  };
}

export function createPassThroughGate(id: string, slot: GateSlot): Gate {
  return {
    id,
    slot,
    evaluate(input) {
      return {
        gate_id: id,
        slot,
        outcome: "allow",
        reason: "No policy has been attached to this gate slot.",
        receipts: input.evidence,
        metadata: {}
      };
    }
  };
}

export const defaultGateScaffold: Gate[] = gateSlotSchema.options.map((slot) =>
  createPassThroughGate(`${slot}_scaffold`, slot)
);
