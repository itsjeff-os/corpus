export interface Frame {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'active' | 'dormant' | 'promoted' | 'demoted';
  weight: number;
  metadata?: Record<string, unknown>;
}

export type FrameRelation = 'reinforces' | 'tensions' | 'subsumes';

export interface FrameEdge {
  sourceId: string;
  targetId: string;
  relation: FrameRelation;
  weight: number;
}

export interface FrameAssessment {
  affected: Frame[];
  promoted: Frame[];
  demoted: Frame[];
  newFrames: Array<{ name: string; description: string }>;
}
