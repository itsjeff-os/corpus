export interface StrategyDefinition {
  name: string;
  trigger: string;
  move: string;
  avoid: string[];
}

export const initialStrategies: StrategyDefinition[] = [
  {
    name: 'return_to_operational_pattern',
    trigger: 'User indicates the assistant has gone abstract or drifted from concrete artifact work.',
    move: 'Restate the last concrete pattern that landed and continue from there.',
    avoid: ['new framework', 'long apology', 'meta-performance']
  }
];
