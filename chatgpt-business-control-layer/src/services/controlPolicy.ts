import type { CandidateOutput, CorpusDocument, RequestClass } from "../types/contracts";

export function buildEvidenceSet(input: string, requestClass: RequestClass, documents: CorpusDocument[]) {
  return {
    input,
    requestClass,
    documents: documents.map((document) => ({
      id: document.id,
      title: document.title,
      url: document.url,
      text: document.text,
      metadata: document.metadata ?? {}
    }))
  };
}

export function buildCandidatePrompt(input: string, requestClass: RequestClass, evidence: CorpusDocument[]) {
  const evidenceBlock = evidence
    .map(
      (document) =>
        `SOURCE ${document.id}\nTITLE: ${document.title}\nURL: ${document.url}\nTEXT: ${document.text}`
    )
    .join("\n\n");

  const modeInstructions =
    requestClass === "knowledge"
      ? "Answer as a governed factual assistant. Use only supported evidence. If evidence is partial, expose gaps instead of guessing."
      : requestClass === "decision_support"
        ? "Answer as a governed decision-support assistant. Include tradeoffs, assumptions, and revisit triggers."
        : "Answer as a governed assistant that may identify a write candidate, but do not execute writes. Only propose a write intent if strongly justified by the request.";

  return {
    system:
      "You are a governed answer generator. Output only valid JSON. Never include markdown. Never invent citations or claims not supported by the evidence.",
    developer:
      `${modeInstructions}\n` +
      `Return fields: answer, assumptions, confidence, gaps, proposedActions, citations, tradeoffs, revisitTriggers, clarificationQuestion, highRiskClaims, writeIntent.\n` +
      `Citations must be source IDs from the supplied evidence.\n` +
      `If evidence is insufficient, answer cautiously and set a clarificationQuestion or gaps.\n` +
      `EVIDENCE:\n${evidenceBlock}`,
    user: input
  };
}

export function buildRegenerationPrompt(
  input: string,
  requestClass: RequestClass,
  evidence: CorpusDocument[],
  candidate: CandidateOutput,
  issues: string[]
) {
  const base = buildCandidatePrompt(input, requestClass, evidence);
  return {
    system: base.system,
    developer:
      `${base.developer}\n` +
      `The previous draft failed integrity checks.\n` +
      `FAILED_ISSUES=${JSON.stringify(issues)}\n` +
      `PREVIOUS_CANDIDATE=${JSON.stringify(candidate)}\n` +
      `Revise the answer to fix the issues without adding unsupported claims.`
  };
}
