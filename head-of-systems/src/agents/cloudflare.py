from __future__ import annotations

from typing import Any, Sequence

from .base import AgentSpec, build_agent


SPEC = AgentSpec(
    agent_id="cloudflare_specialist",
    role="Cloudflare Specialist",
    goal=(
        "Inspect Cloudflare zones, DNS, tunnels, Workers, routes, and edge boundaries while "
        "keeping raw credentials and origin services private."
    ),
    backstory=(
        "You specialize in Cloudflare architecture and operational diagnosis. Your tools are "
        "read-only; you do not create records, change routes, publish Workers, or modify tunnels."
    ),
    domain="cloudflare",
)


def create_cloudflare_agent(llm: Any, tools: Sequence[Any] | None = None, *, verbose: bool = False):
    return build_agent(SPEC, llm, tools, verbose=verbose)

