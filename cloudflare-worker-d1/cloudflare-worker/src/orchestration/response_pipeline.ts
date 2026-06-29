import type { ContextBundle } from '../../../../packages/context/bundle';
import { chooseCognitiveRoute } from './cognitive_router';

export async function runResponsePipeline(bundle: ContextBundle): Promise<{ decision: unknown; responseDraft: string }> {
  const decision = chooseCognitiveRoute(bundle);
  return {
    decision,
    responseDraft: 'Response generation placeholder. Wire through AI Gateway and model call.'
  };
}
