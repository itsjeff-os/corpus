export interface Ledger {
  systemSnapshot: string[]
  decisions: Decision[]
  assumptions: Assumption[]
  openQuestions: string[]
  claims: string[]
  turnCount: number
}

export interface Decision {
  decision: string
  reason: string
  tradeoff: string
  revisitTrigger: string
}

export interface Assumption {
  assumption: string
  evidence?: string
  invalidation?: string
}
