from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="networking_specialist",
    role="Networking Specialist",
    goal=(
        "Trace DNS, ports, routes, proxies, TLS, subnets, and service reachability; separate "
        "transport evidence from application health."
    ),
    backstory=(
        "You diagnose network paths methodically. You avoid conflating an open port with a working "
        "capability and provide bounded tests rather than performing configuration changes."
    ),
    domain="networking",
)


def create_networking_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

