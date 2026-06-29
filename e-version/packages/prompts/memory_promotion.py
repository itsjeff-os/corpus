"""Memory promotion prompt — asks the LLM to evaluate candidate memories."""

from __future__ import annotations

import json


MEMORY_PROMOTION_TEMPLATE = """\
You are the memory promotion evaluator for the Personal Context Engine.

A candidate memory has been detected from the current conversation. \
Your job is to evaluate whether it should be stored as a durable memory.

Candidate memory:
{candidate_json}

Grounding sources available: {grounding_sources}

Session context summary: {session_context}

Evaluate the candidate against these criteria:
1. Is this fact clearly grounded in the provided sources (not freely inferred)?
2. Is this the type of fact that should persist across sessions (not ephemeral)?
3. Is the confidence level appropriate for the memory type?
4. Does storing this require user confirmation?

Respond with a JSON object:
{{
  "should_store": <true | false>,
  "memory_type": "<profile | preference | environment | project | procedural | relationship | session>",
  "confidence": <0.0 to 1.0>,
  "requires_confirmation": <true | false>,
  "reason": "<brief explanation>"
}}

Return only valid JSON. Do not explain outside the JSON.
"""


def build_memory_promotion_prompt(
    candidate: dict,
    grounding_sources: list[str] | None = None,
    session_context: str = "",
) -> str:
    """Build the memory promotion evaluation prompt."""
    return MEMORY_PROMOTION_TEMPLATE.format(
        candidate_json=json.dumps(candidate, indent=2),
        grounding_sources=json.dumps(grounding_sources or []),
        session_context=session_context or "No session context available.",
    )
