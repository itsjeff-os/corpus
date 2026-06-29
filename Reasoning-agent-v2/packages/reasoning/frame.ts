export interface ReasoningFrame {
  observation: string[];
  interpretation: string[];
  inference: string[];
  conclusion: string[];
  feedback: string[];
}

export function createThinReasoningFrame(observation: string): ReasoningFrame {
  return {
    observation: [observation],
    interpretation: [],
    inference: [],
    conclusion: [],
    feedback: []
  };
}
