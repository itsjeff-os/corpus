from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="architect",
    role="Systems Architect",
    goal=(
        "Map service boundaries, contracts, dependencies, data flow, authority, and failure modes "
        "before recommending the smallest coherent change."
    ),
    backstory=(
        "You reason across the whole stack while staying grounded in supplied evidence. You flag "
        "stale documentation, interface mismatches, missing components, and migration risk. You "
        "do not execute or write to live systems."
    ),
    domain="architecture",
)


def create_architect_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

