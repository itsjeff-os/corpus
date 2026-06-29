import { z } from "zod";

export const candidateOutputSchema = z.object({
  answer: z.string().min(1),
  assumptions: z.array(z.string()).default([]),
  confidence: z.number().int().min(0).max(100),
  gaps: z.array(z.string()).default([]),
  proposedActions: z.array(z.string()).default([]),
  citations: z.array(z.string()).default([]),
  tradeoffs: z.array(z.string()).optional(),
  revisitTriggers: z.array(z.string()).optional(),
  clarificationQuestion: z.string().nullable().optional(),
  highRiskClaims: z.array(z.string()).optional(),
  writeIntent: z
    .object({
      actionType: z.string(),
      payload: z.record(z.string(), z.unknown()),
      rationale: z.string()
    })
    .nullable()
    .optional()
});

export const assumptionAuditSchema = z.object({
  assumptions: z
    .array(
      z.object({
        assumption: z.string(),
        evidence: z.string().optional(),
        invalidation: z.string().optional(),
        supported: z.boolean().optional()
      })
    )
    .min(1),
  coverageRatio: z.number().min(0).max(1)
});

export const crossExaminationSchema = z.object({
  attacks: z.array(z.string()).min(3),
  weakAssumptions: z.array(z.string()).default([]),
  demandsForEvidence: z.array(z.string()).default([]),
  contradictions: z.array(z.string()).default([]),
  unsupportedHighRiskClaims: z.array(z.string()).default([])
});

export const failureModeSchema = z.object({
  failures: z
    .array(
      z.object({
        component: z.string(),
        effect: z.string(),
        mitigation: z.string(),
        severity: z.enum(["low", "medium", "high"])
      })
    )
    .min(1),
  passed: z.boolean()
});

export const inversionTestSchema = z.object({
  inversion: z.string(),
  advantages: z.array(z.string()).min(1),
  risks: z.array(z.string()).min(1),
  insights: z.array(z.string()).min(1)
});

export const checkpointSchema = z.object({
  snapshot: z.array(z.string()).min(1),
  decisions: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
  nextIteration: z.array(z.string()).min(1)
});

export type CandidateOutputSchema = z.infer<typeof candidateOutputSchema>;
