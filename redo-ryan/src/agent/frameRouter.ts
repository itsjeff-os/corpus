import type { Frame } from "../state/ledger";
import type { Signals } from "../rituals/signals";

export function routeFrame(input: string, signals: Signals): Frame {
  const lower = input.toLowerCase();

  if (signals.containsAdversarialCue) return "adversarial";
  if (signals.containsAssumptionCue) return "audit";
  if (lower.includes("summarize") || lower.includes("checkpoint") || lower.includes("align")) return "synthesize";
  if (lower.includes("decide") || lower.includes("choose") || lower.includes("plan")) return "converge";

  return "explore";
}
