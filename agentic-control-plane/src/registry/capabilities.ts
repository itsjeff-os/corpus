import type { Capability } from "../schemas.js";

export const capabilities: Capability[] = [
  {
    id: "filesystem.inventory",
    system: "filesystem",
    operationType: "read",
    sideEffect: false,
    blastRadius: "none",
    requiredGrant: null,
    rollback: "none",
    auditRequired: false,
    description: "Read-only corpus and file inventory."
  },
  {
    id: "hue.read_inventory",
    system: "hue",
    operationType: "read",
    sideEffect: false,
    blastRadius: "none",
    requiredGrant: null,
    rollback: "none",
    auditRequired: false,
    description: "Read Hue lights, rooms, zones, scenes, and bridge state."
  },
  {
    id: "hue.rename_light",
    system: "hue",
    operationType: "metadata_write",
    sideEffect: true,
    blastRadius: "low",
    requiredGrant: "APPLY_HUE_METADATA_ONLY",
    rollback: "rename_to_previous_value",
    auditRequired: true,
    description: "Rename one Hue light by resource id."
  },
  {
    id: "hue.update_zone",
    system: "hue",
    operationType: "metadata_write",
    sideEffect: true,
    blastRadius: "medium",
    requiredGrant: "APPLY_HUE_METADATA_ONLY",
    rollback: "manual",
    auditRequired: true,
    description: "Create, rename, or update a Hue zone membership."
  },
  {
    id: "ha.read_state",
    system: "home_assistant",
    operationType: "read",
    sideEffect: false,
    blastRadius: "none",
    requiredGrant: null,
    rollback: "none",
    auditRequired: false,
    description: "Read Home Assistant state, registries, and config metadata."
  },
  {
    id: "ha.write_config",
    system: "home_assistant",
    operationType: "config_write",
    sideEffect: true,
    blastRadius: "high",
    requiredGrant: "APPLY_HA_CONFIG",
    rollback: "restore_file",
    auditRequired: true,
    description: "Write Home Assistant configuration files."
  },
  {
    id: "ha.reload_domain",
    system: "home_assistant",
    operationType: "reload",
    sideEffect: true,
    blastRadius: "medium",
    requiredGrant: "APPLY_HA_CONFIG",
    rollback: "not_supported",
    auditRequired: true,
    description: "Reload a Home Assistant domain or integration."
  },
  {
    id: "node_red.read_flows",
    system: "node_red",
    operationType: "read",
    sideEffect: false,
    blastRadius: "none",
    requiredGrant: null,
    rollback: "none",
    auditRequired: false,
    description: "Read Node-RED flows and runtime metadata."
  },
  {
    id: "node_red.write_flows",
    system: "node_red",
    operationType: "config_write",
    sideEffect: true,
    blastRadius: "high",
    requiredGrant: "APPLY_NODE_RED_FLOW",
    rollback: "restore_file",
    auditRequired: true,
    description: "Write or deploy Node-RED flows."
  },
  {
    id: "node_red.restart",
    system: "node_red",
    operationType: "restart",
    sideEffect: true,
    blastRadius: "high",
    requiredGrant: "RESTART_NODE_RED",
    rollback: "not_supported",
    auditRequired: true,
    description: "Restart the Node-RED runtime."
  },
  {
    id: "docs.write_confirmed",
    system: "docs",
    operationType: "docs_write",
    sideEffect: true,
    blastRadius: "medium",
    requiredGrant: "WRITE_DOCS_CONFIRMED",
    rollback: "restore_file",
    auditRequired: true,
    description: "Write confirmed documentation from audited evidence."
  },
  {
    id: "memory.write_policy",
    system: "memory",
    operationType: "memory_write",
    sideEffect: true,
    blastRadius: "high",
    requiredGrant: "WRITE_MEMORY_POLICY",
    rollback: "manual",
    auditRequired: true,
    description: "Promote context or source corpus into durable policy memory."
  },
  {
    id: "executor.execute_packet",
    system: "executor",
    operationType: "execute",
    sideEffect: true,
    blastRadius: "high",
    requiredGrant: "EXECUTE_APPROVED_PACKET",
    rollback: "manual",
    auditRequired: true,
    description: "Execute an approved action packet. Stubbed and blocked in v1."
  }
];

export function getCapability(id: string): Capability | undefined {
  return capabilities.find((capability) => capability.id === id);
}
