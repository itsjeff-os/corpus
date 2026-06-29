import type { ReasoningGraphCore, ReasoningNode } from "../reasoning/graphCore.js";

export type RuntimeMode = "observing" | "mapping" | "clarifying" | "responding" | "repairing";
export type ReasoningGraphDepth = "thin" | "expanded";
export type ContextBudget = "minimal" | "standard" | "expanded";
export type VisibleEpistemics = "minimal" | "light" | "explicit";

export interface ReasoningRuntime {
  active_graph_id: string | null;
  current_observations: ReasoningNode[];
  current_interpretations: ReasoningNode[];
  current_inferences: ReasoningNode[];
  active_conclusions: ReasoningNode[];
  challenged_nodes: ReasoningNode[];
}

export interface RuntimeDecision {
  mode: RuntimeMode;
  strategy: string;
  context_budget: ContextBudget;
  visible_epistemics: VisibleEpistemics;
  reasoning_graph_depth: ReasoningGraphDepth;
  needs_user_confirmation: boolean;
  can_act: boolean;
  response_shape: string;
  avoid: string[];
  basis: string[];
}

export function deriveReasoningRuntime(graph: ReasoningGraphCore | null): ReasoningRuntime {
  if (!graph) {
    return {
      active_graph_id: null,
      current_observations: [],
      current_interpretations: [],
      current_inferences: [],
      active_conclusions: [],
      challenged_nodes: []
    };
  }

  return {
    active_graph_id: graph.graph_id,
    current_observations: graph.nodes.filter((node) => node.type === "observation" && node.status === "active"),
    current_interpretations: graph.nodes.filter((node) => node.type === "interpretation" && node.status === "active"),
    current_inferences: graph.nodes.filter((node) => node.type === "inference" && node.status === "active"),
    active_conclusions: graph.nodes.filter((node) => node.type === "conclusion" && node.status === "active"),
    challenged_nodes: graph.nodes.filter((node) => ["challenged", "contested"].includes(node.status))
  };
}

export function deriveRuntimeDecision(graph: ReasoningGraphCore | null): RuntimeDecision {
  const runtime = deriveReasoningRuntime(graph);
  const challengedBasis = runtime.challenged_nodes.map((node) => node.id);

  if (!graph || graph.nodes.length === 0) {
    return {
      mode: "observing",
      strategy: "start_with_reality",
      context_budget: "minimal",
      visible_epistemics: "minimal",
      reasoning_graph_depth: "thin",
      needs_user_confirmation: false,
      can_act: false,
      response_shape: "ask for the first concrete input",
      avoid: ["inventing state", "assuming durable context"],
      basis: []
    };
  }

  if (runtime.challenged_nodes.length > 0) {
    return {
      mode: "repairing",
      strategy: "return_to_operational_pattern",
      context_budget: "minimal",
      visible_epistemics: "light",
      reasoning_graph_depth: "expanded",
      needs_user_confirmation: true,
      can_act: false,
      response_shape: "short correction anchored to contested graph nodes",
      avoid: ["new framework", "long apology", "meta-performance"],
      basis: challengedBasis
    };
  }

  if (runtime.active_conclusions.length === 0 && runtime.current_observations.length > 0) {
    return {
      mode: "mapping",
      strategy: "derive_interpretation_before_conclusion",
      context_budget: "minimal",
      visible_epistemics: "minimal",
      reasoning_graph_depth: "thin",
      needs_user_confirmation: false,
      can_act: false,
      response_shape: "map observations into an explicit interpretation before concluding",
      avoid: ["jumping from observation to durable claim", "naming a large system too early"],
      basis: runtime.current_observations.map((node) => node.id)
    };
  }

  if (runtime.active_conclusions.some((node) => node.scope === "durable")) {
    return {
      mode: "responding",
      strategy: "use_durable_conclusion_lightly",
      context_budget: "standard",
      visible_epistemics: "light",
      reasoning_graph_depth: "expanded",
      needs_user_confirmation: false,
      can_act: false,
      response_shape: "apply durable conclusion without over-narrating the machinery",
      avoid: ["turning durable context into user psychology", "overloading the reply with internals"],
      basis: runtime.active_conclusions.map((node) => node.id)
    };
  }

  return {
    mode: "responding",
    strategy: "continue_from_active_conclusion",
    context_budget: "standard",
    visible_epistemics: "minimal",
    reasoning_graph_depth: "thin",
    needs_user_confirmation: false,
    can_act: false,
    response_shape: "answer from active graph support",
    avoid: ["expanding beyond the graph", "acting without approval"],
    basis: runtime.active_conclusions.map((node) => node.id)
  };
}
