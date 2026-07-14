export type MoveType =
  | 'question'
  | 'request_design_draft'
  | 'request_implementation'
  | 'correction'
  | 'clarification'
  | 'approval'
  | 'rejection'
  | 'status_inquiry'
  | 'meta_instruction'
  | 'ambient_context';

export type Mode =
  | 'mapping'
  | 'design'
  | 'prescription'
  | 'execution'
  | 'reflection'
  | 'clarification';

export type ActionLane =
  | 'reply_only'
  | 'state_update'
  | 'handoff'
  | 'execute'
  | 'approve_gate'
  | 'defer';

export interface ModePolicy {
  primary: Mode;
  secondary?: Mode;
  blocked: Mode[];
}

export interface ProjectConfig {
  id: string;
  name: string;
  defaultModePolicy: ModePolicy;
  routerTable: RouterTableEntry[];
}

export interface RouterTableEntry {
  trigger: string;
  moveTypes: MoveType[];
  outputMode: Mode;
  actionLane: ActionLane;
  authority: 'system' | 'user' | 'both';
}
