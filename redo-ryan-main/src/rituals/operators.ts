import OpenAI from "openai";
import { z } from "zod";
import type { Ledger, Frame } from "../state/ledger";
import type { RitualName } from "../scheduler/ritualEngine";

const client = new OpenAI();

const CrossExamSchema = z.object({
  attacks: z.array(z.string()).min(3),
  weakAssumptions: z.array(z.string()).optional(),
  demandsForEvidence: z.array(z.string()).optional(),
});

const SleightSchema = z.object({
  claimedSimplicity: z.string(),
  hiddenComplexities: z.array(z.string()).min(2),
  whoPays: z.array(z.string()).min(1),
  whenItSurfaces: z.array(z.string()).min(1),
});

const InversionSchema = z.object({
  inversion: z.string(),
  advantages: z.array(z.string()).min(2),
  risks: z.array(z.string()).min(2),
  insights: z.array(z.string()).min(1),
});

const AssumptionAuditSchema = z.object({
  assumptions: z.array(z.object({
    assumption: z.string(),
    evidence: z.string().optional(),
    invalidation: z.string().optional(),
  })).min(1),
});

const FailureModeSchema = z.object({
  failures: z.array(z.object({
    component: z.string(),
    effect: z.string(),
    mitigation: z.string(),
  })).min(2),
});

const CheckpointSchema = z.object({
  snapshot: z.array(z.string()).min(3),
  decisions: z.array(z.string()).optional(),
  assumptions: z.array(z.string()).optional(),
  openQuestions: z.array(z.string()).optional(),
  nextIteration: z.array(z.string()).min(1),
});

function systemPromptFor(ritual: RitualName) {
  return `You are a "Reasoning Ritual Operator". Output ONLY valid JSON matching the requested schema. No markdown. No prose.`;
}

export async function runRitual(
  ritual: RitualName,
  input: string,
  ledger: Ledger,
  frame: Frame,
  model = "gpt-5.2"
): Promise<unknown> {
  const schemas: Record<RitualName, z.ZodTypeAny> = {
    cross_examination: CrossExamSchema,
    sleight_of_hand: SleightSchema,
    inversion_test: InversionSchema,
    assumption_audit: AssumptionAuditSchema,
    failure_mode_walkthrough: FailureModeSchema,
    checkpoint: CheckpointSchema,
  };

  const schema = schemas[ritual];

  const ritualInstruction = {
    checkpoint: `Create a checkpoint summary for the ongoing thread. Use the ledger for context.`,
    assumption_audit: `List key assumptions currently in play and how they could be invalidated.`,
    sleight_of_hand: `Identify where complexity is hiding in the user's latest message.`,
    inversion_test: `Propose an inversion of the current direction and analyze it.`,
    failure_mode_walkthrough: `Enumerate likely failures and mitigations for the current plan.`,
    cross_examination: `Act as a hostile cross-examiner attacking claims and demanding evidence.`,
  }[ritual];

  const response = await client.responses.create({
    model,
    input: [
      { role: "system", content: systemPromptFor(ritual) },
      {
        role: "developer",
        content:
          `RITUAL=${ritual}\nFRAME=${frame}\n` +
          `INSTRUCTION=${ritualInstruction}\n` +
          `LEDGER=${JSON.stringify(ledger)}\n` +
          `USER_INPUT=${input}\n` +
          `Return JSON that matches the schema.`,
      },
    ],
  });

  // SDK exposes output_text; we asked for JSON-only.
  const text = response.output_text?.trim() ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    // If the model emitted stray text, do one cheap recovery attempt:
    const repaired = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    parsed = JSON.parse(repaired);
  }

  return schema.parse(parsed);
}
