import pytest
from pydantic import ValidationError

from src.schemas.approval import CandidateChangeSet, ProposedChange
from src.schemas.output import Domain, SpecialistOutput


def proposed_change() -> ProposedChange:
    return ProposedChange(
        system="node_red",
        operation="config_write",
        target="flow/example",
        before={"enabled": False},
        after={"enabled": True},
        purpose="Enable the approved example flow",
    )


def test_specialist_output_uses_required_contract():
    output = SpecialistOutput(domain=Domain.ARCHITECTURE)

    assert output.observations == []
    assert output.confidence.value == "medium"
    assert set(output.model_dump()) == {
        "observations",
        "inferences",
        "assumptions",
        "recommendation",
        "affected_files",
        "dependencies",
        "risks",
        "next_actions",
        "confidence",
        "domain",
    }


def test_specialist_output_rejects_unknown_fields():
    with pytest.raises(ValidationError):
        SpecialistOutput(domain=Domain.REVIEW, invented=True)


def test_change_set_requires_rollback_before_staging():
    with pytest.raises(ValidationError, match="rollback"):
        CandidateChangeSet(
            request_id="req_1",
            objective="Test change",
            changes=[proposed_change()],
            rollback_plan=[],
            verification_plan=["Check the resulting state"],
        )


def test_change_set_requires_verification_plan():
    with pytest.raises(ValidationError, match="verification"):
        CandidateChangeSet(
            request_id="req_1",
            objective="Test change",
            changes=[proposed_change()],
            rollback_plan=["Restore the previous value"],
            verification_plan=[],
        )

