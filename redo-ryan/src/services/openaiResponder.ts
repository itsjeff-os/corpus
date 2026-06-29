import OpenAI from "openai";
import { env } from "../config/env";
import { RYAN_SYSTEM_PROMPT } from "../prompts/ryan";

export class OpenAIResponder {
  private client = new OpenAI({ apiKey: env.openAiApiKey });

  async respond(params: { message: string; memoryContext: string }): Promise<string> {
    const response = await this.client.responses.create({
      model: env.openAiModel,
      instructions: RYAN_SYSTEM_PROMPT,
      input: [
        {
          role: "system",
          content: params.memoryContext
            ? `Relevant Zep memory context:\n${params.memoryContext}`
            : "No additional memory context was available for this turn.",
        },
        { role: "user", content: params.message },
      ],
    });
    const reply = response.output_text?.trim();
    if (!reply) throw new Error("OpenAI response did not include output_text");
    return reply;
  }
}
