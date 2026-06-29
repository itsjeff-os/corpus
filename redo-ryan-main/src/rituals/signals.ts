export interface Signals {
  containsSleightWords: boolean;
  containsAdversarialCue: boolean;
  containsAssumptionCue: boolean;
  newConceptsEstimate: number;
}

const SLEIGHT_WORDS = ["just", "simply", "basically", "straightforward", "easy", "should"];
const ADVERSARIAL_CUES = ["cross-examine", "courtroom", "attack", "skeptical", "prosecute"];
const ASSUMPTION_CUES = ["assumption", "assuming", "premise", "invalidation", "evidence"];

export function extractSignals(input: string): Signals {
  const lower = input.toLowerCase();

  const containsSleightWords = SLEIGHT_WORDS.some(w => lower.includes(w));
  const containsAdversarialCue = ADVERSARIAL_CUES.some(w => lower.includes(w));
  const containsAssumptionCue = ASSUMPTION_CUES.some(w => lower.includes(w));

  // crude but useful heuristic: count "new nouns" via capitalized tokens / separators
  const tokens = input.split(/[\s,.;:()]+/).filter(Boolean);
  const newConceptsEstimate = tokens.filter(t => t.length > 6).slice(0, 20).length;

  return { containsSleightWords, containsAdversarialCue, containsAssumptionCue, newConceptsEstimate };
}
