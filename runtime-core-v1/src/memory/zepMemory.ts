import { ZepClient } from "@getzep/zep-cloud";
import { env } from "../config/env.js";

export type ZepMessageRole = "user" | "assistant" | "system" | "tool";

export interface ZepMemoryStatus {
  configured: boolean;
  threadReused: boolean;
  contextUsed: boolean;
  userMessageAddedToZep: boolean;
  assistantMessageAddedToZep: boolean;
  messageAddedToZep: boolean;
  zepGraphIngestionAllowed: boolean;
  degraded: boolean;
  error?: string;
}

export interface ZepContextResult {
  userId: string;
  threadId: string;
  context: string;
  recentMessages: string;
  memory: ZepMemoryStatus;
}

export interface AddMessageInput {
  userId?: string;
  threadId?: string;
  role: ZepMessageRole;
  name?: string;
  content: string;
  returnContext?: boolean;
}

export interface AddTurnInput {
  userId?: string;
  threadId?: string;
  userMessage: string;
  assistantMessage: string;
}

function baseStatus(): ZepMemoryStatus {
  return {
    configured: Boolean(env.codexZepApiKey),
    threadReused: false,
    contextUsed: false,
    userMessageAddedToZep: false,
    assistantMessageAddedToZep: false,
    messageAddedToZep: false,
    zepGraphIngestionAllowed: true,
    degraded: false
  };
}

export class ZepMemoryService {
  private client: ZepClient | null = env.codexZepApiKey ? new ZepClient({ apiKey: env.codexZepApiKey }) : null;

  isConfigured(): boolean {
    return Boolean(this.client);
  }

  async ensureUser(userId: string): Promise<void> {
    if (!this.client) throw new Error("RUNTIME_CORE_ZEP_API_KEY or CODEX_ZEP_API_KEY is not configured");

    try {
      await this.client.user.add({
        userId,
        firstName: userId === "jeff" ? "Jeff" : undefined,
        metadata: { source: "runtime-core-v1", assistant_boundary: "runtime-core" }
      });
    } catch {
      // Existing users are fine; Zep returns an error when the user already exists.
    }
  }

