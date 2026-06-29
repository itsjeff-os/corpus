import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { z } from "zod";
import { env, envStatus } from "./config/env.js";
import { ZepMemoryService } from "./memory/zepMemory.js";
import { buildContextBundle } from "./runtime/context.js";
import { defaultGateScaffold, gateInputSchema, runGates } from "./runtime/gates.js";
import { deriveReasoningRuntime, deriveRuntimeDecision } from "./runtime/router.js";
import { MemoryStore } from "./storage/memoryStore.js";
import { SupabaseStore } from "./storage/supabaseStore.js";
import {
  createEmptyGraph,
  reasoningGraphCoreJsonSchema,
  reasoningGraphCoreSchema,
  validateReasoningGraphCore
} from "./reasoning/graphCore.js";

const store = new MemoryStore();
const zepMemory = new ZepMemoryService();
const supabase = new SupabaseStore();
const app = new Hono();

const graphEnvelopeSchema = z.object({
  graph: reasoningGraphCoreSchema.optional()
}).strict();

const logTurnSchema = z.object({
  user_id: z.string().optional(),
  chat_id: z.string().optional(),
  project: z.string().optional(),
  role: z.enum(["user", "assistant", "system", "tool"]),
  message: z.string().min(1),
  graph: reasoningGraphCoreSchema.optional(),
  metadata: z.record(z.unknown()).optional()
}).strict();

const snapshotSessionSchema = z.object({
  session_id: z.string().min(1),
  graph: reasoningGraphCoreSchema.optional(),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
}).strict();

const proposeUpdateSchema = z.object({
  proposal_type: z.string().min(1),
  payload: z.record(z.unknown()),
  basis: z.array(z.string()).optional()
}).strict();

const approvalRequestSchema = z.object({
  action_name: z.string().min(1),
  action_payload: z.record(z.unknown()).optional(),
  rationale: z.string().optional(),
  risk_level: z.enum(["low", "medium", "high"]).default("medium")
}).strict();

const memoryContextSchema = z.object({
  user_id: z.string().optional(),
  thread_id: z.string().optional(),
  message: z.string().optional()
}).strict();

const memoryMessageSchema = z.object({
  user_id: z.string().optional(),
  thread_id: z.string().optional(),
  role: z.enum(["user", "assistant", "system", "tool"]),
  name: z.string().optional(),
  content: z.string().min(1),
  return_context: z.boolean().optional()
}).strict();

const memoryTurnSchema = z.object({
  user_id: z.string().optional(),
  thread_id: z.string().optional(),
  user_message: z.string().min(1),
  assistant_message: z.string().min(1)
}).strict();

const memorySeedSchema = z.object({
  user_id: z.string().optional(),
  thread_id: z.string().optional()
}).strict();

app.use("*", async (c, next) => {
  if (c.req.path === "/health") return next();
  if (!env.codexRuntimeToken) return next();

  const expected = `Bearer ${env.codexRuntimeToken}`;
  if (c.req.header("authorization") !== expected) {
    return c.json({ ok: false, error: "unauthorized" }, 401);
  }

  return next();
});

app.get("/health", async (c) => {
  return c.json({
    ok: true,
    service: "runtime-core-v1",
    version: "0.1.0",
    storage: supabase.isConfigured() ? "supabase_available" : "memory_only",
    supabase: await supabase.status(),
    ...envStatus()
  });
});

app.get("/context", async (c) => {
  const chatId = c.req.query("chat_id") ?? env.codexThreadId;
  const zep = zepMemory.isConfigured()
    ? await zepMemory.getContext({})
    : { status: "not_configured", configured: false };

  return c.json(buildContextBundle(
    store.getGraph(),
    zep,
    await supabase.status(),
    await supabase.getContext(chatId)
  ));
});

app.post("/log-turn", async (c) => {
  const parsed = logTurnSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  if (parsed.data.graph) {
    const validation = validateReasoningGraphCore(parsed.data.graph);
    if (!validation.ok) return c.json({ ok: false, errors: validation.errors }, 400);
    store.setGraph(parsed.data.graph);
  }

  const event = store.addEvent("turn_logged", parsed.data);
  const supabaseWrite = await supabase.logTurn({
    chatId: parsed.data.chat_id ?? env.codexThreadId,
    project: parsed.data.project ?? null,
    role: parsed.data.role,
    message: parsed.data.message,
    metadata: parsed.data.metadata,
    eventType: "message_created",
    payload: parsed.data
  });

  return c.json({ ok: true, stored: "memory_only", event, supabase_write: supabaseWrite });
});

