import { z } from "zod";
import type { ModelClient } from "../models/modelClient";
import {
  assumptionAuditSchema,
  checkpointSchema,
  crossExaminationSchema,
  failureModeSchema,
  inversionTestSchema
} from "../models/schemas";
import type {
  AssumptionAuditOutput,
  CandidateOutput,
  CheckpointOutput,
  CorpusDocument,
  CrossExaminationOutput,
  FailureModeOutput,
  InversionTestOutput,
  RequestClass
} from "../types/contracts";

function evidenceSummary(evidence: CorpusDocument[]) {
  return evidence.map((document) => ({
    id: document.id,
    title: document.title,
    url: document.url,
    text: document.text
  }));
}

export class IntegrityEvaluators {
  constructor(private readonly modelClient: ModelClient) {}

  runAssumptionAudit(input: string, requestClass: RequestClass, evidence: CorpusDocument[], candidate: CandidateOutput) {
    return this.modelClient.generateStructured<AssumptionAuditOutput>({
      schema: assumptionAuditSchema,
      system: "You are an assumption audit operator. Output only valid JSON.",
      developer:
        `Review the candidate answer against the evidence and extract the active assumptions.\n` +
        `REQUEST_CLASS=${requestClass}\n` +
        `EVIDENCE=${JSON.stringify(evidenceSummary(evidence))}\n` +
        `CANDIDATE=${JSON.stringify(candidate)}\n` +
        `Return supported assumptions and a coverageRatio from 0 to 1.`,
      user: input
    });
  }

  runCrossExamination(input: string, requestClass: RequestClass, evidence: CorpusDocument[], candidate: CandidateOutput) {
    return this.modelClient.generateStructured<CrossExaminationOutput>({
      schema: crossExaminationSchema,
      system: "You are a hostile cross-examiner. Output only valid JSON.",
      developer:
        `Attack weak logic and unsupported claims in the candidate.\n` +
        `REQUEST_CLASS=${requestClass}\n` +
        `EVIDENCE=${JSON.stringify(evidenceSummary(evidence))}\n` +
        `CANDIDATE=${JSON.stringify(candidate)}\n` +
        `List contradictions and unsupportedHighRiskClaims explicitly.`,
      user: input
    });
  }

  runFailureModeWalkthrough(
    input: string,
    requestClass: RequestClass,
    evidence: CorpusDocument[],
    candidate: CandidateOutput
  ) {
    return this.modelClient.generateStructured<FailureModeOutput>({
      schema: failureModeSchema,
      system: "You are a failure-mode reviewer. Output only valid JSON.",
      developer:
        `Enumerate the main failure modes in this candidate.\n` +
        `REQUEST_CLASS=${requestClass}\n` +
        `EVIDENCE=${JSON.stringify(evidenceSummary(evidence))}\n` +
        `CANDIDATE=${JSON.stringify(candidate)}\n` +
        `Set passed=true only if the major risks are mitigated.`,
      user: input
    });
  }

  runInversionTest(input: string, requestClass: RequestClass, evidence: CorpusDocument[], candidate: CandidateOutput) {
    return this.modelClient.generateStructured<InversionTestOutput>({
      schema: inversionTestSchema,
      system: "You are an inversion-test operator. Output only valid JSON.",
      developer:
        `Invert the candidate recommendation or framing and test what we learn.\n` +
        `REQUEST_CLASS=${requestClass}\n` +
        `EVIDENCE=${JSON.stringify(evidenceSummary(evidence))}\n` +
        `CANDIDATE=${JSON.stringify(candidate)}`,
      user: input
    });
  }

  runCheckpoint(
    requestClass: RequestClass,
    evidence: CorpusDocument[],
    candidate: CandidateOutput,
    priorFindings: {
      assumptionAudit: AssumptionAuditOutput;
      crossExamination: CrossExaminationOutput;
      failureModeWalkthrough?: FailureModeOutput;
      inversionTest?: InversionTestOutput;
    }
  ) {
    return this.modelClient.generateStructured<CheckpointOutput>({
      schema: checkpointSchema,
      system: "You are a checkpoint summarizer. Output only valid JSON.",
      developer:
        `Create a compact checkpoint for the current run.\n` +
        `REQUEST_CLASS=${requestClass}\n` +
        `EVIDENCE=${JSON.stringify(evidenceSummary(evidence))}\n` +
        `CANDIDATE=${JSON.stringify(candidate)}\n` +
        `FINDINGS=${JSON.stringify(priorFindings)}`,
      user: "Summarize the current governed answer state."
    });
  }
}

export function createMockEvaluators() {
  return {
    runAssumptionAudit: async () =>
      assumptionAuditSchema.parse({
        assumptions: [
          {
            assumption: "The approved corpus is sufficient for this answer.",
            evidence: "Approved policy corpus documents were retrieved.",
            supported: true
          }
        ],
        coverageRatio: 1
      }),
    runCrossExamination: async () =>
      crossExaminationSchema.parse({
        attacks: ["What evidence supports the main answer?", "Where could this fail?", "What remains unknown?"],
        weakAssumptions: [],
        demandsForEvidence: [],
        contradictions: [],
        unsupportedHighRiskClaims: []
      }),
    runFailureModeWalkthrough: async () =>
      failureModeSchema.parse({
        failures: [
          {
            component: "evidence coverage",
            effect: "Partial evidence can weaken confidence.",
            mitigation: "Expose the gaps explicitly.",
            severity: "medium"
          }
        ],
        passed: true
      }),
    runInversionTest: async () =>
      inversionTestSchema.parse({
        inversion: "Prefer abstaining rather than over-answering.",
        advantages: ["Reduces unsupported certainty."],
        risks: ["May require more follow-up questions."],
        insights: ["Guarded responses are appropriate when evidence is thin."]
      }),
    runCheckpoint: async () =>
      checkpointSchema.parse({
        snapshot: ["Governed answer candidate reviewed."],
        decisions: ["Used approved corpus only."],
        assumptions: ["Evidence set is authoritative."],
        openQuestions: [],
        nextIteration: ["Ship the current answer if it passes all gates."]
      })
  };
}
