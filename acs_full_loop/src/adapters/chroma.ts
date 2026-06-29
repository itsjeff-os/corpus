import { config } from "../config.js";
import type { RuntimeIdentity, SemanticContext } from "../types.js";

export async function getSemanticContextFromChroma(args: RuntimeIdentity & { message: string }): Promise<SemanticContext> {
  if (!config.chromaUrl) {
    return {
      source: "chroma",
      retrieved_protocols: [],
      similar_examples: [],
      pattern_references: []
    };
  }

  // Chroma deployments differ by version and hosting path.
  // This adapter returns no-op context on request failure rather than breaking the loop.
  const base = config.chromaUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/collections/${config.chromaCollection}/query`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query_texts: [args.message],
      n_results: 5
    })
  });

  if (!response.ok) {
    return {
      source: "chroma",
      retrieved_protocols: [],
      similar_examples: [],
      pattern_references: []
    };
  }

  const data = (await response.json()) as Record<string, unknown>;
  const docs = Array.isArray(data.documents) ? data.documents.flat() : [];

  return {
    source: "chroma",
    retrieved_protocols: docs,
    similar_examples: [],
    pattern_references: []
  };
}
