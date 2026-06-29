import type { EpistemicStance } from './epistemic_stance';

export interface InferenceLog {
  id: string;
  userId: string;
  chatId: string;
  project?: string;
  inference: string;
  epistemicStance: EpistemicStance;
  confidenceScore: number;
  supportingSignals: string[];
  contradictions: string[];
  userFeedbackStatus: 'none' | 'confirmed' | 'rejected' | 'challenged' | 'modified';
  userFeedback?: string;
  actedOn: boolean;
  createdAt: string;
}
