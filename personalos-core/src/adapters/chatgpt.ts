import { IntakeRequest } from "../types";

export interface ChatGPTMessageEnvelope {
  userId: string;
  message: string;
  conversationId?: string;
  metadata?: Record<string, string>;
}

export function fromChatGPTMessage(envelope: ChatGPTMessageEnvelope): IntakeRequest {
  return {
    adapter: "chatgpt",
    userId: envelope.userId,
    input: envelope.message,
    metadata: {
      ...envelope.metadata,
      ...(envelope.conversationId ? { conversationId: envelope.conversationId } : {})
    }
  };
}
