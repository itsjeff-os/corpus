import type { ReasoningGraphCore } from "../reasoning/graphCore.js";
import type { RuntimeSupabaseContext } from "../storage/supabaseStore.js";
import type { SupabaseStatus } from "../storage/supabaseStore.js";
import { deriveReasoningRuntime, deriveRuntimeDecision } from "./router.js";

export function buildContextBundle(
  graph: ReasoningGraphCore | null,
  zepContext: unknown = { status: "not_wired" },
  supabase: SupabaseStatus | null = null,
  supabaseContext: RuntimeSupabaseContext | null = null
) {
  const reasoning_runtime = deriveReasoningRuntime(graph);
  const router_decision = deriveRuntimeDecision(graph);

  return {
    cognitive_state: {
      status: "scaffold",
      storage: supabase?.connected ? "supabase_connected" : "memory_only"
    },
    metacognitive_context: {
      source: "supabase",
      status: supabase ?? { configured: false, connected: false },
      context: supabaseContext
    },
    assistant_state: {
      current_mode: router_decision.mode,
      permission_state: "suggest_only",
      visible_epistemics: router_decision.visible_epistemics,
      reasoning_graph_depth: router_decision.reasoning_graph_depth
    },
    reasoning_runtime,
    router_decision,
    zep_context: zepContext,
    chroma_retrieval: {
      status: "not_wired"
    },
    strategies: [
      {
        name: "start_with_reality",
        move: "Begin from directly given observations before abstracting."
      },
      {
        name: "derive_interpretation_before_conclusion",
        move: "Make the framing explicit, derive an inference, then stand on a conclusion."
      },
      {
        name: "return_to_operational_pattern",
        move: "Use challenged or contested graph state to repair the response path."
      }
    ],
    constraints: [
      {
        name: "reasoning_graph_core_v1_1",
        rule: "Reasoning core has only observation, interpretation, inference, and conclusion nodes."
      },
      {
        name: "no_action_from_silence",
        rule: "Actions require explicit approval outside this scaffold."
      }
    ],
    governance: {
      allowed: ["infer", "suggest", "summarise", "compare", "validate_graph"],
      blocked: ["external_action", "durable_write_without_storage_adapter", "model_call_without_explicit_adapter"],
      requires_explicit_approval: true
    }
  };
}
