import type { ActionPacket, AuthorizationGrant, PolicyDecision } from "../schemas.js";
import { evaluateActionPacket } from "../policy/kernel.js";

export interface ExecutionResult {
  status: "blocked" | "dry_run_only";
  policyDecision: PolicyDecision;
  message: string;
}

export function executeActionPacket(packet: ActionPacket, grants: AuthorizationGrant[] = []): ExecutionResult {
  const policyDecision = evaluateActionPacket(packet, {
    defaultAuthorization: "READ_ONLY",
    grants
  });

  if (policyDecision.decision !== "allow") {
    return {
      status: "blocked",
      policyDecision,
      message: "action packet blocked before execution"
    };
  }

  return {
    status: "dry_run_only",
    policyDecision: {
      decision: "block",
      reason: "v1 executor is intentionally stubbed; mutation executors are not implemented",
      blockedCapability: "executor.execute_packet",
      requiredGrant: "EXECUTE_APPROVED_PACKET",
      evidenceRefs: []
    },
    message: "packet is policy-valid but v1 has no mutation executor"
  };
}
