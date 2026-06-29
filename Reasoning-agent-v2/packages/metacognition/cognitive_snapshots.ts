export interface CognitiveSnapshot {
  id: string;
  userId: string;
  chatId: string;
  project?: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
