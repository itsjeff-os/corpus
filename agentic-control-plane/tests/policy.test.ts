import { describe, expect, it } from "vitest";
import { getCapability } from "../src/registry/capabilities.js";
import { evaluateActionPacket, evaluateCapability } from "../src/policy/kernel.js";
import type { ActionPacket, AuthorizationGrant } from "../src/schemas.js";

describe("policy kernel", () => {
  it("allows read-only capabilities under READ_ONLY", () => {
    const capability = getCapability("hue.read_inventory");
    expect(capability).toBeDefined();
    const decision = evaluateCapability(capability!, { defaultAuthorization: "READ_ONLY" });
    expect(decision.decision).toBe("allow");
  });

  it("blocks mutation capabilities without grants", () => {
    const capability = getCapability("ha.write_config");
    expect(capability).toBeDefined();
    const decision = evaluateCapability(capability!, { defaultAuthorization: "READ_ONLY" });
    expect(decision.decision).toBe("block");
    expect(decision.requiredGrant).toBe("APPLY_HA_CONFIG");
  });

  it("requires typed grant id for action packets", () => {
    const packet: ActionPacket = {
      actionPacketId: "packet_1",
      actions: [
        {
          type: "rename",
          capabilityId: "hue.rename_light",
          system: "hue",
          operationType: "metadata_write",
          resourceId: "light_1",
          target: "Beta Bedroom"
        }
      ],
      stopConditions: []
    };

    const decision = evaluateActionPacket(packet, { defaultAuthorization: "READ_ONLY" });
    expect(decision.decision).toBe("block");
    expect(decision.reason).toContain("typed grant id");
  });

  it("allows policy validation with a matching grant", () => {
    const grant: AuthorizationGrant = {
      grantId: "grant_1",
      scope: "APPLY_HUE_METADATA_ONLY",
      systems: ["hue"],
      allowedOperations: ["metadata_write"],
      allowedTargets: ["Beta Bedroom"],
      forbiddenSystems: ["home_assistant", "node_red"],
      forbiddenOperations: ["restart", "reload"],
      expires: "after_single_execution",
      postAuditRequired: true
    };

    const packet: ActionPacket = {
      actionPacketId: "packet_1",
      grantId: "grant_1",
      actions: [
        {
          type: "rename",
          capabilityId: "hue.rename_light",
          system: "hue",
          operationType: "metadata_write",
          resourceId: "light_1",
          target: "Beta Bedroom"
        }
      ],
      stopConditions: []
    };

    const decision = evaluateActionPacket(packet, { defaultAuthorization: "READ_ONLY", grants: [grant] });
    expect(decision.decision).toBe("allow");
  });
});