  async ensureThread(userId: string, threadId: string): Promise<boolean> {
    if (!this.client) throw new Error("RUNTIME_CORE_ZEP_API_KEY or CODEX_ZEP_API_KEY is not configured");

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

  async getContext(params: { userId?: string; threadId?: string; message?: string }): Promise<ZepContextResult> {
    const userId = params.userId || env.codexUserId;
    const threadId = params.threadId || env.codexThreadId;

    if (!this.client) {
      return {
        userId,
        threadId,
        context: "",
        recentMessages: "",
        memory: { ...baseStatus(), degraded: true, error: "RUNTIME_CORE_ZEP_API_KEY or CODEX_ZEP_API_KEY is not configured" }
      };
    }

    try {
      const threadReused = await this.ensureThread(userId, threadId);
      let context = "";
      let userMessageAddedToZep = false;

      if (params.message?.trim()) {
        const result = await this.client.thread.addMessages(threadId, {
          messages: [{ role: "user", name: userId, content: params.message.trim() }],
          returnContext: true
        });
        context = result.context || "";
        userMessageAddedToZep = true;
      }

      if (!context) context = await this.getUserContext(threadId);
      const recentMessages = await this.getRecentMessages(threadId);

      return {
        userId,
        threadId,
        context,
        recentMessages,
        memory: {
          ...baseStatus(),
          threadReused,
          contextUsed: Boolean(context || recentMessages),
          userMessageAddedToZep,
          messageAddedToZep: userMessageAddedToZep,
          degraded: false
        }
      };
    } catch (error) {
      return {
        userId,
        threadId,
        context: "",
        recentMessages: "",
        memory: { ...baseStatus(), degraded: true, error: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  async addMessage(input: AddMessageInput): Promise<ZepContextResult> {
    const userId = input.userId || env.codexUserId;
    const threadId = input.threadId || env.codexThreadId;
    const content = input.content.trim();

    if (!content) throw new Error("content is required");

    if (!this.client) {
      return {
        userId,
        threadId,
        context: "",
        recentMessages: "",
        memory: { ...baseStatus(), degraded: true, error: "RUNTIME_CORE_ZEP_API_KEY or CODEX_ZEP_API_KEY is not configured" }
      };
    }

    try {
      const threadReused = await this.ensureThread(userId, threadId);
      const result = await this.client.thread.addMessages(threadId, {
        messages: [{ role: input.role, name: input.name || (input.role === "user" ? userId : "Codex"), content }],
        returnContext: input.returnContext ?? input.role === "user"
      });
      const context = result.context || await this.getUserContext(threadId);
      const recentMessages = await this.getRecentMessages(threadId);

      return {
        userId,
        threadId,
        context,
        recentMessages,
        memory: {
          ...baseStatus(),
          threadReused,
          contextUsed: Boolean(context || recentMessages),
          userMessageAddedToZep: input.role === "user",
          assistantMessageAddedToZep: input.role === "assistant",
          messageAddedToZep: true,
          degraded: false
        }
      };
    } catch (error) {
      return {
        userId,
        threadId,
        context: "",
        recentMessages: "",
        memory: { ...baseStatus(), degraded: true, error: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  async addTurn(input: AddTurnInput): Promise<ZepContextResult> {
    const userId = input.userId || env.codexUserId;
    const threadId = input.threadId || env.codexThreadId;

    if (!this.client) {
      return {
        userId,
        threadId,
        context: "",
        recentMessages: "",
        memory: { ...baseStatus(), degraded: true, error: "RUNTIME_CORE_ZEP_API_KEY or CODEX_ZEP_API_KEY is not configured" }
      };
    }

    try {
      const threadReused = await this.ensureThread(userId, threadId);
      const userResult = await this.client.thread.addMessages(threadId, {
        messages: [{ role: "user", name: userId, content: input.userMessage.trim() }],
        returnContext: true
      });
      await this.client.thread.addMessages(threadId, {
        messages: [{ role: "assistant", name: "Codex", content: input.assistantMessage.trim() }]
      });
      const context = userResult.context || await this.getUserContext(threadId);
      const recentMessages = await this.getRecentMessages(threadId);

      return {
        userId,
        threadId,
        context,
        recentMessages,
        memory: {
          ...baseStatus(),
          threadReused,
          contextUsed: Boolean(context || recentMessages),
          userMessageAddedToZep: true,
          assistantMessageAddedToZep: true,
          messageAddedToZep: true,
          degraded: false
        }
      };
    } catch (error) {
      return {
        userId,
        threadId,
        context: "",
        recentMessages: "",
        memory: { ...baseStatus(), degraded: true, error: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  async seed(params: { userId?: string; threadId?: string }): Promise<ZepContextResult> {
    return this.addMessage({
      userId: params.userId,
      threadId: params.threadId,
      role: "system",
      name: "Codex",
      returnContext: true,
      content: [
        "RuntimeCore v1 is Jeff's mini-PC runtime core for conversation-governed engineering and homelab work.",
        "RuntimeCore v1 is the promoted continuation of the former project-codex scaffold.",
        "Redo Ryan and gpt-assistant are separate assistant capabilities with their own boundaries.",
        "Docs are canonical project truth; machine inspection is runtime truth; Zep is conversational/project recall assist.",
        "Jeff prefers intent-led collaboration, bounded strong moves, explicit scope changes, rigorous validation, and durable breadcrumbs.",
        "Zep is the first continuity stabilizer; Supabase, Chroma, Neo4j, Graphiti, MCP, and voice layers are later or separate work unless explicitly active."
      ].join("\n")
    });
  }

  private async getUserContext(threadId: string): Promise<string> {
    if (!this.client) return "";
    const result = await this.client.thread.getUserContext(threadId);
    return result.context || "";
  }

  private async getRecentMessages(threadId: string): Promise<string> {
    if (!this.client) return "";
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
