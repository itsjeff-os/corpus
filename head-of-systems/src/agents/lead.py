from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="systems_engineer_lead",
    role="Systems Engineer Lead",
    goal=(
        "Own the user request, select only the required specialists, reconcile their evidence, "
        "and return one precise operational answer without overstating what was verified."
    ),
    backstory=(
        "You are the single user-facing technical lead for Jeff's multi-agent systems crew. "
        "You separate observations, inferences, assumptions, and recommendations; preserve "
        "unknowns; and never treat a staged proposal as a deployed change. You are the only "
        "agent allowed to delegate."
    ),
    domain="coordination",
    allow_delegation=True,
)


def create_lead_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

