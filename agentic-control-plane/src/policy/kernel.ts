import type { ActionPacket, AuthorizationGrant, Capability, PolicyDecision } from "../schemas.js";
import { getCapability } from "../registry/capabilities.js";

export interface PolicyContext {
  defaultAuthorization: "READ_ONLY";
  grants?: AuthorizationGrant[];
}

export function evaluateCapability(
  capability: Capability,
  context: PolicyContext,
  target?: string
): PolicyDecision {
  if (!capability.sideEffect && capability.operationType === "read") {
    return {
      decision: "allow",
      reason: "read-only capability is allowed under READ_ONLY",
      evidenceRefs: []
    };
  }

  if (!capability.requiredGrant) {
    return {
      decision: "block",
      reason: "side-effecting capability does not declare a required grant",
      blockedCapability: capability.id,
      evidenceRefs: []
    };
  }

  const grant = findMatchingGrant(capability, context.grants ?? [], target);
  if (!grant) {
    return {
      decision: "block",
      reason: `capability requires ${capability.requiredGrant}`,
      requiredGrant: capability.requiredGrant,
      blockedCapability: capability.id,
      evidenceRefs: []
    };
  }

  return {
    decision: "allow",
    reason: `capability allowed by grant ${grant.grantId}`,
    evidenceRefs: []
  };
}

export function evaluateActionPacket(packet: ActionPacket, context: PolicyContext): PolicyDecision {
  if (!packet.grantId) {
    return {
      decision: "block",
      reason: "executor requires a typed grant id; natural-language permission is not accepted",
      requiredGrant: "EXECUTE_APPROVED_PACKET",
      evidenceRefs: []
    };
  }

  for (const action of packet.actions) {
    const capability = getCapability(action.capabilityId);
    if (!capability) {
      return {
        decision: "block",
        reason: `unknown capability ${action.capabilityId}`,
        blockedCapability: action.capabilityId,
        evidenceRefs: []
      };
    }

    const decision = evaluateCapability(capability, context, action.target ?? action.resourceId);
    if (decision.decision !== "allow") return decision;
  }

  return {
    decision: "allow",
    reason: `action packet ${packet.actionPacketId} is policy-valid`,
    evidenceRefs: []
  };
}

function findMatchingGrant(
  capability: Capability,
  grants: AuthorizationGrant[],
  target?: string
): AuthorizationGrant | undefined {
  return grants.find((grant) => {
    if (grant.scope !== capability.requiredGrant) return false;
    if (!grant.systems.includes(capability.system)) return false;
    if (!grant.allowedOperations.includes(capability.operationType)) return false;
    if (grant.forbiddenSystems.includes(capability.system)) return false;
    if (grant.forbiddenOperations.includes(capability.operationType)) return false;
    if (target && grant.allowedTargets?.length && !grant.allowedTargets.includes(target)) return false;
    return true;
  });
}
