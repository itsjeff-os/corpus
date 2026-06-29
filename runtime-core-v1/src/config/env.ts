import dotenv from "dotenv";
import { createClient } from "@1password/sdk";

const dotenvResult = dotenv.config();
const dotenvValues = dotenvResult.parsed ?? {};
const DEFAULT_OP_ENVIRONMENT_ID = "vsl3suvn4s2dnekt6hr5fpykl4";

interface OnePasswordStatus {
  configured: boolean;
  loaded: boolean;
  environmentId: string;
  variableCount: number;
  error?: string;
}

interface OnePasswordLoadResult {
  values: Record<string, string>;
  status: OnePasswordStatus;
}

function rawValue(name: string): string | undefined {
  return dotenvValues[name] ?? process.env[name];
}

async function loadOnePasswordEnvironment(): Promise<OnePasswordLoadResult> {
  const environmentId = rawValue("OP_ENVIRONMENT_ID") ?? DEFAULT_OP_ENVIRONMENT_ID;
  const token = rawValue("OP_SERVICE_ACCOUNT_TOKEN");

  if (!token) {
    return {
      values: {},
      status: {
        configured: false,
        loaded: false,
        environmentId,
        variableCount: 0,
        error: "OP_SERVICE_ACCOUNT_TOKEN is not configured"
      }
    };
  }

  try {
    const client = await createClient({
      auth: token,
      integrationName: "itsjeff.org runtime-core-v1",
      integrationVersion: "v0.1.0"
    });
    const response = await client.environments.getVariables(environmentId);
    const values = Object.fromEntries(response.variables.map((variable) => [variable.name, variable.value]));

    return {
      values,
      status: {
        configured: true,
        loaded: true,
        environmentId,
        variableCount: response.variables.length
      }
    };
  } catch (error) {
    return {
      values: {},
      status: {
        configured: true,
        loaded: false,
        environmentId,
        variableCount: 0,
        error: error instanceof Error ? error.message : String(error)
      }
    };
  }
}

const onePassword = await loadOnePasswordEnvironment();

function optionalHeaderValue(name: string): string | undefined {
  const value = onePassword.values[name] ?? rawValue(name);
  if (!value) return undefined;

  const invalid = Array.from(value).find((char) => char.codePointAt(0)! > 255);
  if (invalid) {
    throw new Error(`${name} contains a non-ASCII character. Re-paste it without smart quotes or rich-text formatting.`);
  }

  return value;
}

function optionalNumber(name: string, fallback: number): number {
  const raw = onePassword.values[name] ?? rawValue(name);
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid numeric env var: ${name}`);
  return parsed;
}

export const env = {
  port: optionalNumber("PORT", 5061),
  codexRuntimeToken:
    optionalHeaderValue("RUNTIME_CORE_TOKEN")
    ?? optionalHeaderValue("CODEX_RUNTIME_TOKEN")
    ?? optionalHeaderValue("COGNITIVE_RUNTIME_TOKEN"),
  supabaseUrl:
    optionalHeaderValue("RUNTIME_CORE_SUPABASE_URL")
    ?? optionalHeaderValue("SUPABASE_URL")
    ?? optionalHeaderValue("SUPABASE_PROJECT_URL")
    ?? optionalHeaderValue("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseKey:
    optionalHeaderValue("RUNTIME_CORE_SUPABASE_SERVICE_ROLE_KEY")
    ?? optionalHeaderValue("RUNTIME_CORE_SUPABASE_ANON_KEY")
    ?? optionalHeaderValue("SUPABASE_SERVICE_ROLE_KEY")
    ?? optionalHeaderValue("SUPABASE_DEFAULT_SECRET_KEY")
    ?? optionalHeaderValue("SUPABASE_SERVICE_KEY")
    ?? optionalHeaderValue("SUPABASE_DEFAULT_PUBLISHABLE")
    ?? optionalHeaderValue("SUPABASE_ANON_KEY"),
  supabaseFunctionJwt:
    optionalHeaderValue("RUNTIME_CORE_SUPABASE_FUNCTION_JWT")
    ?? optionalHeaderValue("SUPABASE_FUNCTION_JWT")
    ?? optionalHeaderValue("SUPABASE_USER_JWT"),
  supabaseAccessToken: optionalHeaderValue("SUPABASE_ACCESS_TOKEN"),
  supabaseProjectRef:
    onePassword.values.RUNTIME_CORE_SUPABASE_PROJECT_REF
    ?? rawValue("RUNTIME_CORE_SUPABASE_PROJECT_REF")
    ?? "bxszabbhaidoxhzwyomt",
  supabaseRuntimeUserId:
    onePassword.values.RUNTIME_CORE_SUPABASE_USER_ID
    ?? rawValue("RUNTIME_CORE_SUPABASE_USER_ID"),
  supabaseSchema:
    onePassword.values.RUNTIME_CORE_SUPABASE_SCHEMA
    ?? rawValue("RUNTIME_CORE_SUPABASE_SCHEMA")
    ?? onePassword.values.SUPABASE_SCHEMA
    ?? rawValue("SUPABASE_SCHEMA")
    ?? "acs",
  codexZepApiKey: optionalHeaderValue("RUNTIME_CORE_ZEP_API_KEY") ?? optionalHeaderValue("CODEX_ZEP_API_KEY"),
  codexUserId:
    onePassword.values.RUNTIME_CORE_USER_ID
    ?? rawValue("RUNTIME_CORE_USER_ID")
    ?? onePassword.values.CODEX_USER_ID
    ?? rawValue("CODEX_USER_ID")
    ?? "jeff",
  codexThreadId:
    onePassword.values.RUNTIME_CORE_THREAD_ID
    ?? rawValue("RUNTIME_CORE_THREAD_ID")
    ?? onePassword.values.CODEX_THREAD_ID
    ?? rawValue("CODEX_THREAD_ID")
    ?? "runtime-core-v1",
  onePassword: onePassword.status
};

export function envStatus() {
  return {
    port: env.port,
    authConfigured: Boolean(env.codexRuntimeToken),
    supabaseConfigured: Boolean(env.supabaseUrl && env.supabaseKey),
    supabaseUrlConfigured: Boolean(env.supabaseUrl),
    supabaseKeyConfigured: Boolean(env.supabaseKey),
    supabaseFunctionJwtConfigured: Boolean(env.supabaseFunctionJwt),
    supabaseAccessTokenConfigured: Boolean(env.supabaseAccessToken),
    supabaseRuntimeUserIdConfigured: Boolean(env.supabaseRuntimeUserId),
    supabaseSchema: env.supabaseSchema,
    zepConfigured: Boolean(env.codexZepApiKey),
    defaultUserId: env.codexUserId,
    defaultThreadId: env.codexThreadId,
    onePassword: env.onePassword
  };
}
