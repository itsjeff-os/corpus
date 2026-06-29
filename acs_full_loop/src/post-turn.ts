import { insertCandidateUpdate, insertConversationMessage, insertEvent, insertSignalEvent } from "./storage/supabase.js";
import type { GeneratorControlDecision, ReasoningPayload, RuntimeContext } from "./types.js";

export async function writePostTurn(args: {
  context: RuntimeContext;
  controls: GeneratorControlDecision;
  payload: ReasoningPayload;
  finalText: string;
  userMessageId?: string;
}) {
  const { context, controls, payload, finalText, userMessageId } = args;
  const identity = context.identity;
  const event_ids: string[] = [];

  const signalEventId = await insertSignalEvent({
    ...identity,
    source_message_id: userMessageId,
    signal: context.signal_governance
  });

  const assistantMessageId = await insertConversationMessage({
    ...identity,
    role: "assistant",
    message: finalText,
    metadata: {
      active_controls: controls.active_controls.map((c) => c.name),
      selected_response_mode: controls.selected_response_mode
    }
  });

  const eventId = await insertEvent({
    ...identity,
    event_type: "turn_completed",
    source_message_id: assistantMessageId,
    payload: {
      controls,
      signal_event_id: signalEventId,
      reasoning_trace: payload.trace,
      artefact_count: payload.artefacts.length
    }
  });
  if (eventId) event_ids.push(eventId);

  for (const artefact of payload.artefacts) {
    if (artefact.kind === "none") continue;
    const candidateId = await insertCandidateUpdate({
      ...identity,
      candidate_type: `artefact:${artefact.kind}`,
      content: artefact.content,
      target_system: "supabase",
      target_entity: "candidate_updates",
      source_message_ids: [userMessageId, assistantMessageId].filter(Boolean) as string[],
      source_signal_event_id: signalEventId,
      confidence: 0.7
    });

    if (candidateId) {
      const candidateEventId = await insertEvent({
        ...identity,
        event_type: "candidate_update_created",
        payload: {
          candidate_update_id: candidateId,
          artefact_name: artefact.name,
          artefact_kind: artefact.kind
        }
      });
      if (candidateEventId) event_ids.push(candidateEventId);
    }
  }

  return {
    conversation_assistant_message_id: assistantMessageId,
    signal_event_id: signalEventId,
    event_ids
  };
}
