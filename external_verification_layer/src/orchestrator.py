

import json
from claim_extractor import ClaimExtractor
from evidence_index import EvidenceIndex
from verifier import Verifier
from patch_engine import PatchEngine

class Orchestrator:

    def __init__(self, policy_path="config/policy.json"):
        with open(policy_path) as f:
            policy = json.load(f)

        self.extractor = ClaimExtractor()
        self.index = EvidenceIndex()
        self.verifier = Verifier(policy)
        self.patcher = PatchEngine()

    def verify_response(self, llm_output: str):
        claims = self.extractor.extract(llm_output)

        def evidence_lookup(text):
            return self.index.retrieve(text)

        results = self.verifier.verify(claims, evidence_lookup)
        final_output = self.patcher.apply(llm_output, results)

        return final_output, results
