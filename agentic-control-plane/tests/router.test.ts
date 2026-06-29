import { describe, expect, it } from "vitest";
import { routeRequest } from "../src/orchestrator/router.js";

describe("router", () => {
  it("routes product recommendations to research", () => {
    const result = routeRequest("Recommend a product to buy today");
    expect(result.workOrder.requiredAgents).toContain("research");
    expect(result.workOrder.evidenceRequirements).toContain("current cited sources");
  });

  it("routes docs through audit and documentation", () => {
    const result = routeRequest("Write confirmed documentation for this state");
    expect(result.workOrder.requiredAgents).toContain("audit");
    expect(result.workOrder.requiredAgents).toContain("documentation");
    expect(result.workOrder.proposedCapabilities).toContain("docs.write_confirmed");
  });

  it("keeps mutation disallowed even when mutation language appears", () => {
    const result = routeRequest("Apply Hue renames");
    expect(result.workOrder.requiredAgents).toContain("executor");
    expect(result.workOrder.mutationAllowed).toBe(false);
  });
});
