import { ZepClient } from "@getzep/zep-cloud";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export class ZepService {
  constructor() {
    this.client = new ZepClient({
      apiKey: env.ZEP_API_KEY
    });
  }

  async ensureThread({ threadId, userId }) {
    try {
      await this.client.thread.create({
        thread_id: threadId,
        user_id: userId
      });
    } catch (err) {
      // If the thread already exists, most apps can safely continue.
      logger.debug({ err: err.message, threadId }, "thread create skipped");
    }
  }

  async addUserMessage({ threadId, userId, message }) {
    return this.client.thread.add_messages(threadId, {
      messages: [
        {
          role: "human",
          name: userId,
          content: message
        }
      ]
    });
  }

  async addAssistantMessage({ threadId, content }) {
    return this.client.thread.add_messages(threadId, {
      messages: [
        {
          role: "ai",
          name: "Assistant",
          content
        }
      ]
    });
  }

  async addUserMessageAndReturnContext({ threadId, userId, message }) {
    return this.client.thread.add_messages(threadId, {
      messages: [
        {
          role: "human",
          name: userId,
          content: message
        }
      ],
      return_context: true
    });
  }

  async getUserContext({ threadId, templateId }) {
    return this.client.thread.get_user_context(threadId, {
      ...(templateId ? { template_id: templateId } : {})
    });
  }
}
