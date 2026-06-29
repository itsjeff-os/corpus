import type { ControlName, GeneratorControlDecision, ResponseMode, RuntimeContext } from "../types.js";

export function applyGeneratorControls(context: RuntimeContext): GeneratorControlDecision {
  const message = context.user_message;
  const lower = message.toLowerCase();
  const active_controls: GeneratorControlDecision["active_controls"] = [];
  const forbidden_generation_paths: string[] = [];
  const required_output_properties: string[] = [];

  addControl(active_controls, {
    name: "Explicit Content Lock",
    activated_by: "every turn; explicit content has priority",
    blocks: ["affective reinterpretation", "intent speculation overriding direct text", "tone-led response selection"],
    permits: ["literal operational handling", "direct continuation from explicit content"]
  });
  required_output_properties.push("preserve explicit instructions before inference");

  if (hasCompletedState(lower)) {
    addControl(active_controls, {
      name: "Build-State Lock",
      activated_by: "user marked an object as created/done/already built",
      blocks: ["creation instructions for completed objects", "setup steps for already-created components", "restart-from-zero output"],
      permits: ["downstream integration", "inspection", "state-resolving question"]
    });
    forbidden_generation_paths.push("regenerate_completed_build_state");
    required_output_properties.push("preserve completed build state");
  }

  if (isPriorityClaimLikely(lower)) {
    addControl(active_controls, {
      name: "Authority Delegation Lock",
      activated_by: "request involves relevance, priority, or what matters in user build",
      blocks: ["unauthorized narrowing", "declaring main risk without delegation", "assigning architectural priority from local inference"],
      permits: ["offering alternatives", "following explicit selection", "grounding priority in established state"]
    });
    forbidden_generation_paths.push("unauthorized_architectural_priority_selection");
  }

  if (context.signal_governance.implicit.detected.length > 0) {
    addControl(active_controls, {
      name: "Signal Validation Gate",
      activated_by: "implicit signal detected",
      blocks: ["acting on detection alone", "humor as command", "sarcasm as policy", "tone above explicit text"],
      permits: ["validated implicit signal use", "texture with no operational effect"]
    });
    if (context.signal_governance.implicit.actionable.length === 0) {
      forbidden_generation_paths.push("implicit_signal_driven_response_selection");
    }
  }

  const selected_response_mode = inferResponseMode(lower);
  addControl(active_controls, {
    name: "Response Mode Lock",
    activated_by: `selected response mode: ${selected_response_mode}`,
    blocks: ["mode substitution", "meta-commentary in place of requested output", "diagnosis in place of build"],
    permits: [`${selected_response_mode} response mode`]
  });
  required_output_properties.push(`must satisfy response mode: ${selected_response_mode}`);

  if (suppliedObject(lower)) {
    addControl(active_controls, {
      name: "Object Contact Lock",
      activated_by: "user supplied or referenced a build object",
      blocks: ["commentary without object contact", "meta-discussion as substitute for object work"],
      permits: ["direct edit", "extension", "implementation", "mapping", "test case"]
    });
    required_output_properties.push("make direct contact with supplied object");
  }

  addControl(active_controls, {
    name: "Output Non-Interference Lock",
    activated_by: "always before final output",
    blocks: ["added logic", "softening", "repair language", "scope shift", "omission", "reframing"],
    permits: ["presentation only", "formatting only"]
  });
  forbidden_generation_paths.push("output_layer_semantic_mutation");

  addControl(active_controls, {
    name: "Traceability Gate",
    activated_by: "every turn; visible behaviour is evaluable surface",
    blocks: ["hidden-layer rationalization", "untraceable internal-state claims", "post hoc justification"],
    permits: ["visible input/output evidence", "auditable state", "named control firing"]
  });

  return {
    active_controls,
    forbidden_generation_paths: unique(forbidden_generation_paths),
    required_output_properties: unique(required_output_properties),
    selected_response_mode,
    may_generate: true
  };
}

function addControl(list: GeneratorControlDecision["active_controls"], control: GeneratorControlDecision["active_controls"][number]) {
  if (!list.some((c) => c.name === control.name)) list.push(control);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function hasCompletedState(lower: string): boolean {
  return /\b(already done|already built|already created|has been created|is done|completed)\b/.test(lower);
}

function isPriorityClaimLikely(lower: string): boolean {
  return /\b(main|most relevant|priority|what matters|where it's relevant|decide|delegate)\b/.test(lower);
}

function suppliedObject(lower: string): boolean {
  return /\b(schema|layer|protocol|code|object|taxonomy|artifact|artefact|contract|runtime|loop|app|service)\b/.test(lower);
}

function inferResponseMode(lower: string): ResponseMode {
  if (/\bbuild|deployable|implement|code|app|loop\b/.test(lower)) return "build";
  if (/\btrace|observed|fault|audit\b/.test(lower)) return "trace";
  if (/\bcompare|contrast\b/.test(lower)) return "compare";
  if (/\bredraft|rewrite\b/.test(lower)) return "redraft";
  if (/\bexplain|why|how\b/.test(lower)) return "explain";
  if (lower.trim().endsWith("?")) return "answer";
  return "answer";
}
