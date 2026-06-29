import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";
import type {
  ExplicitSignals,
  MetacognitiveContext,
  RuntimeIdentity,
  SignalGovernanceResult
} from "../types.js";

export const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
  auth: { persistSession: false }
});

function projectFilter(project?: string | null): string {
  return project ? `project.eq.${project},project.is.null` : "project.is.null";
}

export async function getRecentMessages(identity: RuntimeIdentity, limit = 12): Promise<string[]> {
  const { data, error } = await supabase
    .from("conversation_history")
    .select("role,message")
    .eq("user_id", identity.userId)
    .eq("chat_id", identity.chatId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? [])
    .reverse()
    .map((row: { role: string; message: string }) => `${row.role}: ${row.message}`);
}

export async function insertConversationMessage(args: RuntimeIdentity & {
  role: "user" | "assistant" | "system";
  message: string;
  metadata?: Record<string, unknown>;
}): Promise<string | undefined> {
  const { data, error } = await supabase
    .from("conversation_history")
    .insert({
      user_id: args.userId,
      chat_id: args.chatId,
      project: args.project ?? null,
      role: args.role,
      message: args.message,
      metadata: args.metadata ?? {}
    })
    .select("id")
    .single();

  if (error) throw error;
  return data?.id;
}

export async function insertEvent(args: RuntimeIdentity & {
  event_type: string;
  payload: Record<string, unknown>;
  source_message_id?: string;
}): Promise<string | undefined> {
  const { data, error } = await supabase
    .from("events")
    .insert({
      user_id: args.userId,
      chat_id: args.chatId,
      project: args.project ?? null,
      event_type: args.event_type,
      payload: args.payload,
      source_message_id: args.source_message_id ?? null
    })
    .select("id")
    .single();

  if (error) throw error;
  return data?.id;
}

export async function getMetacognitiveContext(identity: RuntimeIdentity): Promise<MetacognitiveContext> {
  const { userId, chatId, project = null } = identity;

  const [assistantState, activeConstraints, strategies, recentStrategyUses, activeInferences, pendingApprovals] =
    await Promise.all([
      supabase
        .from("assistant_state")
        .select("*")
        .eq("user_id", userId)
        .eq("chat_id", chatId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("soft_constraints")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .or(projectFilter(project)),

      supabase
        .from("strategy_library")
        .select("*")
        .eq("status", "active"),

      supabase
        .from("strategy_uses")
        .select("*")
        .eq("user_id", userId)
        .eq("chat_id", chatId)
        .order("created_at", { ascending: false })
        .limit(10),

      supabase
        .from("inference_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("chat_id", chatId)
        .in("epistemic_stance", ["provisional", "likely", "confirmed"])
        .order("updated_at", { ascending: false })
        .limit(10),

      supabase
        .from("approval_requests")
        .select("*")
        .eq("user_id", userId)
        .eq("chat_id", chatId)
        .eq("status", "pending")
    ]);

  for (const result of [assistantState, activeConstraints, strategies, recentStrategyUses, activeInferences, pendingApprovals]) {
    if (result.error) throw result.error;
  }

  return {
    source: "supabase",
    assistant_state: assistantState.data ?? null,
    active_constraints: activeConstraints.data ?? [],
    available_strategies: strategies.data ?? [],
    recent_strategy_uses: recentStrategyUses.data ?? [],
    active_inferences: activeInferences.data ?? [],
    permission_state: {
      pending_approvals: pendingApprovals.data ?? [],
      rule: "external_action_requires_explicit_approval"
    },
    reflection_budget: {
      mode: (assistantState.data as Record<string, unknown> | null)?.reflection_depth ?? "light",
      flush_policy: "batch"
    }
  };
}

export async function insertSignalEvent(args: RuntimeIdentity & {
  source_message_id?: string;
  signal: SignalGovernanceResult;
}): Promise<string | undefined> {
  const explicit: ExplicitSignals = args.signal.explicit;

  const { data, error } = await supabase
    .from("signal_events")
    .insert({
      user_id: args.userId,
      chat_id: args.chatId,
      project: args.project ?? null,
      source_message_id: args.source_message_id ?? null,
      explicit_instructions: explicit.instructions,
      explicit_constraints: explicit.constraints,
      stated_intent: explicit.statedIntent,
      implicit_detected: args.signal.implicit.detected,
      implicit_actionable: args.signal.implicit.actionable,
      implicit_ignored: args.signal.implicit.ignored,
      operative_basis: args.signal.decision.operativeBasis,
      inference_operations_used: args.signal.implicit.actionable.length,
      response_effects: args.signal.decision.responseEffects,
      blocked_effects: args.signal.decision.blockedEffects,
      persistence_allowed: args.signal.decision.persistenceAllowed
    })
    .select("id")
    .single();

  if (error) throw error;
  return data?.id;
}

export async function insertCandidateUpdate(args: RuntimeIdentity & {
  candidate_type: string;
  content: string;
  target_system: "supabase" | "zep" | "chroma" | "none";
  target_entity?: string;
  source_message_ids?: string[];
  source_signal_event_id?: string;
  confidence?: number;
}): Promise<string | undefined> {
  const { data, error } = await supabase
    .from("candidate_updates")
    .insert({
      user_id: args.userId,
      chat_id: args.chatId,
      project: args.project ?? null,
      candidate_type: args.candidate_type,
      content: args.content,
      target_system: args.target_system,
      target_entity: args.target_entity ?? null,
      source_message_ids: args.source_message_ids ?? [],
      source_signal_event_id: args.source_signal_event_id ?? null,
      confidence: args.confidence ?? 0.5,
      status: "pending"
    })
    .select("id")
    .single();

  if (error) throw error;
  return data?.id;
}
