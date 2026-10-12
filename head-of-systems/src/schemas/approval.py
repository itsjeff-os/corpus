from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator


def utc_now() -> datetime:
    return datetime.now(UTC)


class ProposedChange(BaseModel):
    model_config = ConfigDict(extra="forbid")

    system: str = Field(min_length=1, max_length=120)
    operation: str = Field(min_length=1, max_length=120)
    target: str = Field(min_length=1, max_length=500)
    before: Any | None = None
    after: Any
    purpose: str = Field(min_length=1, max_length=2000)


class CandidateChangeSet(BaseModel):
    model_config = ConfigDict(extra="forbid")

    request_id: str = Field(min_length=1, max_length=160)
    objective: str = Field(min_length=1, max_length=5000)
    changes: list[ProposedChange] = Field(min_length=1, max_length=100)
    rollback_plan: list[str] = Field(min_length=1, max_length=100)
    verification_plan: list[str] = Field(min_length=1, max_length=100)
    stop_conditions: list[str] = Field(default_factory=list, max_length=100)
    risks: list[str] = Field(default_factory=list, max_length=100)
    evidence_refs: list[str] = Field(default_factory=list, max_length=200)

    @model_validator(mode="after")
    def rollback_precedes_change(self) -> "CandidateChangeSet":
        if not any(item.strip() for item in self.rollback_plan):
            raise ValueError("a non-empty rollback plan is required before staging")
        if not any(item.strip() for item in self.verification_plan):
            raise ValueError("a non-empty verification plan is required before staging")
        return self


class ApprovalRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    approval_id: str
    digest: str
    change_set: CandidateChangeSet
    status: Literal["pending", "approved", "consumed", "revoked"] = "pending"
    created_at: datetime = Field(default_factory=utc_now)
    approved_at: datetime | None = None
    approved_by: str | None = None
    consumed_at: datetime | None = None
    execution_report_path: str | None = None

