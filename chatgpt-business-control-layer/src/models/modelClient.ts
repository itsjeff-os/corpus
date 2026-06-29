import type { ZodType } from "zod";

export interface StructuredGenerationRequest<T> {
  schema: ZodType<T>;
  system: string;
  developer: string;
  user?: string;
}

export interface ModelClient {
  generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<T>;
}
