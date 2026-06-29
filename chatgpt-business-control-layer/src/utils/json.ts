export function parseJsonObject<T>(text: string): T {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace < 0 || lastBrace < 0 || firstBrace >= lastBrace) {
      throw new Error("Model output did not contain a valid JSON object.");
    }

    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as T;
  }
}

export function jsonText(value: unknown) {
  return JSON.stringify(value);
}
