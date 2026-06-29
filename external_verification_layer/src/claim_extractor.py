

import re

class ClaimExtractor:
    def extract(self, text: str):
        claims = []
        sentences = re.split(r'(?<=[.!?]) +', text)

        for idx, sentence in enumerate(sentences):
            claim_type = self.classify(sentence)
            claims.append({
                "id": idx,
                "text": sentence,
                "type": claim_type
            })

        return claims

    def classify(self, sentence: str):
        if re.search(r'\b\d+%\b', sentence):
            return "numeric"
        if any(word in sentence.lower() for word in ["most", "rarely", "usually"]):
            return "prevalence"
        if sentence.lower().startswith(("do ", "rotate ", "delete ", "must ")):
            return "directive"
        return "general"
