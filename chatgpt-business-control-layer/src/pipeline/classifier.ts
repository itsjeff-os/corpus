import type { RequestClass, RequestMode } from "../types/contracts";

const decisionKeywords = [
  "recommend",
  "recommendation",
  "choose",
  "choice",
  "decide",
  "decision",
  "tradeoff",
  "trade-off",
  "plan",
  "strategy",
  "option",
  "prioritize",
  "prioritise"
];

const writeKeywords = [
  "create",
  "update",
  "delete",
  "send",
  "publish",
  "write",
  "save",
  "post",
  "execute",
  "submit",
  "open a ticket",
  "file a ticket",
  "log a note"
];

export function classifyRequest(input: string, mode: RequestMode): RequestClass {
  if (mode === "knowledge") {
    return "knowledge";
  }

  if (mode === "decision_support") {
    return "decision_support";
  }

  const lower = input.toLowerCase();
  if (writeKeywords.some((keyword) => lower.includes(keyword))) {
    return "write_candidate";
  }

  if (decisionKeywords.some((keyword) => lower.includes(keyword))) {
    return "decision_support";
  }

  return "knowledge";
}
