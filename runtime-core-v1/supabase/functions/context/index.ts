import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-runtime-core-user-id",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const publishableKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !publishableKey) return json({ error: "Supabase environment is not configured" }, 500);

  const url = new URL(req.url);
  const chatId = url.searchParams.get("chat_id");
  const project = url.searchParams.get("project");
  const limit = Number(url.searchParams.get("limit") ?? "8");
  if (!chatId) return json({ error: "chat_id is required" }, 400);

  const authorization = req.headers.get("Authorization") ?? "";
  const supabase = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
  });

  const userId = await resolveUserId(req, supabase);
  if (!userId) return json({ error: "Authentication required" }, 401);

  const { data, error } = await supabase.rpc("get_context_bundle", {
    p_user_id: userId,
    p_chat_id: chatId,
    p_project: project,
    p_limit: Number.isFinite(limit) ? Math.max(1, Math.min(limit, 25)) : 8,
  });
  if (error) return json({ error: error.message }, 500);
  return json(data, 200);
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
