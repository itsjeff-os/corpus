export interface SoftConstraint {
  id: string;
  userId: string;
  project?: string;
  name: string;
  description: string;
  strength: number;
  confidence: number;
  sourceInferenceIds: string[];
  status: 'active' | 'dormant' | 'challenged' | 'rejected';
  lastConfirmedAt?: string;
  lastChallengedAt?: string;
  createdAt: string;
  updatedAt: string;
}
