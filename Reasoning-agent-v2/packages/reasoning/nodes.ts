export type ReasoningNodeKind = 'observation' | 'interpretation' | 'inference' | 'conclusion' | 'feedback';

export interface ReasoningNode {
  id: string;
  graphId: string;
  kind: ReasoningNodeKind;
  content: string;
  confidence?: number;
  sourceRef?: string;
  createdAt: string;
}
