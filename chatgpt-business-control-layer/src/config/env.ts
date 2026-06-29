import "dotenv/config";
import { z } from "zod";

const booleanString = z.enum(["true", "false"]).transform((value) => value === "true");

const envSchema = z.object({
  HOST: z.string().default("127.0.0.1"),
  PORT: z.coerce.number().int().positive().default(8788),
  MCP_PATH: z.string().default("/mcp"),
  APP_VERSION: z.string().default("control-v1"),
  OPENAI_MODEL: z.string().default("gpt-5.2"),
  OPENAI_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  ALLOW_MEMORY_STORE: booleanString.default(true),
  CHECKPOINT_INTERVAL_RUNS: z.coerce.number().int().positive().default(5),
  DEBUG_STORE_RAW_INPUT: booleanString.default(false),
  PRIVATE_SYSTEM_SCOPE: z.string().default("internal_notes.write"),
  PRIVATE_SYSTEM_ACTION_TYPE: z.string().default("create_internal_note"),
  PRIVATE_SYSTEM_WRITE_URL: z.string().optional(),
  PRIVATE_SYSTEM_BEARER_TOKEN: z.string().optional()
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}
