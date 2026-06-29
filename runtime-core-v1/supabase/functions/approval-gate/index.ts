import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-runtime-core-user-id",
};

type ApprovalBody = {
  operation?: "request" | "grant" | "deny";
  chat_id?: string | null;
  project?: string | null;
  action_name?: string;
  action_payload?: Record<string, unknown>;
  rationale?: string | null;
  risk_level?: "low" | "medium" | "high" | "critical";
  approval_request_id?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !publishableKey) return json({ error: "Supabase environment is not configured" }, 500);

  const authorization = req.headers.get("Authorization") ?? "";
  const supabase = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
  });

  const userId = await resolveUserId(req, supabase);
  if (!userId) return json({ error: "Authentication required" }, 401);

  const body = (await req.json().catch(() => null)) as ApprovalBody | null;
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "JSON body is required" }, 400);

  if (body.operation === "request") {
    if (!body.action_name) return json({ error: "action_name is required" }, 400);
    const { data, error } = await supabase.rpc("request_approval", {
      p_user_id: userId,
      p_chat_id: body.chat_id ?? null,
      p_project: body.project ?? null,
      p_action_name: body.action_name,
      p_action_payload: body.action_payload ?? {},
      p_rationale: body.rationale ?? null,
      p_risk_level: body.risk_level ?? "medium",
    });
    if (error) return json({ error: error.message }, 500);
    return json({ approval_request_id: data }, 201);
  }

  if (body.operation === "grant" || body.operation === "deny") {
    if (!body.approval_request_id) return json({ error: "approval_request_id is required" }, 400);
    const { data, error } = await supabase.rpc(
      body.operation === "grant" ? "grant_approval" : "deny_approval",
      { p_approval_request_id: body.approval_request_id, p_user_id: userId },
    );
    if (error) return json({ error: error.message }, 500);
    return json(data, 200);
  }

  return json({ error: "operation must be request, grant, or deny" }, 400);
});

async function resolveUserId(req: Request, supabase: ReturnType<typeof createClient>) {
  const auth = req.headers.get("Authorization") ?? "";
  const role = decodeJwtPayload(auth.replace(/^Bearer\s+/i, ""))?.role;
  if (role === "service_role") {
    const runtimeUserId = req.headers.get("x-runtime-core-user-id");
    return isUuid(runtimeUserId) ? runtimeUserId : null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  return error || !user ? null : user.id;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function isUuid(value: string | null): value is string {
  return Boolean(value?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i));
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
