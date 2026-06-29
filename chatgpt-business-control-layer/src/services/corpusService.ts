import corpus from "../../data/corpus/control-corpus.json";
import type { CorpusDocument, RequestClass, SearchResult } from "../types/contracts";

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(query: string) {
  return normalizeText(query)
    .split(/\s+/)
    .filter(Boolean);
}

function scoreDocument(document: CorpusDocument, tokens: string[]) {
  if (tokens.length === 0) {
    return 0;
  }

  const title = normalizeText(document.title);
  const text = normalizeText(document.text);
  const url = normalizeText(document.url);
  const tags = normalizeText(Object.values(document.metadata ?? {}).join(" "));
  const haystack = `${title} ${text} ${url} ${tags}`;

  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) {
      score += 8;
    }
    if (tags.includes(token)) {
      score += 6;
    }
    if (text.includes(token)) {
      score += 3;
    }
    if (haystack.startsWith(token)) {
      score += 2;
    }
  }

  const phrase = tokens.join(" ");
  if (phrase && title.includes(phrase)) {
    score += 20;
  }

  return score;
}

export class CorpusService {
  private readonly documents = corpus as CorpusDocument[];

  search(query: string, limit = 5): SearchResult[] {
    const tokens = tokenize(query);
    if (tokens.length === 0) {
      return [];
    }

    return this.documents
      .map((document) => ({
        document,
        score: scoreDocument(document, tokens)
      }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score || left.document.title.localeCompare(right.document.title))
      .slice(0, limit)
      .map(({ document }) => ({
        id: document.id,
        title: document.title,
        url: document.url
      }));
  }

  fetch(id: string): CorpusDocument | null {
    return this.documents.find((document) => document.id === id) ?? null;
  }

  fetchMany(ids: string[]) {
    return ids
      .map((id) => this.fetch(id))
      .filter((document): document is CorpusDocument => Boolean(document));
  }

  getPolicyDocuments(requestClass: RequestClass) {
    const common = ["policy-answer-contract", "policy-approved-domains", "memo-known-bad-patterns"];
    const decisionSpecific =
      requestClass === "decision_support" || requestClass === "write_candidate"
        ? ["memo-decision-support", "memo-reliability-review"]
        : ["memo-reliability-review"];
    const writeSpecific =
      requestClass === "write_candidate" ? ["policy-write-approvals"] : [];

    return this.fetchMany([...new Set([...common, ...decisionSpecific, ...writeSpecific])]);
  }
}
