import type { Ledger, Frame } from "../state/ledger";
import type { Signals } from "../rituals/signals";

export type RitualName =
  | "checkpoint"
  | "assumption_audit"
  | "sleight_of_hand"
  | "inversion_test"
  | "failure_mode_walkthrough"
  | "cross_examination";

export interface RitualPlanItem {
  name: RitualName;
  why: string;
}

export class RitualEngine {
  constructor(private checkpointIntervalTurns = 60) {}

  plan(ledger: Ledger, frame: Frame, signals: Signals): RitualPlanItem[] {
    const items: RitualPlanItem[] = [];

    // Ritualized checkpoint
    if (ledger.turnCount > 0 && ledger.turnCount % this.checkpointIntervalTurns === 0) {
      items.push({ name: "checkpoint", why: `Ritual checkpoint at turn ${ledger.turnCount}.` });
      return items; // checkpoints stand alone by default
    }

    // Sleight-of-hand detector
    if (signals.containsSleightWords) {
      items.push({ name: "sleight_of_hand", why: `Detected sleight-of-hand language (e.g., “just/simply”).` });
    }

    // Frame-specific defaults
    if (frame === "audit") {
      items.push({ name: "assumption_audit", why: `Audit frame requested or detected.` });
    }

    if (frame === "adversarial") {
      items.push({ name: "cross_examination", why: `Adversarial frame requested or detected.` });
    }

    // Exploration booster: periodic inversion test when exploring and concepts are dense
    if (frame === "explore" && signals.newConceptsEstimate >= 8) {
      items.push({ name: "inversion_test", why: `High conceptual density; run inversion to prevent path-lock.` });
    }

    // Optional: always add failure-mode for converge decisions
    if (frame === "converge") {
      items.push({ name: "failure_mode_walkthrough", why: `Convergence implies decisions; test failure modes.` });
    }

    // Keep it minimal: cap rituals per turn
    return items.slice(0, 2);
  }
}
