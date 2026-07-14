import { capabilities, getCapability } from "../registry/capabilities.js";
import { evaluateCapability } from "../policy/kernel.js";
import { routeRequest } from "./router.js";

export function dryRunRequest(userIntent: string) {
  const route = routeRequest(userIntent);
  const policyDecisions = route.workOrder.proposedCapabilities
    .map((id) => getCapability(id))
    .filter((capability) => capability !== undefined)
    .map((capability) => ({
      capabilityId: capability.id,
      decision: evaluateCapability(capability, { defaultAuthorization: "READ_ONLY" })
    }));

  const mutationCapabilities = capabilities
    .filter((capability) => capability.sideEffect)
    .map((capability) => ({
      capabilityId: capability.id,
      decision: evaluateCapability(capability, { defaultAuthorization: "READ_ONLY" })
    }));

  return {
    ...route,
    policyDecisions,
    mutationCapabilities
  };
}
