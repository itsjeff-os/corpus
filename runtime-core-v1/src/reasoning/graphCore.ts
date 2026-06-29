import { z } from "zod";

export const graphVersion = "1.1-core" as const;

export const nodeTypes = ["observation", "interpretation", "inference", "conclusion"] as const;
export const nodeStatuses = ["active", "challenged", "contested", "invalidated", "superseded"] as const;
export const supportClasses = ["observed", "interpretive", "derived", "corrective"] as const;
export const scopes = ["local", "session", "durable"] as const;
export const provenanceSources = ["user", "tool", "external", "derived"] as const;
export const edgeTypes = ["supports", "depends_on", "contradicts"] as const;

export type ReasoningNodeType = (typeof nodeTypes)[number];
export type ReasoningNodeStatus = (typeof nodeStatuses)[number];
export type SupportClass = (typeof supportClasses)[number];
export type ReasoningScope = (typeof scopes)[number];
export type ProvenanceSource = (typeof provenanceSources)[number];
export type ReasoningEdgeType = (typeof edgeTypes)[number];

export interface ReasoningGraphContext {
  domain: string;
  subject: string;
  created_at: string;
  updated_at: string;
}

export interface ReasoningNode {
  id: string;
  type: ReasoningNodeType;
  content: string;
  status: ReasoningNodeStatus;
  support_class: SupportClass;
  scope: ReasoningScope;
  basis: string[];
  provenance: {
    source: ProvenanceSource;
    ref: string | null;
    timestamp: string | null;
  };
  metadata: Record<string, unknown>;
}

export interface ReasoningEdge {
  id: string;
  from: string;
  to: string;
  type: ReasoningEdgeType;
  active: boolean;
}

export interface ReasoningGraphCore {
  graph_id: string;
  version: typeof graphVersion;
  context: ReasoningGraphContext;
  nodes: ReasoningNode[];
  edges: ReasoningEdge[];
}

export interface ValidationIssue {
  code: string;
  message: string;
  path?: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
}

const provenanceSchema = z.object({
  source: z.enum(provenanceSources),
  ref: z.string().nullable().default(null),
  timestamp: z.string().nullable().default(null)
}).strict();

export const reasoningNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(nodeTypes),
  content: z.string().min(1),
  status: z.enum(nodeStatuses),
  support_class: z.enum(supportClasses),
  scope: z.enum(scopes),
  basis: z.array(z.string().min(1)),
  provenance: provenanceSchema,
  metadata: z.record(z.unknown()).default({})
}).strict();

export const reasoningEdgeSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  type: z.enum(edgeTypes),
  active: z.boolean()
}).strict();

export const reasoningGraphCoreSchema = z.object({
  graph_id: z.string().min(1),
  version: z.literal(graphVersion),
  context: z.object({
    domain: z.string(),
    subject: z.string(),
    created_at: z.string(),
    updated_at: z.string()
  }).strict(),
  nodes: z.array(reasoningNodeSchema),
  edges: z.array(reasoningEdgeSchema)
}).strict();

export const reasoningGraphCoreJsonSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://flat-affairs.org/schemas/reasoning-graph-core-v1.1.schema.json",
  "title": "ReasoningGraphCoreV1_1",
  "type": "object",
  "required": ["graph_id", "version", "context", "nodes", "edges"],
  "properties": {
    "graph_id": { "type": "string", "minLength": 1 },
    "version": { "type": "string", "const": "1.1-core" },
    "context": {
      "type": "object",
      "required": ["domain", "subject", "created_at", "updated_at"],
      "properties": {
        "domain": { "type": "string" },
        "subject": { "type": "string" },
        "created_at": { "type": "string" },
        "updated_at": { "type": "string" }
      },
      "additionalProperties": false
    },
    "nodes": {
      "type": "array",
      "items": { "$ref": "#/$defs/node" }
    },
    "edges": {
      "type": "array",
      "items": { "$ref": "#/$defs/edge" }
    }
  },
  "$defs": {
    "node": {
      "type": "object",
      "required": [
        "id",
        "type",
        "content",
        "status",
        "support_class",
        "scope",
        "basis",
        "provenance"
      ],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "type": {
          "type": "string",
          "enum": ["observation", "interpretation", "inference", "conclusion"]
        },
        "content": { "type": "string", "minLength": 1 },
        "status": {
          "type": "string",
          "enum": ["active", "challenged", "contested", "invalidated", "superseded"]
        },
        "support_class": {
          "type": "string",
          "enum": ["observed", "interpretive", "derived", "corrective"]
        },
        "scope": {
          "type": "string",
          "enum": ["local", "session", "durable"]
        },
        "basis": {
          "type": "array",
          "items": { "type": "string", "minLength": 1 }
        },
        "provenance": {
          "type": "object",
          "required": ["source"],
          "properties": {
            "source": {
              "type": "string",
              "enum": ["user", "tool", "external", "derived"]
            },
            "ref": { "type": ["string", "null"] },
            "timestamp": { "type": ["string", "null"] }
          },
          "additionalProperties": false
        },
        "metadata": {
          "type": "object"
        }
      },
      "additionalProperties": false
    },
    "edge": {
      "type": "object",
      "required": ["id", "from", "to", "type", "active"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "from": { "type": "string", "minLength": 1 },
        "to": { "type": "string", "minLength": 1 },
        "type": {
          "type": "string",
          "enum": ["supports", "depends_on", "contradicts"]
        },
        "active": { "type": "boolean" }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
} as const;

const legalNonContradictionPairs = new Set<string>([
  "observation->observation",
  "observation->interpretation",
  "observation->inference",
  "observation->conclusion",
  "interpretation->interpretation",
  "interpretation->inference",
  "inference->inference",
  "inference->conclusion",
  "conclusion->conclusion"
]);

export function createEmptyGraph(domain: string, subject: string, graphId = `rg_${crypto.randomUUID()}`): ReasoningGraphCore {
  const now = new Date().toISOString();
  return {
    graph_id: graphId,
    version: graphVersion,
    context: {
      domain,
      subject,
      created_at: now,
      updated_at: now
    },
    nodes: [],
    edges: []
  };
}

export function validateReasoningGraphCore(input: unknown): ValidationResult {
  const parsed = reasoningGraphCoreSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => ({
        code: "schema",
        message: issue.message,
        path: issue.path.join(".")
      }))
    };
  }

  const graph = parsed.data;
  const errors: ValidationIssue[] = [];
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  for (const node of graph.nodes) {
    if (nodeIds.has(node.id)) {
      errors.push({ code: "duplicate_node_id", message: `Duplicate node id: ${node.id}`, path: `nodes.${node.id}` });
    }
    nodeIds.add(node.id);

    for (const basisId of node.basis) {
      if (!nodeById.has(basisId)) {
        errors.push({ code: "missing_basis", message: `Node ${node.id} basis references missing node ${basisId}`, path: `nodes.${node.id}.basis` });
      }
      if (basisId === node.id) {
        errors.push({ code: "self_basis", message: `Node ${node.id} cannot list itself as basis`, path: `nodes.${node.id}.basis` });
      }
    }

    if (node.status === "active") {
      const invalidatedBasis = node.basis
        .map((basisId) => nodeById.get(basisId))
        .filter((basisNode): basisNode is ReasoningNode => Boolean(basisNode))
        .filter((basisNode) => basisNode.status === "invalidated");

      for (const basisNode of invalidatedBasis) {
        errors.push({
          code: "active_node_invalidated_basis",
          message: `Active node ${node.id} rests on invalidated basis node ${basisNode.id}`,
          path: `nodes.${node.id}.basis`
        });
      }
    }
  }

  for (const edge of graph.edges) {
    if (edgeIds.has(edge.id)) {
      errors.push({ code: "duplicate_edge_id", message: `Duplicate edge id: ${edge.id}`, path: `edges.${edge.id}` });
    }
    edgeIds.add(edge.id);

    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);

    if (!from) errors.push({ code: "missing_edge_from", message: `Edge ${edge.id} from references missing node ${edge.from}`, path: `edges.${edge.id}.from` });
    if (!to) errors.push({ code: "missing_edge_to", message: `Edge ${edge.id} to references missing node ${edge.to}`, path: `edges.${edge.id}.to` });
    if (edge.from === edge.to) errors.push({ code: "self_loop", message: `Edge ${edge.id} cannot point to itself`, path: `edges.${edge.id}` });

    if (from && to && edge.type !== "contradicts") {
      const pair = `${from.type}->${to.type}`;
      if (!legalNonContradictionPairs.has(pair)) {
        errors.push({
          code: "illegal_edge_pattern",
          message: `Illegal ${edge.type} edge pattern: ${pair}`,
          path: `edges.${edge.id}`
        });
      }
    }
  }

  for (const conclusion of graph.nodes.filter((node) => node.type === "conclusion" && node.status === "active")) {
    const upstream = collectUpstreamNodes(graph, conclusion.id);
    const usesInterpretation = upstream.some((node) => node.type === "interpretation");
    const hasInference = upstream.some((node) => node.type === "inference");

    if (usesInterpretation && !hasInference) {
      errors.push({
        code: "conclusion_skips_inference",
        message: `Conclusion ${conclusion.id} relies on interpretation without inferential exposure`,
        path: `nodes.${conclusion.id}`
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

export function collectUpstreamNodes(graph: ReasoningGraphCore, nodeId: string): ReasoningNode[] {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const incoming = new Map<string, string[]>();

  for (const node of graph.nodes) {
    for (const basisId of node.basis) {
      const existing = incoming.get(node.id) ?? [];
      existing.push(basisId);
      incoming.set(node.id, existing);
    }
  }

  for (const edge of graph.edges.filter((edge) => edge.active && edge.type !== "contradicts")) {
    const existing = incoming.get(edge.to) ?? [];
    existing.push(edge.from);
    incoming.set(edge.to, existing);
  }

  const seen = new Set<string>();
  const upstream: ReasoningNode[] = [];
  const stack = [...(incoming.get(nodeId) ?? [])];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (!currentId || seen.has(currentId)) continue;
    seen.add(currentId);

    const node = byId.get(currentId);
    if (!node) continue;
    upstream.push(node);
    stack.push(...(incoming.get(currentId) ?? []));
  }

  return upstream;
}

export function collectDownstreamNodes(graph: ReasoningGraphCore, nodeId: string): ReasoningNode[] {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const outgoing = new Map<string, string[]>();

  for (const node of graph.nodes) {
    for (const basisId of node.basis) {
      const existing = outgoing.get(basisId) ?? [];
      existing.push(node.id);
      outgoing.set(basisId, existing);
    }
  }

  for (const edge of graph.edges.filter((edge) => edge.active && edge.type !== "contradicts")) {
    const existing = outgoing.get(edge.from) ?? [];
    existing.push(edge.to);
    outgoing.set(edge.from, existing);
  }

  const seen = new Set<string>();
  const downstream: ReasoningNode[] = [];
  const stack = [...(outgoing.get(nodeId) ?? [])];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (!currentId || seen.has(currentId)) continue;
    seen.add(currentId);

    const node = byId.get(currentId);
    if (!node) continue;
    downstream.push(node);
    stack.push(...(outgoing.get(currentId) ?? []));
  }

  return downstream;
}

export function markInvalidatedAndChallengeDownstream(graph: ReasoningGraphCore, nodeId: string): ReasoningGraphCore {
  const downstreamIds = new Set(collectDownstreamNodes(graph, nodeId).map((node) => node.id));
  const now = new Date().toISOString();

  return {
    ...graph,
    context: { ...graph.context, updated_at: now },
    nodes: graph.nodes.map((node) => {
      if (node.id === nodeId) return { ...node, status: "invalidated" };
      if (downstreamIds.has(node.id) && node.status === "active") return { ...node, status: "challenged" };
      return node;
    })
  };
}

export function supersedeNode(graph: ReasoningGraphCore, oldNodeId: string, replacement: ReasoningNode): ReasoningGraphCore {
  const now = new Date().toISOString();
  const hasReplacement = graph.nodes.some((node) => node.id === replacement.id);
  const nodes = graph.nodes.map((node) => {
    if (node.id !== oldNodeId) return node;
    return {
      ...node,
      status: "superseded" as const,
      metadata: {
        ...node.metadata,
        superseded_by: replacement.id,
        superseded_at: now
      }
    };
  });

  if (!hasReplacement) nodes.push(replacement);

  return {
    ...graph,
    context: { ...graph.context, updated_at: now },
    nodes
  };
}
