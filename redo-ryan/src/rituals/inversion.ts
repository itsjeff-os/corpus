export function inversionTest(currentDesign: string) {
  return {
    inversion: `What if we did the opposite of: ${currentDesign}?`,
    questions: [
      "What advantages appear?",
      "What risks appear?",
      "What assumptions are revealed?"
    ]
  }
}
