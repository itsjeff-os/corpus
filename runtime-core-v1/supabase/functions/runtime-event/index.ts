const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-runtime-core-user-id",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !publishableKey) return json({ error: "Supabase environment is not configured" }, 500);

  const authorization = req.headers.get("Authorization") ?? "";
  const userId = await resolveUserId(req);
  if (!userId) return json({ error: "Authentication required" }, 401);

  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "JSON body is required" }, 400);

  const chatId = typeof body.chat_id === "string" && body.chat_id ? body.chat_id : "runtime-core-v1";
  const project = typeof body.project === "string" ? body.project : null;
  const role = typeof body.role === "string" ? body.role : null;
  const message = typeof body.message === "string" ? body.message : null;
  const metadata = isRecord(body.metadata) ? body.metadata : {};
  const eventType = typeof body.event_type === "string" && body.event_type ? body.event_type : "runtime_event";
  const payload = isRecord(body.payload) ? body.payload : {};

  const rpcResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/log_runtime_event`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      authorization,
      "content-type": "application/json",
    },
    body: JSON.stringify({
    p_user_id: userId,
    p_chat_id: chatId,
    p_project: project,
    p_role: role,
    p_message: message,
    p_metadata: metadata,
    p_event_type: eventType,
    p_payload: payload,
    }),
  });

  const text = await rpcResponse.text();
  const data = text ? JSON.parse(text) : null;
  if (!rpcResponse.ok) return json({ error: extractError(data) ?? rpcResponse.statusText }, 500);

  return json(data, 201);
});

async function resolveUserId(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  const role = decodeJwtPayload(auth.replace(/^Bearer\s+/i, ""))?.role;
  if (role === "service_role") {
    const runtimeUserId = req.headers.get("x-runtime-core-user-id");
    return isUuid(runtimeUserId) ? runtimeUserId : null;
  }

  return null;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isUuid(value: string | null): value is string {
  return Boolean(value?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i));
}

function extractError(data: unknown) {
  if (!isRecord(data)) return null;
  return typeof data.message === "string" ? data.message : null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
