export interface Env {
  AUTOMATIONS: KVNamespace;
  ADMIN_TOKEN: string;
  OPENAI_API_KEY: string;
  OPENAI_MODEL?: string;
  DEFAULT_TARGET?: "node_red" | "home_assistant";
  NODE_RED_BASE_URL?: string;
  NODE_RED_TOKEN?: string;
  NODE_RED_DEPLOYMENT_TYPE?: "full" | "nodes" | "flows" | "reload";
  HOME_ASSISTANT_BASE_URL?: string;
  HOME_ASSISTANT_TOKEN?: string;
}

type Target = "node_red" | "home_assistant";
type Risk = "low" | "medium" | "high";
type Status = "draft" | "approved" | "deployed" | "failed" | "rolled_back";

type AutomationSpec = {
  name: string;
  intent: string;
  target: Target;
  risk_level: Risk;
  requires_approval: true;
  trigger: Record<string, unknown>;
  conditions: Array<Record<string, unknown>>;
  actions: Array<Record<string, unknown>>;
  safety: {
    max_frequency?: string;
    quiet_hours?: string;
    requires_fresh_approval?: boolean;
    rollback_strategy: "disable" | "delete" | "manual";
  };
  node_red?: {
    flow_label: string;
    nodes: Array<Record<string, unknown>>;
  };
  home_assistant?: {
    automation: Record<string, unknown>;
  };
};

type AutomationRecord = {
  id: string;
  status: Status;
  spec: AutomationSpec;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  deployed_at?: string;
  deployment?: Record<string, unknown>;
  error?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "authorization,content-type"
    }
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") return json({ ok: true });

    const url = new URL(request.url);
    try {
      if (url.pathname === "/health") return json({ ok: true, service: "automation-forge-worker" });
      await requireAuth(request, env);

      if (url.pathname === "/draft" && request.method === "POST") return draft(request, env);
      if (url.pathname === "/approve" && request.method === "POST") return approve(request, env);
      if (url.pathname === "/deploy" && request.method === "POST") return deploy(request, env);
      if (url.pathname === "/rollback" && request.method === "POST") return rollback(request, env);
      if (url.pathname === "/automations" && request.method === "GET") return list(env);
      if (url.pathname.startsWith("/automations/") && request.method === "GET") {
        const id = url.pathname.split("/")[2];
        return get(id, env);
      }
      return json({ error: "not_found" }, 404);
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown_error";
      const status = message === "unauthorized" ? 401 : message === "bad_request" ? 400 : 500;
      return json({ error: message }, status);
    }
  }
};

async function requireAuth(request: Request, env: Env) {
  const header = request.headers.get("authorization") || "";
  const expected = `Bearer ${env.ADMIN_TOKEN}`;
  if (!env.ADMIN_TOKEN || header !== expected) throw new Error("unauthorized");
}

async function draft(request: Request, env: Env) {
  const body = await readJson(request);
  const target = coerceTarget(body.target || env.DEFAULT_TARGET || "node_red");
  const spec = body.spec ? validateSpec(body.spec) : await generateSpec(String(body.intent || ""), target, env);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const record: AutomationRecord = { id, status: "draft", spec, created_at: now, updated_at: now };
  await putRecord(env, record);
  return json({ ok: true, record });
}

async function approve(request: Request, env: Env) {
  const { id } = await readJson(request);
  const record = await mustGetRecord(env, String(id));
  if (record.status !== "draft") throw new Error("only_drafts_can_be_approved");
  record.status = "approved";
  record.approved_at = new Date().toISOString();
  record.updated_at = record.approved_at;
  await putRecord(env, record);
  return json({ ok: true, record });
}

async function deploy(request: Request, env: Env) {
  const { id } = await readJson(request);
  const record = await mustGetRecord(env, String(id));
  if (record.status !== "approved") throw new Error("deployment_requires_approved_status");
  enforcePolicy(record.spec);

  try {
    const deployment = record.spec.target === "node_red"
      ? await deployNodeRed(record.spec, env)
      : await deployHomeAssistant(record.spec, env);
    const now = new Date().toISOString();
    record.status = "deployed";
    record.deployed_at = now;
    record.updated_at = now;
    record.deployment = deployment;
    await putRecord(env, record);
    return json({ ok: true, record });
  } catch (err) {
    record.status = "failed";
    record.error = err instanceof Error ? err.message : "deployment_failed";
    record.updated_at = new Date().toISOString();
    await putRecord(env, record);
    return json({ ok: false, record }, 500);
  }
}

