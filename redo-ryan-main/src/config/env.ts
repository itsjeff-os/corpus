import dotenv from "dotenv";

dotenv.config({ override: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function requiredHeaderValue(name: string): string {
  const value = required(name);
  const invalid = Array.from(value).find((char) => char.codePointAt(0)! > 255);
  if (invalid) {
    throw new Error(`${name} contains a non-ASCII character. Re-paste it without smart quotes or rich-text formatting.`);
  }
  return value;
}

function optionalNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid numeric env var: ${name}`);
  return parsed;
}

export const env = {
  openAiApiKey: requiredHeaderValue("OPENAI_API_KEY"),
  zepApiKey: requiredHeaderValue("ZEP_API_KEY"),
  openAiModel: process.env.OPENAI_MODEL || "gpt-4.1",
  ryanUserId: process.env.RYAN_USER_ID || "jeff",
  ryanThreadId: process.env.RYAN_THREAD_ID || "redo-ryan-main",
  port: optionalNumber("PORT", 5055),
};

export function envStatus() {
  return {
    openAiConfigured: Boolean(process.env.OPENAI_API_KEY),
    zepConfigured: Boolean(process.env.ZEP_API_KEY),
    defaultUserId: env.ryanUserId,
    defaultThreadId: env.ryanThreadId,
    model: env.openAiModel,
    port: env.port,
  };
}
