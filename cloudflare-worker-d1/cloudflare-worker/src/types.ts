export interface Env {
  RUNTIME_DB: D1Database;
  REFLECTION_QUEUE: Queue;
  INGESTION_QUEUE: Queue;
  SYNC_QUEUE: Queue;
  SESSION_COORDINATOR: DurableObjectNamespace;
  TASK_COORDINATOR: DurableObjectNamespace;
  AI_GATEWAY_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  ZEP_API_KEY?: string;
  ZEP_API_URL?: string;
  CHROMA_API_KEY?: string;
  CHROMA_URL?: string;
  CHROMA_TENANT?: string;
  CHROMA_DATABASE?: string;
  CHROMA_HOME_HA_AUTOMATIONS_ID?: string;
  CHROMA_HOME_HA_REFERENCE_ID?: string;
  CHROMA_HOME_SYSTEM_DOCS_ID?: string;
  CHROMA_HOME_PATTERNS_RITUALS_ID?: string;
}

export interface RequestContext {
  userId: string;
  chatId: string;
  project?: string;
}
