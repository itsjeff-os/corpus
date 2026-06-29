import { applyGeneratorControls } from "./controls/generator-controls.js";
import { applyOutputBoundary } from "./controls/output-boundary.js";
import { hydrateRuntimeContext } from "./context.js";
import { generateReasoningPayload } from "./openai/generate.js";
import { insertConversationMessage, insertEvent } from "./storage/supabase.js";
import type { LoopResult, RuntimeIdentity } from "./types.js";
import { writePostTurn } from "./post-turn.js";

export async function runAssistantTurn(args: RuntimeIdentity & { message: string }): Promise<LoopResult> {
  const userMessageId = await insertConversationMessage({
    userId: args.userId,
    chatId: args.chatId,
    project: args.project ?? null,
    role: "user",
    message: args.message
  });

  const event_ids: string[] = [];
  const receivedEventId = await insertEvent({
    userId: args.userId,
    chatId: args.chatId,
    project: args.project ?? null,
    event_type: "message_received",
    source_message_id: userMessageId,
    payload: { role: "user" }
  });
  if (receivedEventId) event_ids.push(receivedEventId);

  const context = await hydrateRuntimeContext({
    userId: args.userId,
    chatId: args.chatId,
    project: args.project ?? null,
    message: args.message
  });

  const controls = applyGeneratorControls(context);
  const payload = await generateReasoningPayload({ context, controls });
  const boundary = applyOutputBoundary(payload, controls);

  if (!boundary.ok) {
    const eventId = await insertEvent({
      userId: args.userId,
      chatId: args.chatId,
      project: args.project ?? null,
      event_type: "output_boundary_violation",
      source_message_id: userMessageId,
      payload: { violations: boundary.violations, controls }
    });
    if (eventId) event_ids.push(eventId);
    throw new Error(`Output boundary violation: ${boundary.violations.join(", ")}`);
  }

  const postTurn = await writePostTurn({
    context,
    controls,
    payload,
    finalText: boundary.finalText,
    userMessageId
  });

  return {
    answer: boundary.finalText,
    reasoning_payload: payload,
    controls,
    signal_governance: context.signal_governance,
    trace: {
      conversation_user_message_id: userMessageId,
      conversation_assistant_message_id: postTurn.conversation_assistant_message_id,
      signal_event_id: postTurn.signal_event_id,
      event_ids: [...event_ids, ...postTurn.event_ids]
    }
  };
}
