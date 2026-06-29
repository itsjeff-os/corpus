import { config } from "../config.js";
import type { ConversationalContext, RuntimeIdentity } from "../types.js";

export async function getConversationalContextFromZep(args: RuntimeIdentity & { message: string }): Promise<ConversationalContext> {
  if (!config.zepApiUrl || !config.zepApiKey) {
    return {
      source: "zep",
      user_context: "",
      relevant_facts: [],
      recent_thread_summary: ""
    };
  }

  // Adapter intentionally keeps the contract stable while allowing Zep API shape to evolve.
  // Replace endpoint paths here with the concrete Zep project endpoints in use.
  const response = await fetch(`${config.zepApiUrl.replace(/\/$/, "")}/context`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${config.zepApiKey}`
    },
    body: JSON.stringify({
      user_id: args.userId,
      chat_id: args.chatId,
      project: args.project ?? null,
      message: args.message
    })
  });

  if (!response.ok) {
    return {
      source: "zep",
      user_context: "",
      relevant_facts: [],
      recent_thread_summary: ""
    };
  }

  const data = (await response.json()) as Partial<ConversationalContext>;

  return {
    source: "zep",
    user_context: data.user_context ?? "",
    relevant_facts: data.relevant_facts ?? [],
    recent_thread_summary: data.recent_thread_summary ?? ""
  };
}
