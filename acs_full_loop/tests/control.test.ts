import { describe, expect, it } from "vitest";
import { applyGeneratorControls } from "../src/controls/generator-controls.js";
import { applySignalGovernance } from "../src/controls/signal-governance.js";
import type { RuntimeContext } from "../src/types.js";

function baseContext(message: string): RuntimeContext {
  const signal_governance = applySignalGovernance({ message, recentMessages: [] });
  return {
    identity: { userId: "00000000-0000-0000-0000-000000000001", chatId: "test", project: null },
    user_message: message,
    recent_messages: [],
    metacognitive_context: {
      source: "supabase",
      assistant_state: null,
      active_constraints: [],
      available_strategies: [],
      recent_strategy_uses: [],
      active_inferences: [],
      permission_state: { pending_approvals: [], rule: "external_action_requires_explicit_approval" },
      reflection_budget: null
    },
    conversational_context: { source: "zep", user_context: "", relevant_facts: [], recent_thread_summary: "" },
    semantic_context: { source: "chroma", retrieved_protocols: [], similar_examples: [], pattern_references: [] },
    signal_governance
  };
}

describe("generator controls", () => {
  it("blocks regeneration when completed build state is provided", () => {
    const controls = applyGeneratorControls(baseContext("Supabase has been created."));
    expect(controls.forbidden_generation_paths).toContain("regenerate_completed_build_state");
    expect(controls.active_controls.map((c) => c.name)).toContain("Build-State Lock");
  });

  it("treats humor as non-operational by default", () => {
    const signal = applySignalGovernance({ message: "lol", recentMessages: [] });
    expect(signal.implicit.detected.length).toBeGreaterThan(0);
    expect(signal.implicit.actionable.length).toBe(0);
    expect(signal.implicit.ignored[0].reason).toBe("humor_non_operational");
  });
});
