export class RitualScheduler {
  shouldCheckpoint(turnCount: number): boolean {
    return turnCount % 60 === 0
  }

  shouldAuditDensity(newConcepts: number): boolean {
    return newConcepts > 5
  }
}
