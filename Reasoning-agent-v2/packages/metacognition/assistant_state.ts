export interface AssistantState {
  id: string;
  userId: string;
  chatId: string;
  project?: string;
  currentMode: string;
  ambiguityTolerance: number;
  reflectionDepth: 'none' | 'light' | 'standard' | 'deep';
  actionPermissionState: 'observe_only' | 'suggest_only' | 'approval_required' | 'approved_for_scope';
  rationale?: string;
  updatedAt: string;
}
