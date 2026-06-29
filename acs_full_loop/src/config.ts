import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  openaiApiKey: requireEnv("OPENAI_API_KEY"),
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-5.5",
  supabaseUrl: requireEnv("SUPABASE_URL"),
  supabaseServiceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  zepApiUrl: process.env.ZEP_API_URL,
  zepApiKey: process.env.ZEP_API_KEY,
  chromaUrl: process.env.CHROMA_URL,
  chromaCollection: process.env.CHROMA_COLLECTION ?? "assistant_protocols",
  port: Number(process.env.PORT ?? "3000")
};
