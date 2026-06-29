"""Regression Test Sets — fixed evaluation cases for continuous quality assurance."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class EvalCase:
    """A single evaluation test case."""

    id: str
    query: str
    expected_intent: str
    expected_entities: list[str] = field(default_factory=list)
    expected_fact_ids: list[str] = field(default_factory=list)
    expected_answer_contains: list[str] = field(default_factory=list)
    should_surface_conflict: bool = False
    should_not_hallucinate: bool = True
    metadata: dict[str, Any] = field(default_factory=dict)


class RegressionTestSet:
    """
    A named collection of regression test cases.

    Used by the Eval Engine to run continuous quality checks
    after model or retrieval changes.
    """

    def __init__(self, name: str) -> None:
        self.name = name
        self._cases: list[EvalCase] = []

    def add(self, case: EvalCase) -> None:
        self._cases.append(case)

    def all(self) -> list[EvalCase]:
        return list(self._cases)

    def get(self, case_id: str) -> EvalCase | None:
        for case in self._cases:
            if case.id == case_id:
                return case
        return None

    def __len__(self) -> int:
        return len(self._cases)


def build_network_regression_set() -> RegressionTestSet:
    """Network troubleshooting regression cases."""
    rs = RegressionTestSet("network_troubleshooting")
    rs.add(
        EvalCase(
            id="net_001",
            query="Why can't my Apple TV find the NAS?",
            expected_intent="network_troubleshooting",
            expected_entities=["Apple TV", "NAS", "mDNS", "VLAN"],
            expected_answer_contains=["mDNS", "VLAN"],
            should_surface_conflict=True,
        )
    )
    rs.add(
        EvalCase(
            id="net_002",
            query="What subnet is VLAN 20 on?",
            expected_intent="fact_verification",
            expected_entities=["VLAN 20"],
            should_surface_conflict=True,
        )
    )
    return rs
