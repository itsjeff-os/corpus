import { env } from "../config/env.js";

export interface SupabaseStatus {
  configured: boolean;
  connected: boolean;
  acsRestExposed: boolean;
  contextFunction: EdgeFunctionStatus;
  approvalGateFunction: EdgeFunctionStatus;
  schema: string;
  urlConfigured: boolean;
  keyConfigured: boolean;
  functionJwtConfigured: boolean;
  runtimeUserIdConfigured: boolean;
  serviceJwtAvailable: boolean;
  checkedAt: string;
  error?: string;
}

export interface EdgeFunctionStatus {
  configured: boolean;
  reachable: boolean;
  authenticated: boolean;
  status?: number;
  error?: string;
}

export interface RuntimeSupabaseContext {
  status: "available" | "degraded" | "not_configured";
  source: "supabase_context_edge_function";
  chatId: string;
  data: unknown;
  error?: string;
}

export interface ApprovalGateResult {
  status: "available" | "degraded" | "not_configured";
  source: "supabase_approval_gate_edge_function" | "supabase_runtime_event_edge_function";
  data: unknown;
  error?: string;
}

export class SupabaseStore {
  private serviceJwt: string | null = null;

  isConfigured(): boolean {
    return Boolean(env.supabaseUrl && env.supabaseKey);
  }

