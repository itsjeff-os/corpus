import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),

  OPENAI_API_KEY: required("OPENAI_API_KEY"),
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-5.4",

  ZEP_API_KEY: required("ZEP_API_KEY"),

  // Optional app-level limits
  MAX_CONTEXT_CHARS: Number(process.env.MAX_CONTEXT_CHARS || 4000)
};
