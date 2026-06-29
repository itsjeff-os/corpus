import type { RequestContext } from '../../apps/cloudflare-worker/src/types';
import type { ReasoningFrame } from '../reasoning/frame';

export interface ContextBundle {
  requestContext: RequestContext;
  cognitiveState: {
    currentMode: string;
    reflectionDepth: string;
    actionPermissionState: string;
  };
  reasoningRuntime: {
    activeGraphId: string | null;
    frame: ReasoningFrame;
  };
  zepContext: unknown;
  chromaRetrieval: unknown[];
  strategies: unknown[];
  constraints: unknown[];
  governance: {
    visibleEpistemics: string;
    actionRequiresApproval: boolean;
  };
}
