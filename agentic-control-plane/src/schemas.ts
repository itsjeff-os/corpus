import { z } from "zod";

export const SystemIdSchema = z.enum([
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
]);

export const OperationTypeSchema = z.enum([
  "read",
  "metadata_write",
  "config_write",
  "runtime_action",
  "restart",
  "reload",
  "deploy",
  "delete",
  "memory_write",
  "docs_write",
  "execute"
]);

export const AuthorizationScopeSchema = z.enum([
  "READ_ONLY",
  "APPLY_HUE_METADATA_ONLY",
  "APPLY_HA_CONFIG",
  "APPLY_NODE_RED_FLOW",
  "RESTART_NODE_RED",
  "RESTART_HOME_ASSISTANT",
  "WRITE_DOCS_CONFIRMED",
  "WRITE_MEMORY_POLICY",
  "EXECUTE_APPROVED_PACKET"
]);

export const AgentIdSchema = z.enum([
  "orchestrator",
  "research",
  "home_map",
  "home_assistant",
  "node_red",
  "documentation",
  "audit",
  "motion_placement",
  "executor"
]);

export const WorkDomainSchema = z.enum([
  "research",
  "home_map",
  "home_assistant",
  "node_red",
  "documentation",
  "audit",
  "motion_placement",
  "execution",
  "general"
]);

export const WorkModeSchema = z.enum([
  "read_only",
  "planning",
  "implementation",
  "documentation",
  "audit",
  "execution"
]);

export const CapabilitySchema = z.object({
  id: z.string(),
  system: SystemIdSchema,
  operationType: OperationTypeSchema,
  sideEffect: z.boolean(),
  blastRadius: z.enum(["none", "low", "medium", "high"]),
  requiredGrant: AuthorizationScopeSchema.nullable(),
  allowedTargets: z.array(z.string()).optional(),
  rollback: z.enum(["none", "rename_to_previous_value", "restore_file", "manual", "not_supported"]),
  auditRequired: z.boolean(),
  description: z.string()
});

export const AuthorizationGrantSchema = z.object({
  grantId: z.string(),
  scope: AuthorizationScopeSchema,
  systems: z.array(SystemIdSchema),
  allowedOperations: z.array(OperationTypeSchema),
  allowedTargets: z.array(z.string()).optional(),
  forbiddenSystems: z.array(SystemIdSchema).default([]),
  forbiddenOperations: z.array(OperationTypeSchema).default([]),
  expires: z.enum(["after_single_execution", "never"]).default("after_single_execution"),
  postAuditRequired: z.boolean().default(true)
});

export const PolicyDecisionSchema = z.object({
  decision: z.enum(["allow", "block", "escalate"]),
  reason: z.string(),
  requiredGrant: AuthorizationScopeSchema.nullable().optional(),
  blockedCapability: z.string().nullable().optional(),
  evidenceRefs: z.array(z.string()).default([])
});

export const AgentContractSchema = z.object({
  agentId: AgentIdSchema,
  responsibilities: z.array(z.string()),
  owns: z.array(z.string()).default([]),
  mayRead: z.array(SystemIdSchema).default([]),
  mayPropose: z.array(OperationTypeSchema).default([]),
  mayWrite: z.array(OperationTypeSchema).default([]),
  mayExecute: z.array(OperationTypeSchema).default([]),
  mustEscalate: z.array(OperationTypeSchema).default([]),
  forbiddenSystems: z.array(SystemIdSchema).default([]),
  forbiddenActions: z.array(OperationTypeSchema).default([]),
  requiredEvidence: z.array(z.string()).default([])
});

export const EvidenceBundleSchema = z.object({
  evidenceId: z.string(),
  source: z.string(),
  observedAt: z.string(),
  liveReadOnly: z.boolean(),
  observations: z.array(z.string()),
  conflicts: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
  staleStateFlags: z.array(z.string()).default([])
});

export const WorkOrderSchema = z.object({
  requestId: z.string(),
  userIntent: z.string(),
  domain: WorkDomainSchema,
  mode: WorkModeSchema,
  systemsInScope: z.array(SystemIdSchema),
  systemsOutOfScope: z.array(SystemIdSchema).default([]),
  requiredAgents: z.array(AgentIdSchema),
  mutationAllowed: z.boolean().default(false),
  evidenceRequirements: z.array(z.string()).default([]),
  proposedCapabilities: z.array(z.string()).default([])
});

export const ActionOperationSchema = z.object({
  type: z.string(),
  capabilityId: z.string(),
  system: SystemIdSchema,
  operationType: OperationTypeSchema,
  resourceId: z.string(),
  target: z.string().optional(),
  before: z.unknown().optional(),
  after: z.unknown().optional()
});

export const ActionPacketSchema = z.object({
  actionPacketId: z.string(),
  grantId: z.string().optional(),
  actions: z.array(ActionOperationSchema),
  stopConditions: z.array(z.string()).default([])
});

export const LedgerEventSchema = z.object({
  eventId: z.string(),
  requestId: z.string(),
  actor: z.string(),
  operation: z.string(),
  policyDecision: PolicyDecisionSchema,
  before: z.unknown().optional(),
  after: z.unknown().optional(),
  traceId: z.string().optional(),
  timestamp: z.string()
});

export type SystemId = z.infer<typeof SystemIdSchema>;
export type OperationType = z.infer<typeof OperationTypeSchema>;
export type AuthorizationScope = z.infer<typeof AuthorizationScopeSchema>;
export type AgentId = z.infer<typeof AgentIdSchema>;
export type WorkDomain = z.infer<typeof WorkDomainSchema>;
export type WorkMode = z.infer<typeof WorkModeSchema>;
export type Capability = z.infer<typeof CapabilitySchema>;
export type AuthorizationGrant = z.infer<typeof AuthorizationGrantSchema>;
export type PolicyDecision = z.infer<typeof PolicyDecisionSchema>;
export type AgentContract = z.infer<typeof AgentContractSchema>;
export type EvidenceBundle = z.infer<typeof EvidenceBundleSchema>;
export type WorkOrder = z.infer<typeof WorkOrderSchema>;
export type ActionPacket = z.infer<typeof ActionPacketSchema>;
export type LedgerEvent = z.infer<typeof LedgerEventSchema>;
