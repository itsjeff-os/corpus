export function clampConfidence(value: number): number {
  return Math.max(0, Math.min(1, value));
}
