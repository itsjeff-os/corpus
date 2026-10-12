import pytest

from src.schemas.approval import CandidateChangeSet, ProposedChange
from src.schemas.output import ExecutionReport
from src.services.approval_store import ApprovalConflict, ApprovalStore


def change_set(after: bool = True) -> CandidateChangeSet:
    return CandidateChangeSet(
        request_id="req_test",
        objective="Toggle an example staged configuration",
        changes=[
            ProposedChange(
                system="node_red",
                operation="config_write",
                target="flow/example",
                before={"enabled": False},
                after={"enabled": after},
                purpose="Exercise approval integrity",
            )
        ],
        rollback_plan=["Restore enabled=false from the captured before value"],
        verification_plan=["Read the staged artifact and compare the expected value"],
        stop_conditions=["Stop if the digest changes"],
    )


def test_approval_happy_path_is_one_time(tmp_path):
    store = ApprovalStore(tmp_path)
    staged = store.stage(change_set())
    approved = store.approve(staged.approval_id, staged.digest, "jeff")

    verified = store.verify_for_execution(approved.approval_id, approved.digest, change_set())
    report = ExecutionReport(
        request_id="req_test",
        approval_id=approved.approval_id,
        status="validated",
        summary="Packet is eligible for an external executor; no live mutation occurred.",
        rollback_plan=change_set().rollback_plan,
        verification_results=["Approval and digest validated"],
    )
    consumed = store.record_execution(verified, report)

    assert consumed.status == "consumed"
    assert (tmp_path / consumed.execution_report_path).exists()
    with pytest.raises(ApprovalConflict, match="approved"):
        store.verify_for_execution(consumed.approval_id, consumed.digest)


def test_digest_mismatch_fails_closed(tmp_path):
    store = ApprovalStore(tmp_path)
    staged = store.stage(change_set())

    with pytest.raises(ApprovalConflict, match="digest"):
        store.approve(staged.approval_id, "0" * 64, "jeff")


def test_changed_staged_output_is_rejected(tmp_path):
    store = ApprovalStore(tmp_path)
    staged = store.stage(change_set())
    approved = store.approve(staged.approval_id, staged.digest, "jeff")

    with pytest.raises(ApprovalConflict, match="staged output"):
        store.verify_for_execution(approved.approval_id, approved.digest, change_set(after=False))


def test_audit_ledger_records_transitions(tmp_path):
    store = ApprovalStore(tmp_path)
    staged = store.stage(change_set())
    store.approve(staged.approval_id, staged.digest, "jeff")

    ledger = (tmp_path / "audit.jsonl").read_text(encoding="utf-8")
    assert "change_set_staged" in ledger
    assert "approval_granted" in ledger

