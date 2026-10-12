from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field

from .approval import CandidateChangeSet


class ExploreRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    request: str = Field(min_length=1, max_length=20000)
    thread_id: str | None = Field(default=None, min_length=1, max_length=240)
    user_id: str | None = Field(default=None, min_length=1, max_length=240)


class StageRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    change_set: CandidateChangeSet


class ApproveRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    approval_id: str = Field(min_length=1, max_length=160)
    expected_digest: str = Field(min_length=64, max_length=64)
    approved_by: str = Field(min_length=1, max_length=240)


class ExecuteRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    approval_id: str = Field(min_length=1, max_length=160)
    expected_digest: str = Field(min_length=64, max_length=64)
    staged_output: CandidateChangeSet | None = None

