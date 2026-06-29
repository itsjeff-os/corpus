import { env } from "../config/env";
import { OpenAIResponder } from "../services/openaiResponder";
import { MemoryStatus, ZepMemoryService } from "../services/zepMemory";

export interface RyanTurnInput {
  userId?: string;
  threadId?: string;
  message: string;
}

export interface RyanTurnResult {
  reply: string;
  userId: string;
  threadId: string;
  memory: MemoryStatus;
}

export class RyanCore {
  constructor(private memory = new ZepMemoryService(), private responder = new OpenAIResponder()) {}

  async reply(input: RyanTurnInput): Promise<RyanTurnResult> {
    const userId = input.userId || env.ryanUserId;
    const threadId = input.threadId || env.ryanThreadId;
    const message = input.message.trim();
    if (!message) throw new Error("message is required");

    const userMemory = await this.memory.addUserMessageAndGetContext({ userId, threadId, message });
    const memoryContext = [
      userMemory.context ? `Zep graph/user context:\n${userMemory.context}` : "",
      userMemory.recentMessages ? `Recent thread messages:\n${userMemory.recentMessages}` : "",
    ].filter(Boolean).join("\n\n");
    const reply = await this.responder.respond({ message, memoryContext });
    const assistantMemory = await this.memory.addAssistantMessage({ threadId, reply });

    return {
      reply,
      userId,
      threadId,
      memory: {
        threadReused: userMemory.status.threadReused,
        contextUsed: userMemory.status.contextUsed,
        userMessageAddedToZep: userMemory.status.userMessageAddedToZep,
        assistantMessageAddedToZep: assistantMemory.assistantMessageAddedToZep,
        zepGraphIngestionAllowed: userMemory.status.zepGraphIngestionAllowed,
        degraded: userMemory.status.degraded || assistantMemory.degraded,
        error: userMemory.status.error || assistantMemory.error,
      },
    };
  }
}
