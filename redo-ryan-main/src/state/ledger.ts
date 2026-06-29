// src/state/ledger.ts

export type Frame = "explore" | "converge" | "audit" | "adversarial" | "synthesize";

export interface Decision {
  decision: string;
  reason?: string;
  tradeoff?: string;
  revisitTrigger?: string;
  at: string;
}

export interface Assumption {
  assumption: string;
  evidence?: string;
  invalidation?: string;
  at: string;
}

export interface RitualRun {
  ritual: string;
  why: string;
  output: unknown;
  at: string;
}

export interface Ledger {
  turnCount: number;
  frame: Frame;

  // a compact evolving “map”
  snapshot: string[];

  decisions: Decision[];
  assumptions: Assumption[];
  openQuestions: string[];

  ritualHistory: RitualRun[];
}

export function createLedger(): Ledger {
  return {
    turnCount: 0,
    frame: "explore",
    snapshot: [],
    decisions: [],
    assumptions: [],
    openQuestions: [],
    ritualHistory: [],
  };
}
