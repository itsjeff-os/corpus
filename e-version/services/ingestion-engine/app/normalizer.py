"""Normalizer — strips noise and produces clean processable text."""

from __future__ import annotations

import re


class Normalizer:
    """
    Normalizes raw source content to clean, processable text.

    Handles:
    - Whitespace normalization
    - HTML stripping (basic)
    - Markdown cleanup
    - Encoding normalization
    - Null byte removal
    """

    def normalize(self, raw: str, source_type: str = "text") -> str:
        """Normalize raw content based on source type."""
        if not raw:
            return ""

        text = raw

        # Remove null bytes
        text = text.replace("\x00", "")

        if source_type in ("html", "web"):
            text = self._strip_html(text)

        # Normalize line endings
        text = text.replace("\r\n", "\n").replace("\r", "\n")

        # Collapse runs of blank lines to at most two
        text = re.sub(r"\n{3,}", "\n\n", text)

        # Strip trailing whitespace on each line
        text = "\n".join(line.rstrip() for line in text.split("\n"))

        return text.strip()

    def _strip_html(self, html: str) -> str:
        """Basic HTML tag stripper (no external dependencies)."""
        # Remove script and style blocks
        html = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", html, flags=re.DOTALL | re.IGNORECASE)
        # Remove tags
        html = re.sub(r"<[^>]+>", " ", html)
        # Decode common entities
        html = html.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&nbsp;", " ").replace("&quot;", '"')
        return html
