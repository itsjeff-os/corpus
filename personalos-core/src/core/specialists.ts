import { IntakeRequest, InteractionAssessment, NormalizedIntent, RequestedOutcome, SpecialistResult, WorkItem } from "../types";

const domainRules: Array<{ domain: NormalizedIntent["domain"]; terms: string[]; subdomain: string }> = [
  { domain: "projects", terms: ["project", "build", "launch", "roadmap", "milestone"], subdomain: "active-projects" },
  { domain: "knowledge", terms: ["learn", "study", "research", "knowledge", "insight", "note"], subdomain: "knowledge-system" },
  { domain: "operations", terms: ["system", "workflow", "automation", "orchestrate", "ops", "infrastructure"], subdomain: "life-operations" },
  { domain: "self", terms: ["habit", "health", "sleep", "journal", "routine"], subdomain: "self-management" },
  { domain: "home", terms: ["home", "flat", "room", "lighting", "property"], subdomain: "home-systems" },
  { domain: "work", terms: ["career", "job", "work"], subdomain: "professional" },
  { domain: "money", terms: ["budget", "money", "subscription", "bill", "tax"], subdomain: "finance" },
  { domain: "admin", terms: ["contract", "legal", "account", "warranty"], subdomain: "admin" },
  { domain: "media", terms: ["image", "audio", "video", "reference"], subdomain: "media" }
];

function inferRequestedOutcome(input: string, assessment: InteractionAssessment): RequestedOutcome {
  const lower = input.toLowerCase();

  if (assessment.optimalMode.mode === "stress-test") {
    return "audit";
  }
  if (/\b(review|reflect|retrospective|check-in)\b/.test(lower)) {
    return "review";
  }
  if (/\b(decide|choice|choose|tradeoff)\b/.test(lower)) {
    return "decision";
  }
  if (/\b(summarize|synthes|extract|connect)\b/.test(lower)) {
    return "synthesis";
  }
  if (/\b(write|draft|compose)\b/.test(lower)) {
    return "draft";
  }
  if (/\b(plan|focus|priorit|roadmap|strategy)\b/.test(lower)) {
    return "plan";
  }
  if (/\b(update|create|save|file|schedule|send|organize|move|delete)\b/.test(lower)) {
    return "action";
  }

  return "guidance";
}

function inferUrgency(input: string): NormalizedIntent["urgency"] {
  const lower = input.toLowerCase();

  if (/\b(today|urgent|asap|immediately|now)\b/.test(lower)) {
    return "high";
  }
  if (/\b(this week|soon|next)\b/.test(lower)) {
    return "medium";
  }

  return "low";
}

export class IntakeClassifier {
  classify(request: IntakeRequest, assessment: InteractionAssessment): {
    intent: NormalizedIntent;
    specialistResult: SpecialistResult;
  } {
    const lower = request.input.toLowerCase();
    const matched = domainRules.find((rule) => rule.terms.some((term) => lower.includes(term)));
    const requestedOutcome = inferRequestedOutcome(request.input, assessment);
    const domain = matched?.domain ?? "projects";
    const subdomain = matched?.subdomain ?? "general";
    const confidence = matched ? 0.78 : 0.52;

    const intent: NormalizedIntent = {
      domain,
      subdomain,
      requestedOutcome,
      urgency: inferUrgency(request.input),
      confidence,
      route: `${domain}.${subdomain}.${requestedOutcome}`
    };

    return {
      intent,
      specialistResult: {
        specialist: "intake-classifier",
        summary: `Routed request to ${intent.route} with ${assessment.optimalMode.mode} mode.`,
        payload: intent
      }
    };
  }
}

export interface StrategistPlan {
  summary: string;
  nextSteps: string[];
  openQuestions: string[];
  assumptions: string[];
}

export class Strategist {
  plan(workItem: WorkItem): {
    plan: StrategistPlan;
    specialistResult: SpecialistResult;
  } {
    const nextSteps = [
      `Keep the response in ${workItem.interaction.optimalMode.mode} mode.`,
      `Use ${workItem.normalizedIntent.route} as the routing spine for follow-on specialist work.`
    ];

    if (workItem.interaction.optimalMode.mode === "scoped-co-design") {
      nextSteps.unshift("Constrain the next output to one useful slice before expanding scope.");
    }

    if (workItem.normalizedIntent.requestedOutcome === "plan") {
      nextSteps.push("Turn the request into prioritized next actions, not a broad manifesto.");
    }

    if (workItem.normalizedIntent.requestedOutcome === "audit") {
      nextSteps.push("Expose assumptions, weak points, and break conditions explicitly.");
    }

    const openQuestions =
      workItem.interaction.cues.some((cue) => cue.kind === "broad-problem-iterative-preference")
        ? ["Which slice should be handled first?"]
        : ["What is the next highest-leverage follow-up after this work item?"];

    const assumptions = [
      workItem.interaction.correctInference.summary,
      `Primary domain is ${workItem.normalizedIntent.domain}.`
    ];

    const plan: StrategistPlan = {
      summary: `Chief-of-staff plan for ${workItem.normalizedIntent.route}: ${workItem.interaction.correctInference.summary}`,
      nextSteps,
      openQuestions,
      assumptions
    };

    return {
      plan,
      specialistResult: {
        specialist: "strategist",
        summary: `Prepared a ${workItem.normalizedIntent.requestedOutcome} plan with ${nextSteps.length} next steps.`,
        payload: plan
      }
    };
  }
}
