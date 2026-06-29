import type {
  CandidateOutput,
  CrossExaminationOutput,
  FailureModeOutput,
  IntegrityCheck,
  RequestClass
} from "../types/contracts";

interface ScoreParams {
  requestClass: RequestClass;
  candidate: CandidateOutput;
  evidenceCoverage: number;
  crossExamination: CrossExaminationOutput;
  failureModeWalkthrough?: FailureModeOutput;
}

export function buildIntegrityChecks({
  requestClass,
  candidate,
  evidenceCoverage,
  crossExamination,
  failureModeWalkthrough
}: ScoreParams): IntegrityCheck[] {
  const tradeoffsPresent = (candidate.tradeoffs?.length ?? 0) > 0;
  const revisitPresent = (candidate.revisitTriggers?.length ?? 0) > 0;
  const assumptionsPresent = candidate.assumptions.length > 0;
  const contradictions = crossExamination.contradictions.length;
  const unsupportedHighRiskClaims = crossExamination.unsupportedHighRiskClaims.length;

  const checks: IntegrityCheck[] = [
    {
      name: "evidence_coverage",
      passed: requestClass === "knowledge" ? evidenceCoverage >= 0.8 : evidenceCoverage >= 0.6,
      expected: requestClass === "knowledge" ? ">= 0.80" : ">= 0.60",
      observed: evidenceCoverage.toFixed(2)
    },
    {
      name: "contradictions",
      passed: contradictions === 0,
      expected: "0",
      observed: String(contradictions),
      details: crossExamination.contradictions
    },
    {
      name: "unsupported_high_risk_claims",
      passed: unsupportedHighRiskClaims === 0,
      expected: "0",
      observed: String(unsupportedHighRiskClaims),
      details: crossExamination.unsupportedHighRiskClaims
    },
    {
      name: "assumptions_present",
      passed: assumptionsPresent,
      expected: "> 0",
      observed: String(candidate.assumptions.length)
    }
  ];

  if (requestClass === "decision_support" || requestClass === "write_candidate") {
    checks.push(
      {
        name: "tradeoffs_present",
        passed: tradeoffsPresent,
        expected: "> 0",
        observed: String(candidate.tradeoffs?.length ?? 0)
      },
      {
        name: "revisit_triggers_present",
        passed: revisitPresent,
        expected: "> 0",
        observed: String(candidate.revisitTriggers?.length ?? 0)
      },
      {
        name: "failure_mode_review",
        passed: failureModeWalkthrough?.passed ?? false,
        expected: "passed",
        observed: failureModeWalkthrough?.passed ? "passed" : "failed",
        details: failureModeWalkthrough?.failures.map((failure) => `${failure.component}: ${failure.effect}`)
      }
    );
  }

  return checks;
}

export function scoreIntegrity(params: ScoreParams) {
  const checks = buildIntegrityChecks(params);
  const contradictions = params.crossExamination.contradictions.length;
  const unsupported = params.crossExamination.unsupportedHighRiskClaims.length;
  const highSeverityFailures =
    params.failureModeWalkthrough?.failures.filter((failure) => failure.severity === "high").length ?? 0;
  const mediumSeverityFailures =
    params.failureModeWalkthrough?.failures.filter((failure) => failure.severity === "medium").length ?? 0;

  let score = 100;
  score -= contradictions * 20;
  score -= unsupported * 25;
  score -= Math.round((1 - params.evidenceCoverage) * (params.requestClass === "knowledge" ? 25 : 20));
  score -= Math.max(0, 2 - params.candidate.citations.length) * 5;
  score -= Math.min(params.candidate.gaps.length, 5) * 2;

  if (!params.candidate.assumptions.length) {
    score -= 10;
  }

  if (params.requestClass === "decision_support" || params.requestClass === "write_candidate") {
    if (!params.candidate.tradeoffs?.length) {
      score -= 10;
    }
    if (!params.candidate.revisitTriggers?.length) {
      score -= 10;
    }
    score -= highSeverityFailures * 8;
    score -= mediumSeverityFailures * 4;
    if (!params.failureModeWalkthrough?.passed) {
      score -= 8;
    }
  }

  score = Math.max(0, Math.min(100, score));
  return {
    score,
    checks
  };
}

export function passesHardGate(
  requestClass: RequestClass,
  score: number,
  evidenceCoverage: number,
  contradictions: number,
  unsupportedHighRiskClaims: number,
  candidate: CandidateOutput,
  failureModeWalkthrough?: FailureModeOutput
) {
  if (requestClass === "knowledge") {
    return (
      score >= 85 &&
      contradictions === 0 &&
      evidenceCoverage >= 0.8 &&
      unsupportedHighRiskClaims === 0
    );
  }

  if (requestClass === "decision_support") {
    return (
      score >= 80 &&
      contradictions === 0 &&
      Boolean(candidate.tradeoffs?.length) &&
      Boolean(candidate.assumptions.length) &&
      Boolean(candidate.revisitTriggers?.length) &&
      Boolean(failureModeWalkthrough?.passed)
    );
  }

  return (
    score >= 80 &&
    contradictions === 0 &&
    unsupportedHighRiskClaims === 0 &&
    Boolean(candidate.writeIntent)
  );
}
