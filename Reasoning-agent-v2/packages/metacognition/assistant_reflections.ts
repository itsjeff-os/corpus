export interface AssistantReflection {
  id: string;
  userId: string;
  chatId: string;
  project?: string;
  trigger: string;
  reflection: string;
  proposedUpdates: Record<string, unknown>[];
  createdAt: string;
}