  async status(): Promise<SupabaseStatus> {
    const base = {
      configured: this.isConfigured(),
      connected: false,
      acsRestExposed: false,
      contextFunction: { configured: Boolean(env.supabaseUrl), reachable: false, authenticated: false },
      approvalGateFunction: { configured: Boolean(env.supabaseUrl), reachable: false, authenticated: false },
      schema: env.supabaseSchema,
      urlConfigured: Boolean(env.supabaseUrl),
      keyConfigured: Boolean(env.supabaseKey),
      functionJwtConfigured: Boolean(env.supabaseFunctionJwt),
      runtimeUserIdConfigured: Boolean(env.supabaseRuntimeUserId),
      serviceJwtAvailable: Boolean(env.supabaseFunctionJwt),
      checkedAt: new Date().toISOString()
    };

    if (!env.supabaseUrl || !env.supabaseKey) return base;

    try {
      const response = await fetch(`${env.supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: env.supabaseKey,
          authorization: `Bearer ${env.supabaseKey}`
        }
      });

      if (!response.ok) {
        return {
          ...base,
          error: `Supabase check failed: ${response.status} ${response.statusText}`
        };
      }

      const acsResponse = await fetch(`${env.supabaseUrl}/rest/v1/strategy_library?select=id&limit=1`, {
        headers: {
          apikey: env.supabaseKey,
          authorization: `Bearer ${env.supabaseKey}`,
          "accept-profile": env.supabaseSchema
        }
      });

      return {
        ...base,
        connected: true,
        acsRestExposed: acsResponse.ok,
        serviceJwtAvailable: Boolean(await this.resolveFunctionJwt()),
        contextFunction: await this.checkEdgeFunction("context", "GET", "chat_id=runtime-core-v1"),
        approvalGateFunction: await this.checkEdgeFunction("approval-gate", "POST")
      };
    } catch (error) {
      return {
        ...base,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async getContext(chatId: string): Promise<RuntimeSupabaseContext> {
    if (!env.supabaseUrl) {
      return {
        status: "not_configured",
        source: "supabase_context_edge_function",
        chatId,
        data: null,
        error: "RUNTIME_CORE_SUPABASE_URL is not configured"
      };
    }

    const response = await this.callEdgeFunction("context", {
      method: "GET",
      query: `chat_id=${encodeURIComponent(chatId)}`
    });

    return {
      status: response.ok ? "available" : "degraded",
      source: "supabase_context_edge_function",
      chatId,
      data: response.data,
      error: response.ok ? undefined : response.error
    };
  }

  async requestApproval(input: unknown): Promise<ApprovalGateResult> {
    if (!env.supabaseUrl) {
      return {
        status: "not_configured",
        source: "supabase_approval_gate_edge_function",
        data: null,
        error: "RUNTIME_CORE_SUPABASE_URL is not configured"
      };
    }

    const response = await this.callEdgeFunction("approval-gate", {
      method: "POST",
      body: input
    });

    return {
      status: response.ok ? "available" : "degraded",
      source: "supabase_approval_gate_edge_function",
      data: response.data,
      error: response.ok ? undefined : response.error
    };
  }

  async logTurn(input: {
    chatId: string;
    project?: string | null;
    role: string;
    message: string;
    metadata?: Record<string, unknown>;
    eventType?: string;
    payload?: unknown;
  }): Promise<ApprovalGateResult> {
    const response = await this.callEdgeFunction("runtime-event-v2", {
      method: "POST",
      body: {
        operation: "log_turn",
        chat_id: input.chatId,
        project: input.project ?? null,
        role: input.role,
        message: input.message,
        metadata: input.metadata ?? {},
        event_type: input.eventType ?? "message_created",
        payload: input.payload ?? {}
      }
    });

    return {
      status: response.ok ? "available" : "degraded",
      source: "supabase_runtime_event_edge_function",
      data: response.data,
      error: response.ok ? undefined : response.error
    };
  }

  private async checkEdgeFunction(name: string, method: "GET" | "POST", query = ""): Promise<EdgeFunctionStatus> {
    const response = await this.callEdgeFunction(name, { method, query });
    const authenticated = response.status !== 0 && response.status !== 401 && response.status !== 403;

    return {
      configured: Boolean(env.supabaseUrl),
      reachable: response.status !== 0,
      authenticated,
      status: response.status || undefined,
      error: response.ok || (authenticated && response.status === 400) ? undefined : response.error
    };
  }

  private async callEdgeFunction(
    name: string,
    options: { method: "GET" | "POST"; query?: string; body?: unknown }
  ): Promise<{ ok: boolean; status: number; data: unknown; error?: string }> {
    if (!env.supabaseUrl) {
      return { ok: false, status: 0, data: null, error: "RUNTIME_CORE_SUPABASE_URL is not configured" };
    }

    const jwt = await this.resolveFunctionJwt();
    if (!jwt) {
      return {
        ok: false,
        status: 0,
        data: null,
        error: "Supabase Edge Function JWT or service JWT path is not configured"
      };
    }

    try {
      const query = options.query ? `?${options.query}` : "";
      const response = await fetch(`${env.supabaseUrl}/functions/v1/${name}${query}`, {
        method: options.method,
        headers: {
          apikey: jwt,
          authorization: `Bearer ${jwt}`,
          "content-type": "application/json",
          ...(env.supabaseRuntimeUserId ? { "x-runtime-core-user-id": env.supabaseRuntimeUserId } : {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      const text = await response.text();
      let data: unknown = text;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      return {
        ok: response.ok,
        status: response.status,
        data,
        error: response.ok ? undefined : `${response.status} ${response.statusText}`
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async resolveFunctionJwt(): Promise<string | undefined> {
    if (env.supabaseFunctionJwt) return env.supabaseFunctionJwt;
    if (this.serviceJwt) return this.serviceJwt;
    if (!env.supabaseAccessToken || !env.supabaseProjectRef) return env.supabaseKey?.includes(".") ? env.supabaseKey : undefined;

    try {
      const response = await fetch(`https://api.supabase.com/v1/projects/${env.supabaseProjectRef}/api-keys`, {
        headers: {
          authorization: `Bearer ${env.supabaseAccessToken}`
        }
      });
      if (!response.ok) return undefined;
      const keys = await response.json() as Array<{ name: string; api_key?: string }>;
      this.serviceJwt = keys.find((key) => key.name === "service_role")?.api_key ?? null;
      return this.serviceJwt ?? undefined;
    } catch {
      return undefined;
    }
  }
}
