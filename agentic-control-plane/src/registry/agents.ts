import type { AgentContract } from "../schemas.js";

export const agentContracts: AgentContract[] = [
  {
    agentId: "orchestrator",
    responsibilities: ["classify intent", "decompose tasks", "route to agents", "maintain task state"],
    owns: [],
    mayRead: ["control_plane"],
    mayPropose: ["read"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: [],
    forbiddenSystems: [],
    forbiddenActions: ["metadata_write", "config_write", "runtime_action", "restart", "reload", "deploy", "delete", "memory_write", "docs_write", "execute"],
    requiredEvidence: []
  },
  {
    agentId: "research",
    responsibilities: ["research products", "research current information", "cite evidence", "separate fact from inference"],
    owns: ["external research", "product recommendation evidence"],
    mayRead: ["web", "openai_docs"],
    mayPropose: ["read"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: [],
    forbiddenSystems: [],
    forbiddenActions: ["metadata_write", "config_write", "runtime_action", "restart", "reload", "deploy", "delete", "memory_write", "docs_write", "execute"],
    requiredEvidence: ["current sources for product/current-info tasks"]
  },
  {
    agentId: "home_map",
    responsibilities: ["draft structural naming", "map rooms zones fixtures", "prevent home-domain leakage"],
    owns: ["Hue naming proposals", "HA area naming proposals", "fixture maps"],
    mayRead: ["hue", "home_assistant", "docs"],
    mayPropose: ["metadata_write"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: ["metadata_write", "config_write", "reload", "restart"],
    forbiddenSystems: ["node_red"],
    forbiddenActions: [],
    requiredEvidence: []
  },
  {
    agentId: "home_assistant",
    responsibilities: ["inspect HA config state", "inspect registries", "propose HA changes"],
    owns: ["Home Assistant config and registry analysis"],
    mayRead: ["home_assistant"],
    mayPropose: ["config_write", "reload"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: ["config_write", "runtime_action", "reload", "restart"],
    forbiddenSystems: ["node_red", "hue"],
    forbiddenActions: [],
    requiredEvidence: []
  },
  {
    agentId: "node_red",
    responsibilities: ["inspect Node-RED flows", "inspect Node-RED runtime metadata", "propose flow changes"],
    owns: ["Node-RED flow analysis"],
    mayRead: ["node_red"],
    mayPropose: ["config_write", "deploy", "restart"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: ["config_write", "deploy", "restart"],
    forbiddenSystems: ["home_assistant", "hue"],
    forbiddenActions: [],
    requiredEvidence: []
  },
  {
    agentId: "documentation",
    responsibilities: ["draft documentation from evidence bundles", "avoid unaudited confirmed claims"],
    owns: ["confirmed docs drafts"],
    mayRead: ["docs", "control_plane"],
    mayPropose: ["docs_write"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: ["docs_write"],
    forbiddenSystems: [],
    forbiddenActions: [],
    requiredEvidence: ["audit evidence bundle"]
  },
  {
    agentId: "audit",
    responsibilities: ["verify proposed state against evidence", "block scope drift", "produce evidence bundles"],
    owns: ["verification and evidence"],
    mayRead: ["filesystem", "hue", "home_assistant", "node_red", "docs", "control_plane"],
    mayPropose: ["read"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: [],
    forbiddenSystems: [],
    forbiddenActions: ["metadata_write", "config_write", "runtime_action", "restart", "reload", "deploy", "delete", "memory_write", "docs_write", "execute"],
    requiredEvidence: []
  },
  {
    agentId: "motion_placement",
    responsibilities: ["determine correct domain", "place files and docs", "prevent adjacent-system work"],
    owns: ["routing placement and domain boundaries"],
    mayRead: ["filesystem", "docs", "control_plane"],
    mayPropose: ["read"],
    mayWrite: [],
    mayExecute: [],
    mustEscalate: [],
    forbiddenSystems: [],
    forbiddenActions: ["metadata_write", "config_write", "runtime_action", "restart", "reload", "deploy", "delete", "memory_write", "docs_write", "execute"],
    requiredEvidence: []
  },
  {
    agentId: "executor",
    responsibilities: ["accept exact approved action packets", "refuse reinterpretation", "record execution outcomes"],
    owns: ["approved execution only"],
    mayRead: ["control_plane"],
    mayPropose: [],
    mayWrite: [],
    mayExecute: ["execute"],
    mustEscalate: ["execute"],
    forbiddenSystems: [],
    forbiddenActions: ["metadata_write", "config_write", "runtime_action", "restart", "reload", "deploy", "delete", "memory_write", "docs_write"],
    requiredEvidence: []
  }
];

export function getAgentContract(agentId: string): AgentContract | undefined {
  return agentContracts.find((contract) => contract.agentId === agentId);
}
