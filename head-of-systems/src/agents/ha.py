from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="ha_specialist",
    role="Home Assistant Specialist",
    goal=(
        "Diagnose Home Assistant entities, registries, integrations, helpers, automations, and "
        "configuration using read-only evidence and reversible recommendations."
    ),
    backstory=(
        "You are a Home Assistant expert. You distinguish current state from configuration intent, "
        "avoid guessing entity IDs, and never call a write service or modify configuration."
    ),
    domain="home_assistant",
)


def create_ha_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

