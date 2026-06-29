import type { AgentId, SystemId, WorkDomain, WorkMode, WorkOrder } from "../schemas.js";

const SYSTEMS: SystemId[] = [
  "filesystem",
  "hue",
  "home_assistant",
  "node_red",
  "homekit",
  "google_home",
  "openai_docs",
  "web",
  "memory",
  "docs",
  "executor",
  "control_plane"
];

export interface RouteResult {
  workOrder: WorkOrder;
  notes: string[];
}

export function routeRequest(userIntent: string, requestId = `req_${Date.now()}`): RouteResult {
  const text = userIntent.toLowerCase();
  const requiredAgents = new Set<AgentId>(["orchestrator", "audit"]);
  const systemsInScope = new Set<SystemId>(["control_plane"]);
  const systemsOutOfScope = new Set<SystemId>();
  const evidenceRequirements = new Set<string>();
  const proposedCapabilities = new Set<string>();
  const notes: string[] = [];
  const forbidsHomeAssistant =
    matches(text, ["do not touch home assistant", "don't touch home assistant", "no home assistant", "no ha"]) ||
    ((text.includes("do not touch") || text.includes("don't touch")) && text.includes("home assistant"));
  const forbidsNodeRed =
    matches(text, ["do not touch node-red", "do not touch node red", "don't touch node-red", "don't touch node red", "no node-red", "no node red"]) ||
    ((text.includes("do not touch") || text.includes("don't touch")) && (text.includes("node-red") || text.includes("node red")));

  let domain: WorkDomain = "general";
  let mode: WorkMode = "planning";

  if (matches(text, ["product", "buy", "purchase", "recommend", "latest", "current", "price", "market"])) {
    domain = "research";
    requiredAgents.add("research");
    systemsInScope.add("web");
    systemsInScope.add("openai_docs");
    evidenceRequirements.add("current cited sources");
    notes.push("research agent required for product/current-info request");
  }

  if (matches(text, ["document", "docs", "readme", "write up", "confirmed state"])) {
    domain = domain === "general" ? "documentation" : domain;
    requiredAgents.add("documentation");
    requiredAgents.add("audit");
    systemsInScope.add("docs");
    proposedCapabilities.add("docs.write_confirmed");
    evidenceRequirements.add("audit evidence bundle");
    notes.push("documentation requires audit evidence before write");
  }

  if (matches(text, ["hue", "light", "room", "zone", "fixture", "home map", "naming"])) {
    domain = "home_map";
    requiredAgents.add("home_map");
    systemsInScope.add("hue");
    if (!forbidsHomeAssistant) systemsInScope.add("home_assistant");
    proposedCapabilities.add("hue.read_inventory");
    notes.push("home map agent selected for structural naming request");
  }

  if (!forbidsHomeAssistant && matches(text, ["home assistant", " ha ", "helper", "automation", "entity", "area", "registry"])) {
    domain = domain === "general" ? "home_assistant" : domain;
    requiredAgents.add("home_assistant");
    systemsInScope.add("home_assistant");
    proposedCapabilities.add("ha.read_state");
    notes.push("home assistant agent selected in read-only mode");
  }

  if (!forbidsNodeRed && matches(text, ["node-red", "node red", "flow", "deploy", "restart nodered"])) {
    domain = domain === "general" ? "node_red" : domain;
    requiredAgents.add("node_red");
    systemsInScope.add("node_red");
    proposedCapabilities.add("node_red.read_flows");
    notes.push("node-red agent selected in read-only mode");
  }

  if (matches(text, ["where should", "which folder", "route this", "route the", "route work", "belongs"])) {
    requiredAgents.add("motion_placement");
    systemsInScope.add("filesystem");
    notes.push("motion/placement agent selected for domain placement");
  }

  if (matches(text, ["execute", "apply", "write", "rename", "restart", "reload", "deploy", "delete"])) {
    mode = "implementation";
    systemsInScope.add("executor");
    requiredAgents.add("executor");
    notes.push("mutation language detected; executor remains blocked without typed grant");
  }

  if (forbidsHomeAssistant) notes.push("home assistant explicitly excluded by request");
  if (forbidsNodeRed) notes.push("node-red explicitly excluded by request");

  for (const system of SYSTEMS) {
    if (!systemsInScope.has(system)) systemsOutOfScope.add(system);
  }

  return {
    workOrder: {
      requestId,
      userIntent,
      domain,
      mode,
      systemsInScope: [...systemsInScope],
      systemsOutOfScope: [...systemsOutOfScope],
      requiredAgents: [...requiredAgents],
      mutationAllowed: false,
      evidenceRequirements: [...evidenceRequirements],
      proposedCapabilities: [...proposedCapabilities]
    },
    notes
  };
}

function matches(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}
