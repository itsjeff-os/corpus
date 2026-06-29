import dotenv from "dotenv";

dotenv.config();

export interface AppConfig {
  port: number;
  ledgerPath: string;
  defaultAuthorization: "READ_ONLY";
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 8791),
    ledgerPath: process.env.ACP_LEDGER_PATH ?? "./data/ledger.jsonl",
    defaultAuthorization: "READ_ONLY"
  };
}
