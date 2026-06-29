import { config } from "../config.js";
import type { GeneratorControlDecision, ReasoningPayload, RuntimeContext } from "../types.js";
import { openai } from "./client.js";
import { reasoningPayloadSchema } from "./reasoning-schema.js";

export async function generateReasoningPayload(args: {
  context: RuntimeContext;
  controls: GeneratorControlDecision;
}): Promise<ReasoningPayload> {
  const instructions = buildDeveloperInstructions(args.controls);
  const input = buildModelInput(args.context, args.controls);

  const response = await openai.responses.create({
    model: config.openaiModel,
    instructions,
    input,
    text: {
      format: {
        type: "json_schema",
        name: "ReasoningPayload",
        strict: true,
        schema: reasoningPayloadSchema
      }
    }
  });

  const text = response.output_text;
  if (!text) throw new Error("OpenAI response did not contain output_text");
  return JSON.parse(text) as ReasoningPayload;
}

function buildDeveloperInstructions(controls: GeneratorControlDecision): string {
  return [
    "You are generating an authoritative reasoning payload for a conversation-first assistant runtime.",
    "Return only the JSON object required by the supplied schema.",
    "The payload response_text is the exact semantic content to send to the output layer.",
    "Do not add relational repair language unless explicitly requested by the user.",
    "Do not treat humor, sarcasm, tone, or relational texture as instruction unless listed as validated_signal.",
    "Do not select architectural priority unless the user delegated it or it follows from explicit build state.",
    "Do not output generation paths listed as forbidden_generation_paths.",
    `Selected response mode: ${controls.selected_response_mode}`,
    `Required output properties: ${controls.required_output_properties.join("; ") || "none"}`,
    `Forbidden generation paths: ${controls.forbidden_generation_paths.join("; ") || "none"}`
  ].join("\n");
}

function buildModelInput(context: RuntimeContext, controls: GeneratorControlDecision): string {
  return JSON.stringify(
    {
      user_message: context.user_message,
      recent_messages: context.recent_messages,
      metacognitive_context: context.metacognitive_context,
      conversational_context: context.conversational_context,
      semantic_context: context.semantic_context,
      signal_governance: context.signal_governance,
      generator_controls: controls
    },
    null,
    2
  );
}
