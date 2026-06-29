

import json

class Verifier:

    def __init__(self, policy):
        self.policy = policy

    def verify(self, claims, evidence_lookup):
        results = []

        for claim in claims:
            evidence = evidence_lookup(claim["text"])
            verdict = self.evaluate_claim(claim, evidence)
            results.append({
                "claim_id": claim["id"],
                "verdict": verdict,
                "evidence_found": bool(evidence)
            })

        return results

    def evaluate_claim(self, claim, evidence):
        if claim["type"] in ["numeric", "prevalence"]:
            if not evidence:
                return "rewrite"
        return "allow"
