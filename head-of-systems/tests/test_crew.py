from types import SimpleNamespace

import pytest

from src.agents import AGENT_SPECS
from src.crew import (
    CrewResultError,
    _collect_direct_evidence,
    _collect_specialist_outputs,
    _model_safe_evidence,
    _validated_execution_report,
)
from src.routing import AGENT_IDS, execution_agent_names, route_request
from src.schemas.approval import ApprovalRecord, CandidateChangeSet, ProposedChange
from src.schemas.output import Domain, ExplorationResult, SpecialistOutput


def test_all_requested_agents_exist_exactly_once():
    assert tuple(AGENT_SPECS) == AGENT_IDS


def test_only_lead_can_delegate():
    delegators = [spec.agent_id for spec in AGENT_SPECS.values() if spec.allow_delegation]

    assert delegators == ["systems_engineer_lead"]


def test_deployer_is_execution_only_and_never_in_exploration():
    assert AGENT_SPECS["deployer"].execution_only is True
    assert "deployer" not in route_request("inspect docker compose and cloudflare dns").agents
    assert "deployer" in execution_agent_names()


def test_specialists_cannot_delegate():
    for name, spec in AGENT_SPECS.items():
        if name != "systems_engineer_lead":
            assert spec.allow_delegation is False


def test_findings_are_reconstructed_from_every_task_output():
    architect = SpecialistOutput(domain=Domain.ARCHITECTURE, observations=["architecture"])
    node_red = SpecialistOutput(domain=Domain.NODE_RED, observations=["GET /flows returned 200"])
    reviewer = SpecialistOutput(domain=Domain.REVIEW, observations=["reviewed"])
    lead = ExplorationResult(request_id="req_1", summary="summary")
    result = SimpleNamespace(
        tasks_output=[
            SimpleNamespace(pydantic=architect, raw=""),
            SimpleNamespace(pydantic=node_red, raw=""),
            SimpleNamespace(pydantic=reviewer, raw=""),
            SimpleNamespace(pydantic=lead, raw=""),
        ]
    )

    findings = _collect_specialist_outputs(
        result,
        expected_domains=["architecture", "node_red", "review"],
    )

    assert [finding.domain for finding in findings] == [
        Domain.ARCHITECTURE,
        Domain.NODE_RED,
        Domain.REVIEW,
    ]


def test_missing_specialist_output_fails_closed():
    lead = ExplorationResult(request_id="req_1", summary="summary")
    result = SimpleNamespace(tasks_output=[SimpleNamespace(pydantic=lead, raw="")])

    with pytest.raises(CrewResultError, match="expected 1"):
        _collect_specialist_outputs(result, expected_domains=["architecture"])


def test_direct_evidence_uses_routed_domain_tool(monkeypatch):
    monkeypatch.setattr(
        "src.crew.NodeRedFlowsTool._run",
        lambda self: '{"ok": true, "status_code": 200, "data": []}',
    )

    evidence = _collect_direct_evidence(route_request("inspect node-red flows"))

    assert evidence == {
        "node_red": {"ok": True, "status_code": 200, "data": []},
    }


def test_private_tool_data_is_summarized_for_external_model_by_default():
    evidence = {
        "node_red": {
            "ok": True,
            "status_code": 200,
            "data": [{"id": "private-flow", "label": "Private flow name"}],
        }
    }

    safe = _model_safe_evidence(evidence, include_private=False)

    assert safe == {
        "node_red": {
            "ok": True,
            "status_code": 200,
            "data_type": "list",
            "item_count": 1,
        }
    }
    assert "private-flow" not in str(safe)


def test_execution_report_is_derived_from_approved_packet():
    record = ApprovalRecord(
        approval_id="apr_test123",
        digest="a" * 64,
        status="approved",
        approved_by="automated-test",
        change_set=CandidateChangeSet(
            request_id="req_test",
            objective="Validate a synthetic packet",
            changes=[
                ProposedChange(
                    system="synthetic",
                    operation="config_write",
                    target="staging/test.json",
                    after={"enabled": True},
                    purpose="Test deterministic validation",
                )
            ],
            rollback_plan=["Discard the staged packet"],
            verification_plan=["Verify no live mutation occurred"],
        ),
    )

    report = _validated_execution_report(record)

    assert report.status == "validated"
    assert report.execution_authority == "staging_only"
    assert report.rollback_plan == ["Discard the staged packet"]
    assert "No live mutation capability" in report.verification_results[-1]
