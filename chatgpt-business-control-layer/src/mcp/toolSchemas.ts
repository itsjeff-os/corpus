import { z } from "zod";

export const searchInputSchema = z.object({
  query: z.string().min(1)
});

export const fetchInputSchema = z.object({
  id: z.string().min(1)
});

export const answerWithControlInputSchema = z.object({
  input: z.string().min(1),
  mode: z.enum(["auto", "knowledge", "decision_support"]).default("auto"),
  allow_write: z.boolean().default(false),
  actor_id: z.string().optional(),
  thread_id: z.string().optional()
});

export const explainIntegrityInputSchema = z.object({
  run_id: z.string().min(1)
});

export const prepareWriteInputSchema = z.object({
  run_id: z.string().min(1),
  action_type: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
  justification: z.string().min(1),
  actor_id: z.string().optional(),
  thread_id: z.string().optional()
});

export const executeWriteInputSchema = z.object({
  approval_id: z.string().min(1),
  confirmation_token: z.string().min(1),
  actor_id: z.string().optional(),
  thread_id: z.string().optional()
});
