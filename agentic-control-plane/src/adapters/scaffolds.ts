import type { EvidenceBundle } from "../schemas.js";

export function unavailableReadOnlyEvidence(source: string, reason = "adapter not configured"): EvidenceBundle {
  return {
    evidenceId: `evidence_${source}_${Date.now()}`,
    source,
    observedAt: new Date().toISOString(),
    liveReadOnly: true,
    observations: [`${source} read-only adapter scaffold exists but is not configured: ${reason}`],
    conflicts: [],
    confidence: 0.3,
    staleStateFlags: ["unverified_live_state"]
  };
}
