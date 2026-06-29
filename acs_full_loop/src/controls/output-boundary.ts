import type { GeneratorControlDecision, ReasoningPayload } from "../types.js";

export type OutputBoundaryResult = {
  ok: boolean;
  finalText: string;
  violations: string[];
};

export function applyOutputBoundary(payload: ReasoningPayload, controls: GeneratorControlDecision): OutputBoundaryResult {
  const finalText = payload.response_text;
  const violations: string[] = [];

  if (!finalText || finalText.trim().length === 0) {
    violations.push("empty_response_text");
  }

  for (const forbidden of controls.forbidden_generation_paths) {
    if (containsForbiddenPath(finalText, forbidden)) {
      violations.push(`forbidden_generation_path_present:${forbidden}`);
    }
  }

  for (const required of controls.required_output_properties) {
    if (!payload.trace.active_controls.length) {
      violations.push(`required_property_untraceable:${required}`);
    }
  }

  return { ok: violations.length === 0, finalText, violations };
}

function containsForbiddenPath(text: string, path: string): boolean {
  const lower = text.toLowerCase();

  if (path === "regenerate_completed_build_state") {
    return lower.includes("create table") || lower.includes("create extension") || lower.includes("supabase schema");
  }

  if (path === "implicit_signal_driven_response_selection") {
    return lower.includes("you seem frustrated") || lower.includes("sounds like you");
  }

  if (path === "unauthorized_architectural_priority_selection") {
    return lower.includes("the main risk is") || lower.includes("the most relevant");
  }

  if (path === "output_layer_semantic_mutation") {
    return lower.includes("i'm sorry") || lower.includes("i should have") || lower.includes("what i should have done");
  }

  return false;
}
