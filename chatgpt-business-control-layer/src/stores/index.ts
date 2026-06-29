import type { AppEnv } from "../config/env";
import type { ControlStore } from "./controlStore";
import { MemoryControlStore } from "./memoryControlStore";
import { PostgresControlStore } from "./postgresControlStore";

export function createControlStore(env: AppEnv): ControlStore {
  if (env.DATABASE_URL) {
    return new PostgresControlStore(env.DATABASE_URL);
  }

  if (env.ALLOW_MEMORY_STORE) {
    return new MemoryControlStore();
  }

  throw new Error("DATABASE_URL is required unless ALLOW_MEMORY_STORE=true.");
}
