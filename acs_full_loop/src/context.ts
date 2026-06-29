import { getSemanticContextFromChroma } from "./adapters/chroma.js";
import { getConversationalContextFromZep } from "./adapters/zep.js";
import { applySignalGovernance } from "./controls/signal-governance.js";
import { getMetacognitiveContext, getRecentMessages } from "./storage/supabase.js";
import type { RuntimeContext, RuntimeIdentity } from "./types.js";

export async function hydrateRuntimeContext(args: RuntimeIdentity & { message: string }): Promise<RuntimeContext> {
  const recentMessages = await getRecentMessages(args);
  const signalGovernance = applySignalGovernance({
    message: args.message,
    recentMessages,
    activeInstructions: [],
    statedIntent: null
  });

  const [metacognitiveContext, conversationalContext, semanticContext] = await Promise.all([
    getMetacognitiveContext(args),
    getConversationalContextFromZep(args),
    getSemanticContextFromChroma(args)
  ]);

  return {
    identity: { userId: args.userId, chatId: args.chatId, project: args.project ?? null },
    user_message: args.message,
    recent_messages: recentMessages,
    metacognitive_context: metacognitiveContext,
    conversational_context: conversationalContext,
    semantic_context: semanticContext,
    signal_governance: signalGovernance
  };
}
