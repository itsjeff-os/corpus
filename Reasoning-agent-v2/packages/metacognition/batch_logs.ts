export interface BatchLog {
  id: string;
  userId: string;
  chatId: string;
  project?: string;
  batchType: string;
  payload: Record<string, unknown>;
  importanceScore: number;
  flushTrigger: string;
  createdAt: string;
}