async function rollback(request: Request, env: Env) {
  const { id } = await readJson(request);
  const record = await mustGetRecord(env, String(id));
  if (record.status !== "deployed") throw new Error("only_deployed_records_can_be_rolled_back");
  if (record.spec.target === "node_red") await rollbackNodeRed(record, env);
  if (record.spec.target === "home_assistant") await rollbackHomeAssistant(record, env);
  record.status = "rolled_back";
  record.updated_at = new Date().toISOString();
  await putRecord(env, record);
  return json({ ok: true, record });
}

async function list(env: Env) {
  const keys = await env.AUTOMATIONS.list({ prefix: "automation:" });
  const records = await Promise.all(keys.keys.map(k => env.AUTOMATIONS.get<AutomationRecord>(k.name, "json")));
  return json({ ok: true, records: records.filter(Boolean) });
}

async function get(id: string, env: Env) {
  return json({ ok: true, record: await mustGetRecord(env, id) });
}

async function deployNodeRed(spec: AutomationSpec, env: Env) {
  if (!env.NODE_RED_BASE_URL || !env.NODE_RED_TOKEN) throw new Error("missing_node_red_config");
  if (!spec.node_red?.nodes?.length) throw new Error("missing_node_red_nodes");

  const previous = await fetch(`${trim(env.NODE_RED_BASE_URL)}/flows`, {
    headers: { authorization: `Bearer ${env.NODE_RED_TOKEN}` }
  });
  if (!previous.ok) throw new Error(`node_red_fetch_failed_${previous.status}`);
  const previousFlows = await previous.json() as { flows?: unknown[] } | unknown[];
  const flows = Array.isArray(previousFlows) ? previousFlows : previousFlows.flows || [];

  const tabId = `forge_${stableId(spec.name)}`;
  const generated = [
    { id: tabId, type: "tab", label: spec.node_red.flow_label || spec.name, disabled: false, info: spec.intent },
    ...spec.node_red.nodes.map(n => ({ ...n, z: tabId }))
  ];

  const nextFlows = [...flows.filter((n: any) => n.id !== tabId && n.z !== tabId), ...generated];
  const res = await fetch(`${trim(env.NODE_RED_BASE_URL)}/flows`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.NODE_RED_TOKEN}`,
      "content-type": "application/json",
      "Node-RED-API-Version": "v2",
      "Node-RED-Deployment-Type": env.NODE_RED_DEPLOYMENT_TYPE || "flows"
    },
    body: JSON.stringify({ flows: nextFlows })
  });
  if (!res.ok) throw new Error(`node_red_deploy_failed_${res.status}_${await res.text()}`);
  return { target: "node_red", tab_id: tabId, deployed_nodes: generated.length };
}

async function deployHomeAssistant(spec: AutomationSpec, env: Env) {
  if (!env.HOME_ASSISTANT_BASE_URL || !env.HOME_ASSISTANT_TOKEN) throw new Error("missing_home_assistant_config");
  const automation = spec.home_assistant?.automation;
  if (!automation) throw new Error("missing_home_assistant_automation");

  // Production-safe default: create/update via a helper webhook or script endpoint you control.
  // Home Assistant's public REST API can call services reliably, but writing YAML/config directly
  // should be done through your own HA-side package, AppDaemon, shell_command, or Node-RED bridge.
  const res = await fetch(`${trim(env.HOME_ASSISTANT_BASE_URL)}/api/services/automation/reload`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.HOME_ASSISTANT_TOKEN}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({})
  });
  if (!res.ok) throw new Error(`home_assistant_reload_failed_${res.status}_${await res.text()}`);
  return { target: "home_assistant", note: "validated spec; called automation.reload. Wire HA config writing through Node-RED, AppDaemon, or a controlled HA add-on endpoint." };
}

async function rollbackNodeRed(record: AutomationRecord, env: Env) {
  if (!env.NODE_RED_BASE_URL || !env.NODE_RED_TOKEN) throw new Error("missing_node_red_config");
  const tabId = String(record.deployment?.tab_id || "");
  if (!tabId) return;
  const got = await fetch(`${trim(env.NODE_RED_BASE_URL)}/flows`, { headers: { authorization: `Bearer ${env.NODE_RED_TOKEN}` } });
  if (!got.ok) throw new Error(`node_red_fetch_failed_${got.status}`);
  const payload = await got.json() as { flows?: unknown[] } | unknown[];
  const flows = Array.isArray(payload) ? payload : payload.flows || [];
  const nextFlows = flows.filter((n: any) => n.id !== tabId && n.z !== tabId);
  const res = await fetch(`${trim(env.NODE_RED_BASE_URL)}/flows`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.NODE_RED_TOKEN}`,
      "content-type": "application/json",
      "Node-RED-API-Version": "v2",
      "Node-RED-Deployment-Type": env.NODE_RED_DEPLOYMENT_TYPE || "flows"
    },
    body: JSON.stringify({ flows: nextFlows })
  });
  if (!res.ok) throw new Error(`node_red_rollback_failed_${res.status}_${await res.text()}`);
}

