import { ZepClient } from "@getzep/zep-cloud";
import { env } from "../config/env";

export interface MemoryStatus {
  threadReused: boolean;
  contextUsed: boolean;
  userMessageAddedToZep: boolean;
  assistantMessageAddedToZep: boolean;
  zepGraphIngestionAllowed: boolean;
  degraded: boolean;
  error?: string;
}

export interface UserMessageResult {
  context: string;
  recentMessages: string;
  status: Pick<MemoryStatus, "threadReused" | "contextUsed" | "userMessageAddedToZep" | "zepGraphIngestionAllowed" | "degraded" | "error">;
}

export class ZepMemoryService {
  private client = new ZepClient({ apiKey: env.zepApiKey });

  async ensureUser(userId: string): Promise<void> {
    try {
      await this.client.user.add({
        userId,
        firstName: userId === "jeff" ? "Jeff" : undefined,
        metadata: { source: "redo-ryan" },
      });
    } catch {
      // Existing users are fine; Zep returns an error when the user already exists.
    }
  }

  async ensureThread(userId: string, threadId: string): Promise<boolean> {
    await this.ensureUser(userId);

    try {
      await this.client.thread.create({ threadId, userId });
      return false;
    } catch (createError) {
      try {
        await this.client.thread.get(threadId, { limit: 1 });
        return true;
      } catch {
        throw createError;
      }
    }
  }

  async addUserMessageAndGetContext(params: { userId: string; threadId: string; message: string }): Promise<UserMessageResult> {
    try {
      const threadReused = await this.ensureThread(params.userId, params.threadId);
      const result = await this.client.thread.addMessages(params.threadId, {
        messages: [{ role: "user", name: params.userId, content: params.message }],
        returnContext: true,
      });
      const fallbackContext = result.context ? "" : await this.getUserContext(params.threadId);
      const context = result.context || fallbackContext;
      const recentMessages = await this.getRecentMessages(params.threadId);
      return {
        context,
        recentMessages,
        status: {
          threadReused,
          contextUsed: Boolean(context || recentMessages),
          userMessageAddedToZep: true,
          zepGraphIngestionAllowed: true,
          degraded: false,
        },
      };
    } catch (error) {
      return {
        context: "",
        recentMessages: "",
        status: {
          threadReused: false,
          contextUsed: false,
          userMessageAddedToZep: false,
          zepGraphIngestionAllowed: true,
          degraded: true,
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  async addAssistantMessage(params: { threadId: string; reply: string }): Promise<Pick<MemoryStatus, "assistantMessageAddedToZep" | "degraded" | "error">> {
    try {
      await this.client.thread.addMessages(params.threadId, {
        messages: [{ role: "assistant", name: "Ryan", content: params.reply }],
      });
      return { assistantMessageAddedToZep: true, degraded: false };
    } catch (error) {
      return {
        assistantMessageAddedToZep: false,
        degraded: true,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async getUserContext(threadId: string): Promise<string> {
    const result = await this.client.thread.getUserContext(threadId);
    return result.context || "";
  }

  private async getRecentMessages(threadId: string): Promise<string> {
    const result = await this.client.thread.get(threadId, { lastn: 12 });
    const messages = result.messages || [];
    return messages
      .map((message) => {
        const speaker = message.name || message.role;
        return `${speaker}: ${message.content}`;
      })
      .join("\n");
  }
}
