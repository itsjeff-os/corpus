export type CandidateStatus = 'draft' | 'working' | 'promoted' | 'rejected';

export interface StateCandidate {
  id: string;
  projectId: string;
  threadId: string;
  category: string;
  content: Record<string, unknown>;
  status: CandidateStatus;
  sourceMessageId?: string;
}

export interface OpenLoop {
  id: string;
  projectId: string;
  threadId?: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'deferred';
}

export interface Artifact {
  id: string;
  projectId: string;
  name: string;
  artifactType: string;
  content: Record<string, unknown>;
  version: number;
  status: 'draft' | 'active' | 'archived';
}

export interface Decision {
  id: string;
  projectId: string;
  threadId: string;
  decisionType: string;
  description: string;
  rationale?: string;
  status: 'active' | 'superseded' | 'revoked';
}
