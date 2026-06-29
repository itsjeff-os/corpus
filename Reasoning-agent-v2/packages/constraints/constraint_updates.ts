export interface ConstraintUpdate {
  constraintId: string;
  updateType: 'strengthen' | 'weaken' | 'challenge' | 'retire';
  reason: string;
  sourceRef?: string;
}
