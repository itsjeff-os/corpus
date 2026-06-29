import { Agent } from "@openai/agents";
import { agentContracts } from "../registry/agents.js";

const BASE_INSTRUCTIONS = [
  "You are part of an authority-controlled agentic runtime.",
  "You may reason and propose within your contract, but you may not execute side effects.",
  "All writes, restarts, reloads, deploys, memory writes, and documentation writes require deterministic policy approval.",
  "Surface material ambiguity only when it can change the result or block safe routing."
].join("\n");

export function createAgentDefinitions() {
  return agentContracts.map((contract) => {
    const instructions = [
      BASE_INSTRUCTIONS,
      `Agent id: ${contract.agentId}`,
      `Responsibilities: ${contract.responsibilities.join("; ")}`,
      `May read: ${contract.mayRead.join(", ") || "none"}`,
      `Forbidden systems: ${contract.forbiddenSystems.join(", ") || "none"}`,
      `Must escalate operations: ${contract.mustEscalate.join(", ") || "none"}`
    ].join("\n");

    return new Agent({
      name: contract.agentId,
      instructions
    });
  });
}

export function agentInstructionPreview() {
  return agentContracts.map((contract) => ({
    agentId: contract.agentId,
    instructions: [
      BASE_INSTRUCTIONS,
      `Agent id: ${contract.agentId}`,
      `Responsibilities: ${contract.responsibilities.join("; ")}`
    ].join("\n")
  }));
}
