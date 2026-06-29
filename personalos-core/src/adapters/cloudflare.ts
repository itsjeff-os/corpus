import { IntakeRequest } from "../types";

export interface CloudflareIntakePayload {
  kind: string;
  format: string;
  payload: string | { message?: string; userId?: string; metadata?: Record<string, string> };
  userId?: string;
  metadata?: Record<string, string>;
}

export function fromCloudflarePayload(body: CloudflareIntakePayload): IntakeRequest {
  const payloadObject = typeof body.payload === "string" ? undefined : body.payload;
  const input = typeof body.payload === "string"
    ? body.payload
    : payloadObject?.message ?? JSON.stringify(body.payload);

  const userId = body.userId ?? payloadObject?.userId ?? "anonymous";

  return {
    adapter: "cloudflare",
    userId,
    input,
    metadata: {
      kind: body.kind,
      format: body.format,
      ...body.metadata,
      ...payloadObject?.metadata
    }
  };
}
