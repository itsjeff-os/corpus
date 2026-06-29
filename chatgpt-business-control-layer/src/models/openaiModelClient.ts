import OpenAI from "openai";
import type { ZodType } from "zod";
import { parseJsonObject } from "../utils/json";
import type { ModelClient, StructuredGenerationRequest } from "./modelClient";

export class OpenAIModelClient implements ModelClient {
  private readonly client: OpenAI;

  constructor(apiKey: string, private readonly model: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateStructured<T>(request: StructuredGenerationRequest<T>) {
    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: "system",
          content: request.system
        },
        {
          role: "developer",
          content: request.developer
        },
        ...(request.user
          ? [
              {
                role: "user" as const,
                content: request.user
              }
            ]
          : [])
      ]
    });

    const outputText = response.output_text?.trim() ?? "";
    const parsed = parseJsonObject<unknown>(outputText);
    return validateSchema(request.schema, parsed);
  }
}

function validateSchema<T>(schema: ZodType<T>, payload: unknown) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(`Model output did not match schema: ${parsed.error.message}`);
  }

  return parsed.data;
}
