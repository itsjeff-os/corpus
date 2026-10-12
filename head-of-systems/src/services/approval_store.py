from __future__ import annotations

import hashlib
import hmac
import json
import os
import threading
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from src.schemas.approval import ApprovalRecord, CandidateChangeSet
from src.schemas.output import ExecutionReport


class ApprovalNotFound(LookupError):
    pass


class ApprovalConflict(ValueError):
    pass


def _now() -> datetime:
    return datetime.now(UTC)


def change_set_digest(change_set: CandidateChangeSet) -> str:
    canonical = json.dumps(
        change_set.model_dump(mode="json"),
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return hashlib.sha256(canonical).hexdigest()


class ApprovalStore:
    """File-backed, fail-closed approval and audit store."""

    def __init__(self, root: Path):
        self.root = root
        self.approvals_dir = root / "approvals"
        self.executions_dir = root / "executions"
        self.audit_path = root / "audit.jsonl"
        self._lock = threading.RLock()
        self.approvals_dir.mkdir(parents=True, exist_ok=True)
        self.executions_dir.mkdir(parents=True, exist_ok=True)

    def stage(self, change_set: CandidateChangeSet) -> ApprovalRecord:
        with self._lock:
            record = ApprovalRecord(
                approval_id=f"apr_{uuid4().hex}",
                digest=change_set_digest(change_set),
                change_set=change_set,
            )
            self._write_record(record)
            self._audit(
                "change_set_staged",
                record.approval_id,
                {"digest": record.digest, "request_id": change_set.request_id},
            )
            return record

    def get(self, approval_id: str) -> ApprovalRecord:
        path = self._record_path(approval_id)
        try:
            return ApprovalRecord.model_validate_json(path.read_text(encoding="utf-8"))
        except FileNotFoundError as error:
            raise ApprovalNotFound(f"approval {approval_id} was not found") from error

    def approve(self, approval_id: str, expected_digest: str, approved_by: str) -> ApprovalRecord:
        with self._lock:
            record = self.get(approval_id)
            self._require_digest(record, expected_digest)
            if record.status != "pending":
                raise ApprovalConflict(f"approval must be pending, not {record.status}")
            record.status = "approved"
            record.approved_at = _now()
            record.approved_by = approved_by
            self._write_record(record)
            self._audit(
                "approval_granted",
                record.approval_id,
                {"digest": record.digest, "approved_by": approved_by},
            )
            return record

    def verify_for_execution(
        self,
        approval_id: str,
        expected_digest: str,
        staged_output: CandidateChangeSet | None = None,
    ) -> ApprovalRecord:
        with self._lock:
            record = self.get(approval_id)
            self._require_digest(record, expected_digest)
            if record.status != "approved":
                raise ApprovalConflict(f"approval must be approved, not {record.status}")
            if staged_output is not None:
                supplied_digest = change_set_digest(staged_output)
                if not hmac.compare_digest(record.digest, supplied_digest):
                    raise ApprovalConflict("staged output does not match the approved digest")
            if not record.change_set.rollback_plan:
                raise ApprovalConflict("approved change set has no rollback plan")
            if not record.change_set.verification_plan:
                raise ApprovalConflict("approved change set has no verification plan")
            return record

    def record_execution(self, record: ApprovalRecord, report: ExecutionReport) -> ApprovalRecord:
        with self._lock:
            current = self.get(record.approval_id)
            if current.status != "approved":
                raise ApprovalConflict(f"approval must be approved, not {current.status}")
            path = self.executions_dir / f"{current.approval_id}.json"
            self._atomic_write(path, report.model_dump_json(indent=2))
            current.status = "consumed"
            current.consumed_at = _now()
            current.execution_report_path = str(path.relative_to(self.root))
            self._write_record(current)
            self._audit(
                "approval_consumed",
                current.approval_id,
                {
                    "digest": current.digest,
                    "execution_status": report.status,
                    "report": current.execution_report_path,
                },
            )
            return current

    def revoke(self, approval_id: str) -> ApprovalRecord:
        with self._lock:
            record = self.get(approval_id)
            if record.status not in {"pending", "approved"}:
                raise ApprovalConflict(f"cannot revoke approval in status {record.status}")
            record.status = "revoked"
            self._write_record(record)
            self._audit("approval_revoked", record.approval_id, {"digest": record.digest})
            return record

    def _record_path(self, approval_id: str) -> Path:
        if not approval_id.startswith("apr_") or not approval_id[4:].isalnum():
            raise ApprovalNotFound("invalid approval id")
        return self.approvals_dir / f"{approval_id}.json"

    def _write_record(self, record: ApprovalRecord) -> None:
        self._atomic_write(self._record_path(record.approval_id), record.model_dump_json(indent=2))

    @staticmethod
    def _require_digest(record: ApprovalRecord, expected_digest: str) -> None:
        if not hmac.compare_digest(record.digest, expected_digest):
            raise ApprovalConflict("approval digest mismatch")

    @staticmethod
    def _atomic_write(path: Path, content: str) -> None:
        temporary = path.with_suffix(f"{path.suffix}.{uuid4().hex}.tmp")
        temporary.write_text(content, encoding="utf-8")
        os.replace(temporary, path)

    def _audit(self, event: str, approval_id: str, details: dict[str, Any]) -> None:
        entry = {
            "event_id": f"evt_{uuid4().hex}",
            "event": event,
            "approval_id": approval_id,
            "timestamp": _now().isoformat(),
            "details": details,
        }
        with self.audit_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(entry, sort_keys=True, default=str) + "\n")

