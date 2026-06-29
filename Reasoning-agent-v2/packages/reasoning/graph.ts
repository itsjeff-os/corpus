import type { ReasoningNode } from './nodes';
import type { ReasoningEdge } from './edges';

export interface ReasoningGraph {
  id: string;
  userId: string;
  chatId: string;
  project?: string;
  nodes: ReasoningNode[];
  edges: ReasoningEdge[];
  createdAt: string;
  updatedAt: string;
}
