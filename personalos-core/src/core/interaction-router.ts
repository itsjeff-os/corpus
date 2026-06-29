import {
  CorrectInference,
  FailureRisk,
  InteractionAssessment,
  InteractionContext,
  InteractionMode,
  LikelyInference,
  ModeSelection,
  RecoveryMove
} from "../types";
import { collectCueMatches, definitionForCue } from "./cue-library";

const modePriority: InteractionMode[] = [
  "stress-test",
  "interaction-analysis",
  "scoped-co-design",
  "interpretive-unpacking",
  "casual-high-resolution",
  "context-sensitive-partner",
  "direct-evidence",
  "archivist-formatter",
  "chief-of-staff"
];

export class InteractionRouter {
  assessInteraction(turn: string, context: InteractionContext): InteractionAssessment {
    const cues = collectCueMatches(turn);
    const likelyInference = this.buildLikelyInference(cues, context);
    const correctInference = this.buildCorrectInference(cues, context);
    const optimalMode = this.selectMode(cues, context);
    const failureRisks = this.buildFailureRisks(cues, optimalMode);
    const recoveryMoves = this.buildRecoveryMoves(cues, optimalMode);

    return {
      cues,
      likelyInference,
      correctInference,
      optimalMode,
      failureRisks,
      recoveryMoves,
      summary: [
        `Likely misread: ${likelyInference.summary}`,
        `Correct read: ${correctInference.summary}`,
        `Chosen mode: ${optimalMode.mode}`
      ].join(" ")
    };
  }

  private buildLikelyInference(cues: InteractionAssessment["cues"], context: InteractionContext): LikelyInference {
    if (cues.length === 0) {
      return {
        summary: "User wants a straightforward completion from the default assistant posture.",
        rationale: "No strong schema cues were detected, so the model would likely fall back to its default mode.",
        confidence: context.priorAssessment ? 0.45 : 0.35,
        cueKinds: []
      };
    }

    const dominantCue = definitionForCue(cues[0].kind);

    return {
      summary: dominantCue.likelyInference.summary,
      rationale: dominantCue.likelyInference.rationale,
      confidence: cues[0].confidence,
      cueKinds: cues.map((cue) => cue.kind)
    };
  }

  private buildCorrectInference(cues: InteractionAssessment["cues"], context: InteractionContext): CorrectInference {
    if (cues.length === 0 && context.priorAssessment) {
      return {
        summary: `Maintain the prior working posture unless the local task clearly changes it. Previously: ${context.priorAssessment.correctInference.summary}`,
        rationale: "Continuity is the strongest available signal when the current turn has weak local cues.",
        cueKinds: []
      };
    }

    if (cues.length === 0) {
      return {
        summary: "Treat the turn as chief-of-staff intake and look for the next useful planning or action step.",
        rationale: "Absent stronger cues, the product defaults to a chief-of-staff posture.",
        cueKinds: []
      };
    }

    const uniqueSummaries: string[] = [];
    const cueKinds: CorrectInference["cueKinds"] = [];

    for (const cue of cues.slice(0, 2)) {
      const definition = definitionForCue(cue.kind);
      if (!uniqueSummaries.includes(definition.correctInference.summary)) {
        uniqueSummaries.push(definition.correctInference.summary);
      }
      cueKinds.push(cue.kind);
    }

    return {
      summary: uniqueSummaries.join(" "),
      rationale: "Correct interpretation is built from the strongest structural cues rather than tone or default completion bias.",
      cueKinds
    };
  }

  private selectMode(cues: InteractionAssessment["cues"], context: InteractionContext): ModeSelection {
    if (cues.length === 0 && context.priorAssessment) {
      return {
        mode: context.priorAssessment.optimalMode.mode,
        rationale: "No stronger local cue appeared, so the prior mode is preserved for continuity.",
        confidence: 0.52
      };
    }

    const matchedModes = cues.map((cue) => definitionForCue(cue.kind).mode);
    const selectedMode = modePriority.find((mode) => matchedModes.includes(mode)) ?? "chief-of-staff";

    return {
      mode: selectedMode,
      rationale: `Selected from matched schema cues: ${matchedModes.join(", ") || "chief-of-staff default"}.`,
      confidence: cues.length === 0 ? 0.4 : Math.min(0.98, cues[0].confidence + 0.05)
    };
  }

  private buildFailureRisks(cues: InteractionAssessment["cues"], mode: ModeSelection): FailureRisk[] {
    if (cues.length === 0) {
      return [
        {
          id: "risk-default-overcompletion",
          description: "The assistant may over-complete instead of staying incremental.",
          trigger: "Defaulting to generic helpfulness without schema cues.",
          severity: "medium",
          cueKinds: []
        }
      ];
    }

    const risks = cues.map((cue) => {
      const definition = definitionForCue(cue.kind);
      return {
        id: `risk-${cue.kind}`,
        description: definition.failureRisk.description,
        trigger: definition.failureRisk.trigger,
        severity: definition.failureRisk.severity,
        cueKinds: [cue.kind]
      };
    });

    if (mode.mode === "scoped-co-design") {
      risks.push({
        id: "risk-premature-totalization",
        description: "The orchestrator may jump from one slice into a full architecture prematurely.",
        trigger: "Treating broad scope as permission for total scope completion.",
        severity: "high",
        cueKinds: cues.map((cue) => cue.kind)
      });
    }

    return risks;
  }

  private buildRecoveryMoves(cues: InteractionAssessment["cues"], mode: ModeSelection): RecoveryMove[] {
    if (cues.length === 0) {
      return [
        {
          id: "recovery-default-chief-of-staff",
          description: "Default back to chief-of-staff triage.",
          instruction: "Offer the next useful planning or action step before expanding scope.",
          whenToApply: "When the turn does not carry enough local signal to justify a specialist mode.",
          cueKinds: []
        }
      ];
    }

    const moves = cues.map((cue) => {
      const definition = definitionForCue(cue.kind);
      return {
        id: `recovery-${cue.kind}`,
        description: definition.recoveryMove.description,
        instruction: definition.recoveryMove.instruction,
        whenToApply: definition.recoveryMove.whenToApply,
        cueKinds: [cue.kind]
      };
    });

    if (mode.mode === "scoped-co-design") {
      moves.push({
        id: "recovery-slice-before-framework",
        description: "Keep the reply to one structural layer.",
        instruction: "Constrain the response to one layer, one map, or one decision before proposing broader architecture.",
        whenToApply: "When the prompt is broad but still dialogic.",
        cueKinds: cues.map((cue) => cue.kind)
      });
    }

    return moves;
  }
}
