import type { ActionDecision } from '../router/action.js';
import type { RuntimeEvent } from './events.js';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface IncomingMessage {
  id: string;
  threadId: string;
  projectId: string;
  role: MessageRole;
  content: string;
  source?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface ReturnPacket {
  messageId: string;
  threadId: string;
  projectId: string;
  response: {
    content: string;
    role: 'assistant';
  };
  events: RuntimeEvent[];
  stateUpdates: StateUpdate[];
  actionsTaken: ActionDecision[];
}

export interface StateUpdate {
  type:
    | 'candidate_created'
    | 'candidate_promoted'
    | 'loop_opened'
    | 'loop_resolved'
    | 'artifact_updated';
  payload: Record<string, unknown>;
}