async function rollbackHomeAssistant(_record: AutomationRecord, _env: Env) {
  // Intentionally no destructive default. Implement only once your HA-side adapter exists.
  return;
}

async function generateSpec(intent: string, target: Target, env: Env): Promise<AutomationSpec> {
  if (!intent.trim()) throw new Error("intent_required");
  if (!env.OPENAI_API_KEY) throw new Error("missing_openai_api_key");

  const schemaHint = `Return only JSON matching this TypeScript shape: AutomationSpec = { name:string; intent:string; target:"node_red"|"home_assistant"; risk_level:"low"|"medium"|"high"; requires_approval:true; trigger:object; conditions:object[]; actions:object[]; safety:{max_frequency?:string; quiet_hours?:string; requires_fresh_approval?:boolean; rollback_strategy:"disable"|"delete"|"manual"}; node_red?:{flow_label:string; nodes:object[]}; home_assistant?:{automation:object} }. For Node-RED, emit valid nodes for a self-contained flow. Never include credentials. Use safe defaults.`;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.1",
      input: [
        { role: "developer", content: [{ type: "input_text", text: schemaHint }] },
        { role: "user", content: [{ type: "input_text", text: `Target: ${target}\nIntent: ${intent}` }] }
      ]
    })
  });
  if (!res.ok) throw new Error(`openai_failed_${res.status}_${await res.text()}`);
  const data = await res.json() as any;
  const text = data.output_text || data.output?.flatMap((o: any) => o.content || []).map((c: any) => c.text || "").join("\n");
  const parsed = JSON.parse(extractJson(text));
  return validateSpec(parsed);
}

function validateSpec(input: any): AutomationSpec {
  if (!input || typeof input !== "object") throw new Error("bad_request");
  const spec = input as AutomationSpec;
  if (!spec.name || !spec.intent) throw new Error("spec_requires_name_and_intent");
  spec.target = coerceTarget(spec.target);
  if (!["low", "medium", "high"].includes(spec.risk_level)) throw new Error("invalid_risk_level");
  if (spec.requires_approval !== true) throw new Error("approval_must_be_required");
  if (!Array.isArray(spec.conditions)) spec.conditions = [];
  if (!Array.isArray(spec.actions) || spec.actions.length === 0) throw new Error("spec_requires_actions");
  if (!spec.safety?.rollback_strategy) throw new Error("spec_requires_rollback_strategy");
  if (spec.target === "node_red" && !spec.node_red?.nodes?.length) throw new Error("node_red_target_requires_nodes");
  if (spec.target === "home_assistant" && !spec.home_assistant?.automation) throw new Error("ha_target_requires_automation");
  return spec;
}

function enforcePolicy(spec: AutomationSpec) {
  if (spec.risk_level === "high" && !spec.safety.requires_fresh_approval) throw new Error("high_risk_requires_fresh_approval_flag");
  const dangerous = JSON.stringify(spec).toLowerCase();
  for (const term of ["unlock", "payment", "bank", "purchase", "delete all", "disable alarm"]) {
    if (dangerous.includes(term) && spec.risk_level !== "high") throw new Error(`dangerous_action_must_be_high_risk_${term}`);
  }
}

async function readJson(request: Request) {
  try { return await request.json() as any; } catch { throw new Error("bad_request"); }
}

async function putRecord(env: Env, record: AutomationRecord) {
  await env.AUTOMATIONS.put(`automation:${record.id}`, JSON.stringify(record));
}

async function mustGetRecord(env: Env, id: string): Promise<AutomationRecord> {
  const record = await env.AUTOMATIONS.get<AutomationRecord>(`automation:${id}`, "json");
  if (!record) throw new Error("automation_not_found");
  return record;
}

function coerceTarget(value: unknown): Target {
  if (value === "node_red" || value === "home_assistant") return value;
  throw new Error("invalid_target");
}

function trim(url: string) { return url.replace(/\/$/, ""); }
function stableId(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16);
}
function extractJson(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("model_returned_no_json");
  return text.slice(start, end + 1);
}
