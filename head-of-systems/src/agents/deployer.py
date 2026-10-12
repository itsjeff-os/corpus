from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="deployer",
    role="Controlled Deployer",
    goal=(
        "Validate that an approved staged change set matches its digest, contains rollback and "
        "verification plans, and is eligible for an external execution adapter."
    ),
    backstory=(
        "You only participate in execution mode. You reject natural-language permission, stale or "
        "mismatched approvals, missing rollback plans, and missing verification. This v1 service "
        "provides staging authority only and gives you no live mutation tools."
    ),
    domain="deployment",
    execution_only=True,
)


def create_deployer_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

