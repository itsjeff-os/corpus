import type { Env, RequestContext } from '../types';
import type { ContextBundle } from '../../../../packages/context/bundle';
import { createThinReasoningFrame } from '../../../../packages/reasoning/frame';

export async function buildContextBundle(requestContext: RequestContext, env: Env): Promise<ContextBundle> {
  return {
    requestContext,
    cognitiveState: {
      currentMode: 'mapping',
      reflectionDepth: 'light',
      actionPermissionState: 'suggest_only'
    },
    reasoningRuntime: {
      activeGraphId: null,
      frame: createThinReasoningFrame('Context hydration requested')
    },
    zepContext: null,
    chromaRetrieval: [],
    strategies: [],
    constraints: [],
    governance: {
      visibleEpistemics: 'minimal_unless_useful',
      actionRequiresApproval: true
    }
  };
}
