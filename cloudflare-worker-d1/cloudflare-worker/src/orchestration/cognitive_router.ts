import type { ContextBundle } from '../../../../packages/context/bundle';

export interface RouterDecision {
  currentMode: string;
  reasoningGraphDepth: 'thin' | 'expanded' | 'deep';
  strategy: string;
  contextBudget: 'minimal' | 'standard' | 'expanded';
  visibleEpistemics: 'none' | 'light' | 'explicit';
  permissionState: string;
  responseShape: string;
}

export function chooseCognitiveRoute(bundle: ContextBundle): RouterDecision {
  return {
    currentMode: bundle.cognitiveState.currentMode,
    reasoningGraphDepth: 'thin',
    strategy: 'preserve_ontology_and_move_concretely',
    contextBudget: 'standard',
    visibleEpistemics: 'light',
    permissionState: bundle.cognitiveState.actionPermissionState,
    responseShape: 'concrete_continuation'
  };
}
