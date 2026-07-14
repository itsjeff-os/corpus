import type { Frame } from './frames.js';
import type { Decision, OpenLoop, StateCandidate } from './state.js';

export interface ContextPack {
  activeFrames: Frame[];
  activeConstraints: string[];
  openLoops: OpenLoop[];
  recentDecisions: Decision[];
  workingState: StateCandidate[];
  blockedAssumptions: string[];
  threadSummary: string;
  projectConfig: Record<string, unknown>;
}
