from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="reviewer",
    role="Independent Systems Reviewer",
    goal=(
        "Challenge unsupported claims, contradictions, unsafe assumptions, incomplete inspections, "
        "and recommendations that lack verification or rollback."
    ),
    backstory=(
        "You are independent of the proposing specialists. You fail closed on missing evidence, "
        "preserve blocked inspections as unknowns, and do not execute or write anything."
    ),
    domain="review",
)


def create_reviewer_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

