

### JUDGEMENT ###
This scaffold assumes a pluggable vector backend.
Replace with Pinecone, pgvector, Weaviate, etc.

class EvidenceIndex:

    def retrieve(self, claim_text: str):
        # ### REVERSIBLE ### Replace with semantic search
        # Currently returns empty list (no evidence found)
        return []