app.post("/snapshot-session", async (c) => {
  const parsed = snapshotSessionSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  if (parsed.data.graph) {
    const validation = validateReasoningGraphCore(parsed.data.graph);
    if (!validation.ok) return c.json({ ok: false, errors: validation.errors }, 400);
    store.setGraph(parsed.data.graph);
  }

  const event = store.addEvent("session_snapshot", parsed.data);
  return c.json({ ok: true, stored: "memory_only", event });
});

app.post("/propose-update", async (c) => {
  const parsed = proposeUpdateSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  const event = store.addEvent("update_proposed", parsed.data);
  return c.json({ ok: true, stored: "memory_only", event, status: "queued_for_future_persistence" });
});

app.post("/approval-request", async (c) => {
  const parsed = approvalRequestSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  const event = store.addEvent("approval_requested", {
    ...parsed.data,
    status: "pending"
  });
  const gate = await supabase.requestApproval({
    operation: "request",
    ...parsed.data,
    chat_id: env.codexThreadId,
    source: "runtime-core-v1",
    event_id: event.id
  });

  return c.json({ ok: true, stored: "memory_only", event, status: "pending", approval_gate: gate });
});

app.post("/reasoning/validate", async (c) => {
  const body = await c.req.json();
  const graph = "graph" in body ? body.graph : body;
  return c.json(validateReasoningGraphCore(graph));
});

app.get("/reasoning/schema", (c) => {
  return c.json(reasoningGraphCoreJsonSchema);
});

app.post("/runtime/derive", async (c) => {
  const parsed = graphEnvelopeSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  const graph = parsed.data.graph ?? store.getGraph();
  if (graph) {
    const validation = validateReasoningGraphCore(graph);
    if (!validation.ok) return c.json({ ok: false, errors: validation.errors }, 400);
    store.setGraph(graph);
  }

  return c.json({
    ok: true,
    reasoning_runtime: deriveReasoningRuntime(graph),
    router_decision: deriveRuntimeDecision(graph)
  });
});

app.post("/runtime/new-graph", async (c) => {
  const body = z.object({
    domain: z.string().default("assistant_cognitive_runtime"),
    subject: z.string().default("scratch_runtime")
  }).partial().safeParse(await c.req.json().catch(() => ({})));

  if (!body.success) return c.json({ ok: false, errors: body.error.issues }, 400);
  const graph = createEmptyGraph(
    body.data.domain ?? "assistant_cognitive_runtime",
    body.data.subject ?? "scratch_runtime"
  );
  store.setGraph(graph);
  return c.json({ ok: true, graph });
});

app.post("/runtime/gates/evaluate", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = gateInputSchema.safeParse(body);
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  return c.json(runGates(parsed.data, defaultGateScaffold));
});

app.post("/memory/context", async (c) => {
  const parsed = memoryContextSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  return c.json(await zepMemory.getContext({
    userId: parsed.data.user_id,
    threadId: parsed.data.thread_id,
    message: parsed.data.message
  }));
});

app.post("/memory/message", async (c) => {
  const parsed = memoryMessageSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  return c.json(await zepMemory.addMessage({
    userId: parsed.data.user_id,
    threadId: parsed.data.thread_id,
    role: parsed.data.role,
    name: parsed.data.name,
    content: parsed.data.content,
    returnContext: parsed.data.return_context
  }));
});

app.post("/memory/turn", async (c) => {
  const parsed = memoryTurnSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  return c.json(await zepMemory.addTurn({
    userId: parsed.data.user_id,
    threadId: parsed.data.thread_id,
    userMessage: parsed.data.user_message,
    assistantMessage: parsed.data.assistant_message
  }));
});

app.post("/memory/seed", async (c) => {
  const parsed = memorySeedSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ ok: false, errors: parsed.error.issues }, 400);

  return c.json(await zepMemory.seed({
    userId: parsed.data.user_id,
    threadId: parsed.data.thread_id
  }));
});

serve({ fetch: app.fetch, port: env.port }, () => {
  console.log(`runtime-core-v1 listening on ${env.port}`);
});
