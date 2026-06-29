import type { ZodType } from "zod";
import type { ModelClient, StructuredGenerationRequest } from "../../src/models/modelClient";

export class SequenceModelClient implements ModelClient {
  private index = 0;

  constructor(private readonly outputs: unknown[]) {}

  async generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<T> {
    if (this.index >= this.outputs.length) {
      throw new Error("SequenceModelClient ran out of scripted outputs.");
    }

    const output = this.outputs[this.index];
    this.index += 1;
    return parseWithSchema(request.schema, output);
  }
}

function parseWithSchema<T>(schema: ZodType<T>, payload: unknown) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(`Scripted output did not match schema: ${parsed.error.message}`);
  }

  return parsed.data;
}
