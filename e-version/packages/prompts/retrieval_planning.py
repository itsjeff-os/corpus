"""Retrieval planning prompt — asks the LLM to generate a structured retrieval plan."""

from __future__ import annotations

import json


RETRIEVAL_PLANNING_PROMPT_TEMPLATE = """\
You are the retrieval planner for the Personal Context Engine.

Given the user's message and session context, generate a structured retrieval plan.

User message: {user_message}

Session context:
{session_context}

Known entities in this session: {entity_list}

Return a JSON object with this schema:
{{
  "intent": "<one of: question_answering, network_troubleshooting, procedure_lookup, \
fact_verification, summarization, comparison, creative, unknown>",
  "entities": ["<entity names relevant to this query>"],
  "needed_context": ["<types of context needed, e.g. device_facts, vlan_rules, firewall_rules>"],
  "retrieval_modes": ["<one or more of: semantic, lexical, fact_lookup, graph_traversal, \
temporal, procedural, preference, recent_session>"],
  "freshness_requirement": "<low | normal | high>",
  "risk_level": "<low | medium | high | operational>"
}}

Return only valid JSON. Do not explain.
"""


def build_retrieval_planning_prompt(
    user_message: str,
    session_context: str = "",
    entities: list[str] | None = None,
) -> str:
    """Build the retrieval planning prompt for a given user message."""
    entity_list = json.dumps(entities or [])
    return RETRIEVAL_PLANNING_PROMPT_TEMPLATE.format(
        user_message=user_message,
        session_context=session_context or "No prior session context.",
        entity_list=entity_list,
    )
