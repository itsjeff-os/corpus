export type ReasoningEdgeKind = 'supports' | 'contradicts' | 'derives' | 'updates' | 'challenges';

export interface ReasoningEdge {
  id: string;
  graphId: string;
  fromNodeId: string;
  toNodeId: string;
  kind: ReasoningEdgeKind;
  createdAt: string;
}
