export function crossExamine(claim: string) {
  return {
    attacks: [
      `What evidence supports "${claim}"?`,
      `What assumptions does this claim depend on?`,
      `What would invalidate this claim?`,
      `What failure modes does this introduce?`
    ]
  }
}
