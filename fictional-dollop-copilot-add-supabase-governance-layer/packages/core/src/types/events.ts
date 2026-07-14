import { z } from 'zod';

export type EventType =
  | 'user_message_received'
  | 'move_classified'
  | 'mode_determined'
  | 'signals_governed'
  | 'frames_assessed'
  | 'context_compiled'
  | 'response_planned'
  | 'llm_response_received'
  | 'state_impact_assessed'
  | 'action_routed'
  | 'return_packet_built'
  | 'reconciliation_complete';

export type Stage =
  | 'ingress'
  | 'move_classifier'
  | 'mode_router'
  | 'signal_governance'
  | 'frame_uptake'
  | 'context_compiler'
  | 'response_planner'
  | 'primary_reasoning'
  | 'state_impact'
  | 'action_router'
  | 'return_packet'
  | 'reconciliation';

export interface RuntimeEvent {
  id: string;
  threadId: string;
  messageId?: string;
  eventType: EventType;
  stage: Stage;
  payload: Record<string, unknown>;
  timestamp: string;
}

export const eventTypeSchema = z.enum([
  'user_message_received',
  'move_classified',
  'mode_determined',
  'signals_governed',
  'frames_assessed',
  'context_compiled',
  'response_planned',
  'llm_response_received',
  'state_impact_assessed',
  'action_routed',
  'return_packet_built',
  'reconciliation_complete',
]);

export const stageSchema = z.enum([
  'ingress',
  'move_classifier',
  'mode_router',
  'signal_governance',
  'frame_uptake',
  'context_compiler',
  'response_planner',
  'primary_reasoning',
  'state_impact',
  'action_router',
  'return_packet',
  'reconciliation',
]);

export const runtimeEventSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string(),
  messageId: z.string().optional(),
  eventType: eventTypeSchema,
  stage: stageSchema,
  payload: z.record(z.unknown()),
  timestamp: z.string(),
});
