export interface ChatPayload {
  message: string;
  sessionId: string;
  userId?: string;
}

export interface ProcessingContext {
  constraints: Record<string, unknown>;
  memoryDegraded: boolean;
  transcriptionUsed: boolean;
}

export interface Bindings {
  AI: Ai;
  ZEP_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  OPENAI_API_KEY: string;
}

export interface ControlPlaneState {
  sessionId: string;
  constraints: Record<string, unknown>;
  permissions: Record<string, unknown>;
  updatedAt?: string;
}

export interface ZepMemoryResult {
  context: string;
  degraded: boolean;
}

export interface EngineResult {
  reply: string;
  context: ProcessingContext;
}
