import { CueKind, CueMatch, InteractionMode, Severity } from "../types";

export interface CueDefinition {
  kind: CueKind;
  label: string;
  description: string;
  patterns: RegExp[];
  priority: number;
  likelyInference: {
    summary: string;
    rationale: string;
  };
  correctInference: {
    summary: string;
    rationale: string;
  };
  mode: InteractionMode;
  failureRisk: {
    description: string;
    trigger: string;
    severity: Severity;
  };
  recoveryMove: {
    description: string;
    instruction: string;
    whenToApply: string;
  };
}

const STRUCTURAL_TERMS = /(structure|pattern|architecture|system|assumption|signal|mechanism|design|derivation|reasoning)/i;

export const cueLibrary: CueDefinition[] = [
  {
    kind: "casual-playful-serious-analysis",
    label: "Casual Register Carrying Serious Analysis",
    description: "Informal or playful language combined with structural reasoning intent.",
    patterns: [
      /\b(lol|haha|lmao|messy|slop|vibe|meme-y|coded)\b/i,
      STRUCTURAL_TERMS
    ],
    priority: 60,
    likelyInference: {
      summary: "User is having a low-stakes, vibe-led exchange.",
      rationale: "Informal tone often gets misread as a request for lighter analysis."
    },
    correctInference: {
      summary: "Surface tone is casual, but the user still wants precise structural reasoning.",
      rationale: "Tone and analytical depth are decoupled."
    },
    mode: "casual-high-resolution",
    failureRisk: {
      description: "Model lowers analytical precision and gets fluffy.",
      trigger: "Classifying the turn from tone alone.",
      severity: "high"
    },
    recoveryMove: {
      description: "Anchor on the structural question, not the register.",
      instruction: "Preserve casual tone while keeping the reasoning exact.",
      whenToApply: "When informal language coexists with architecture, pattern, or mechanism talk."
    }
  },
  {
    kind: "metaphor-as-diagnosis",
    label: "Metaphor Used as Compressed Diagnosis",
    description: "Metaphor is naming a failure mode, not decorating the sentence.",
    patterns: [
      /\b(cathedral|load-bearing|traffic|incoherent coherence|compressed diagnosis)\b/i,
      /\b(feels like|is like)\b/i
    ],
    priority: 80,
    likelyInference: {
      summary: "User is being rhetorical or stylistic.",
      rationale: "Models often treat metaphor as flourish instead of signal."
    },
    correctInference: {
      summary: "The metaphor is carrying analytical payload and naming the mechanism.",
      rationale: "The image should be unpacked into structure, failure mode, and implication."
    },
    mode: "interpretive-unpacking",
    failureRisk: {
      description: "Model mirrors the imagery but misses the mechanism.",
      trigger: "Responding to the style instead of the structural point.",
      severity: "high"
    },
    recoveryMove: {
      description: "Translate image into mechanism.",
      instruction: "Preserve the metaphor, then extract the definition, failure mode, and operating signal.",
      whenToApply: "When the user uses metaphor to compress structural critique."
    }
  },
  {
    kind: "broad-problem-iterative-preference",
    label: "Broad Problem with Iterative Preference",
    description: "User names a big space but wants progress in slices.",
    patterns: [
      /\b(whole|entire|everything|architecture|system|rethink|redesign)\b/i,
      /\b(thread|slice|start|first|iterative|pull on that thread)\b/i
    ],
    priority: 95,
    likelyInference: {
      summary: "User wants a full architecture or exhaustive framework now.",
      rationale: "Broad scope language is easy to over-read as permission for a cathedral answer."
    },
    correctInference: {
      summary: "User wants the broad space explored incrementally, one structural slice at a time.",
      rationale: "Dialogic rhythm beats exhaustive completion."
    },
    mode: "scoped-co-design",
    failureRisk: {
      description: "Framework avalanche and premature overbuilding.",
      trigger: "Treating broad scope as a request for immediate completeness.",
      severity: "high"
    },
    recoveryMove: {
      description: "Constrain to one slice first.",
      instruction: "Answer with one layer, one map, or one next step, then checkpoint.",
      whenToApply: "When broad scope coexists with iterative language."
    }
  },
  {
    kind: "assumption-testing-language",
    label: "Assumption Testing",
    description: "User is asking for a derivation audit rather than a defended answer.",
    patterns: [
      /\b(assumption|assuming|premise|invalidation|evidence)\b/i,
      /\b(what would need to be true or false|sloppiest assumption|which thread breaks it)\b/i
    ],
    priority: 100,
    likelyInference: {
      summary: "User is challenging the answer aggressively.",
      rationale: "Sharp audit language can be misread as hostility."
    },
    correctInference: {
      summary: "User wants a structural audit of premises, weak points, and break conditions.",
      rationale: "The right move is to stress-test the derivation, not defend it."
    },
    mode: "stress-test",
    failureRisk: {
      description: "Model becomes defensive, hedges, or re-argues the original answer.",
      trigger: "Treating the audit request as interpersonal challenge.",
      severity: "high"
    },
    recoveryMove: {
      description: "Skip defense and inspect the premise chain directly.",
      instruction: "Name the assumption, why it matters, and what would falsify it.",
      whenToApply: "When the user is explicitly asking for breakpoints or audit."
    }
  },
  {
    kind: "interest-in-production-mechanics",
    label: "Interest in How the Answer Was Produced",
    description: "User wants causal analysis of how interpretation happened.",
    patterns: [
      /\b(why did|how did|what shaped|what signaled|how was .* derived|why .* landed)\b/i,
      /\b(interaction|interpretation|mode|frame|scope|constraint|rhythm)\b/i
    ],
    priority: 90,
    likelyInference: {
      summary: "User wants an abstract meta discussion.",
      rationale: "Questions about process are often flattened into generic prompt engineering advice."
    },
    correctInference: {
      summary: "User wants concrete causal analysis of interaction mechanics.",
      rationale: "The answer should name the exact levers that drove the output."
    },
    mode: "interaction-analysis",
    failureRisk: {
      description: "Model gives generic statements about AI misunderstanding prompts.",
      trigger: "Staying at a vague meta level.",
      severity: "medium"
    },
    recoveryMove: {
      description: "Name the specific levers.",
      instruction: "Explain the frame, scope, certainty, agency, and rhythm signals that shaped the response.",
      whenToApply: "When the user asks how the interpretation happened."
    }
  },
  {
    kind: "contextual-mode-preference",
    label: "Contextual Mode Preference",
    description: "User wants adaptive mode selection rather than one fixed persona.",
    patterns: [
      /\b(it depends|contextual|adaptive|depends on context)\b/i,
      /\b(no fixed role|no fixed persona|refusal to choose one fixed)\b/i
    ],
    priority: 70,
    likelyInference: {
      summary: "User is indecisive about how the assistant should behave.",
      rationale: "Adaptive preference can be misread as ambiguity."
    },
    correctInference: {
      summary: "User wants local task posture re-evaluated continuously instead of locking one role too early.",
      rationale: "Mode choice should be contextual and revisable."
    },
    mode: "context-sensitive-partner",
    failureRisk: {
      description: "Model locks into one role and keeps using it past its sell-by date.",
      trigger: "Hard-coding a single interaction posture.",
      severity: "medium"
    },
    recoveryMove: {
      description: "Reassess posture before continuing.",
      instruction: "Check whether the current task wants planning, audit, synthesis, or execution before replying.",
      whenToApply: "When the user rejects a fixed persona."
    }
  },
  {
    kind: "positive-response-to-direct-honesty",
    label: "Positive Response to Direct Honesty",
    description: "Trust is built by plain causal explanation, without condescension.",
    patterns: [
      /\b(receipts|attribution|be direct|plainly|honest|blunt)\b/i,
      /\b(no condescension|no flattery|cause plainly)\b/i
    ],
    priority: 75,
    likelyInference: {
      summary: "User can handle bluntness in a generic sense.",
      rationale: "This cue is often flattened into tone preference only."
    },
    correctInference: {
      summary: "User wants evidence-based causal honesty, especially about how framing and model tendencies interacted.",
      rationale: "Accuracy and attribution matter more than politeness theater."
    },
    mode: "direct-evidence",
    failureRisk: {
      description: "Model over-softens, flatters, or blame-shifts.",
      trigger: "Trying to preserve comfort over causal truth.",
      severity: "medium"
    },
    recoveryMove: {
      description: "State the cause directly with attribution.",
      instruction: "Explain what the user framing contributed and what the model tendency contributed.",
      whenToApply: "When the user values receipts and plain explanation."
    }
  },
  {
    kind: "request-for-symbolic-artifact",
    label: "Request for Symbolic Artifact",
    description: "User wants structure that is also reusable, quotable, or archivable.",
    patterns: [
      /\b(json|schema|artifact|artefact|quotable|archivable|ceremonial|package)\b/i,
      /\b(name it|naming concepts|formatter)\b/i
    ],
    priority: 65,
    likelyInference: {
      summary: "User wants a playful side quest or formatting flourish.",
      rationale: "Artifact requests can get treated as secondary theater."
    },
    correctInference: {
      summary: "User wants symbolic structure because it preserves concepts and improves reuse.",
      rationale: "Formatting is part of the thinking tool, not just decoration."
    },
    mode: "archivist-formatter",
    failureRisk: {
      description: "Model becomes too dry or dismisses the performative value.",
      trigger: "Reducing the artifact to plain output without its symbolic function.",
      severity: "low"
    },
    recoveryMove: {
      description: "Make the artifact reusable and aligned.",
      instruction: "Produce something clean enough to archive, quote, and reuse later.",
      whenToApply: "When the user explicitly asks for schema or symbolic packaging."
    }
  }
];

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function collectCueMatches(input: string): CueMatch[] {
  const matches: CueMatch[] = [];

  for (const definition of cueLibrary) {
    const evidence = unique(
      definition.patterns
        .map((pattern) => input.match(pattern)?.[0])
        .filter((value): value is string => Boolean(value))
    );

    const threshold = definition.kind === "casual-playful-serious-analysis" ||
      definition.kind === "broad-problem-iterative-preference"
      ? 2
      : 1;

    if (evidence.length < threshold) {
      continue;
    }

    matches.push({
      kind: definition.kind,
      label: definition.label,
      description: definition.description,
      evidence,
      confidence: Math.min(0.99, 0.58 + (evidence.length * 0.12) + (definition.priority / 1000))
    });
  }

  return matches.sort((left, right) => right.confidence - left.confidence);
}

export function definitionForCue(kind: CueKind): CueDefinition {
  const definition = cueLibrary.find((candidate) => candidate.kind === kind);
  if (!definition) {
    throw new Error(`Unknown cue kind: ${kind}`);
  }

  return definition;
}
