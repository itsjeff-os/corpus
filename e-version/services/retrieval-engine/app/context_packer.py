"""Context Packer — selects and packs chunks into the model context budget."""

from __future__ import annotations

from typing import Any


class ContextPacker:
    """
    Selects and orders chunks for inclusion in the model context.

    Priority order:
    1. High-trust facts
    2. Conflict/stale warnings
    3. Session-relevant chunks
    4. Remaining supporting chunks (by final_score)
    """

    def pack(
        self,
        ranked_chunks: list[dict[str, Any]],
        facts: list[dict[str, Any]],
        conflicts: list[dict[str, Any]],
        max_chunks: int = 10,
        max_facts: int = 15,
    ) -> dict[str, Any]:
        """
        Pack context into ordered layers within the configured limits.

        Returns a dict with:
          - facts: selected high-trust facts
          - chunks: selected ranked chunks
          - conflicts: all detected conflicts
          - omitted_chunks: count of chunks dropped due to budget
        """
        selected_facts = facts[:max_facts]
        selected_chunks = ranked_chunks[:max_chunks]
        omitted = max(0, len(ranked_chunks) - max_chunks)

        return {
            "facts": selected_facts,
            "chunks": selected_chunks,
            "conflicts": conflicts,
            "omitted_chunks": omitted,
        }

    def bind_citations(
        self, chunks: list[dict[str, Any]], facts: list[dict[str, Any]]
    ) -> list[dict[str, Any]]:
        """
        Produce a citation list from the packed chunks and facts.

        Each citation includes source, chunk_id/fact_id, and an excerpt.
        """
        citations: list[dict[str, Any]] = []
        seen_sources: set[str] = set()

        for chunk in chunks:
            source = chunk.get("source", "unknown")
            if source not in seen_sources:
                seen_sources.add(source)
            citations.append(
                {
                    "source": source,
                    "chunk_id": chunk.get("chunk_id"),
                    "excerpt": chunk.get("content", "")[:200],
                    "trust_level": chunk.get("trust_level"),
                    "section": chunk.get("section"),
                }
            )

        for fact in facts:
            source = fact.get("source", "unknown")
            citations.append(
                {
                    "source": source,
                    "fact_id": fact.get("id"),
                    "excerpt": f"{fact.get('subject')} {fact.get('predicate')} {fact.get('value')}",
                    "trust_level": fact.get("trust_level"),
                }
            )

        return citations
