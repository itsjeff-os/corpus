from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Sequence

from crewai import Agent


@dataclass(frozen=True, slots=True)
class AgentSpec:
    agent_id: str
    role: str
    goal: str
    backstory: str
    domain: str
    allow_delegation: bool = False
    execution_only: bool = False

    def public_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data.pop("backstory")
        return data


def build_agent(
    spec: AgentSpec,
    llm: Any,
    tools: Sequence[Any] | None = None,
    *,
    verbose: bool = False,
) -> Agent:
    return Agent(
        role=spec.role,
        goal=spec.goal,
        backstory=spec.backstory,
        llm=llm,
        tools=list(tools or []),
        allow_delegation=spec.allow_delegation,
        verbose=verbose,
        max_iter=8,
        respect_context_window=True,
    )

