export function sleightOfHand(statement: string) {
  return {
    hiddenComplexity: [
      `What complexity is being moved rather than removed?`,
      `Where does the operational burden shift?`,
      `When will this hidden complexity surface?`
    ],
    target: statement
  }
}
