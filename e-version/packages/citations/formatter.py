"""Citation formatter — renders citations in human-readable and structured forms."""

from __future__ import annotations

from typing import Any


class CitationFormatter:
    """Formats citation objects for display in answers and admin traces."""

    def format_inline(self, citation: dict[str, Any]) -> str:
        """Render a citation as an inline reference marker, e.g. [1: topology.md]."""
        source = citation.get("source", "unknown")
        excerpt = citation.get("excerpt", "")
        label = citation.get("label", source)
        if excerpt:
            return f"[{label}: \"{excerpt[:80]}...\"]" if len(excerpt) > 80 else f"[{label}: \"{excerpt}\"]"
        return f"[{label}]"

    def format_list(self, citations: list[dict[str, Any]]) -> str:
        """Render a numbered list of citations for the end of a response."""
        if not citations:
            return ""
        lines = ["**Sources:**"]
        for i, cit in enumerate(citations, start=1):
            source = cit.get("source", "unknown")
            trust = cit.get("trust_level", "")
            url = cit.get("url", "")
            line = f"{i}. {source}"
            if trust:
                line += f" ({trust})"
            if url:
                line += f" — {url}"
            lines.append(line)
        return "\n".join(lines)

    def format_structured(self, citations: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Return citations as a cleaned structured list for API responses."""
        result = []
        for cit in citations:
            result.append(
                {
                    "source": cit.get("source"),
                    "chunk_id": cit.get("chunk_id"),
                    "fact_id": cit.get("fact_id"),
                    "excerpt": cit.get("excerpt"),
                    "trust_level": cit.get("trust_level"),
                    "url": cit.get("url"),
                }
            )
        return result
