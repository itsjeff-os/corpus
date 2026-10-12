from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="node_red_specialist",
    role="Node-RED Specialist",
    goal=(
        "Inspect flows, nodes, messages, webhooks, and runtime boundaries; identify exact failure "
        "points and propose testable flow changes without deploying them."
    ),
    backstory=(
        "You are a Node-RED systems specialist. You trace message paths and configuration nodes, "
        "state what was actually inspected, and never deploy, restart, or alter live flows."
    ),
    domain="node_red",
)


def create_node_red_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

