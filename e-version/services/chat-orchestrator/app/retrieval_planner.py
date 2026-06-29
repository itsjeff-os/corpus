"""Retrieval Planner — generates a structured retrieval plan from a user message."""

from __future__ import annotations

import json
import logging
from typing import Any

from packages.schemas.retrieval import RetrievalIntent, RetrievalMode, RetrievalPlan

logger = logging.getLogger(__name__)

# Intent → default retrieval modes mapping
INTENT_DEFAULTS: dict[str, list[RetrievalMode]] = {
    RetrievalIntent.NETWORK_TROUBLESHOOTING: [
        RetrievalMode.FACT_LOOKUP,
        RetrievalMode.GRAPH_TRAVERSAL,
        RetrievalMode.LEXICAL,
        RetrievalMode.SEMANTIC,
    ],
    RetrievalIntent.PROCEDURE_LOOKUP: [
        RetrievalMode.PROCEDURAL,
        RetrievalMode.SEMANTIC,
    ],
    RetrievalIntent.FACT_VERIFICATION: [
        RetrievalMode.FACT_LOOKUP,
        RetrievalMode.LEXICAL,
    ],
    RetrievalIntent.QUESTION_ANSWERING: [
        RetrievalMode.SEMANTIC,
        RetrievalMode.LEXICAL,
        RetrievalMode.FACT_LOOKUP,
    ],
    RetrievalIntent.SUMMARIZATION: [
        RetrievalMode.SEMANTIC,
    ],
    RetrievalIntent.UNKNOWN: [
        RetrievalMode.SEMANTIC,
        RetrievalMode.LEXICAL,
    ],
}


class RetrievalPlanner:
    """
    Generates a RetrievalPlan from a user message and session context.

    In production: call an LLM with the retrieval_planning prompt to generate
    the plan. In this implementation, we provide a heuristic fallback that
    works without an LLM.
    """

    def plan(
        self,
        session_id: str,
        turn_id: str,
        user_message: str,
        session_context: str = "",
        known_entities: list[str] | None = None,
        llm_plan_json: str | None = None,
    ) -> RetrievalPlan:
        """
        Produce a RetrievalPlan.

        If llm_plan_json is provided (from an LLM call), parse it.
        Otherwise, fall back to heuristic classification.
        """
        if llm_plan_json:
            try:
                data = json.loads(llm_plan_json)
                return self._from_llm_output(session_id, turn_id, data)
            except (json.JSONDecodeError, KeyError) as exc:
                logger.warning("Failed to parse LLM plan JSON: %s — using heuristic fallback.", exc)

        return self._heuristic_plan(session_id, turn_id, user_message, known_entities)

    def _from_llm_output(self, session_id: str, turn_id: str, data: dict[str, Any]) -> RetrievalPlan:
        intent = RetrievalIntent(data.get("intent", RetrievalIntent.UNKNOWN))
        modes = [RetrievalMode(m) for m in data.get("retrieval_modes", ["semantic"])]
        return RetrievalPlan(
            session_id=session_id,
            turn_id=turn_id,
            intent=intent,
            entities=data.get("entities", []),
            needed_context=data.get("needed_context", []),
            retrieval_modes=modes,
            freshness_requirement=data.get("freshness_requirement", "normal"),
            risk_level=data.get("risk_level", "low"),
        )

    def _heuristic_plan(
        self,
        session_id: str,
        turn_id: str,
        user_message: str,
        known_entities: list[str] | None,
    ) -> RetrievalPlan:
        msg_lower = user_message.lower()

        # Check summarization first (before procedure since "setup" might trigger procedure)
        if any(w in msg_lower for w in ("summarize", "summary", "overview", "give me a summary")):
            intent = RetrievalIntent.SUMMARIZATION
            freshness = "normal"
            risk = "low"
        # Check procedure (more specific than network)
        elif any(w in msg_lower for w in ("how do i", "how to", "steps to", "procedure", "configure")):
            intent = RetrievalIntent.PROCEDURE_LOOKUP
            freshness = "normal"
            risk = "low"
        elif any(w in msg_lower for w in ("vlan", "network", "router", "subnet", "firewall", "mdns", "ping")):
            intent = RetrievalIntent.NETWORK_TROUBLESHOOTING
            freshness = "high"
            risk = "operational"
        elif any(w in msg_lower for w in ("is it true", "verify", "check", "confirm")):
            intent = RetrievalIntent.FACT_VERIFICATION
            freshness = "high"
            risk = "medium"
        else:
            intent = RetrievalIntent.QUESTION_ANSWERING
            freshness = "normal"
            risk = "low"

        modes = INTENT_DEFAULTS.get(intent, [RetrievalMode.SEMANTIC, RetrievalMode.LEXICAL])

        return RetrievalPlan(
            session_id=session_id,
            turn_id=turn_id,
            intent=intent,
            entities=known_entities or [],
            retrieval_modes=modes,
            freshness_requirement=freshness,
            risk_level=risk,
        )
