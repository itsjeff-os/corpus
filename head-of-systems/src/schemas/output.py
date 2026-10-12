from __future__ import annotations

from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class Confidence(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Domain(StrEnum):
    ARCHITECTURE = "architecture"
    HOME_ASSISTANT = "home_assistant"
    NODE_RED = "node_red"
    CLOUDFLARE = "cloudflare"
    NETWORKING = "networking"
    LINUX_SSH = "linux_ssh"
    REVIEW = "review"
    DEPLOYMENT = "deployment"
    GENERAL = "general"


class SpecialistOutput(BaseModel):
    """Shared contract for every specialist and reviewer response."""

    model_config = ConfigDict(extra="forbid")

    observations: list[str] = Field(default_factory=list)
    inferences: list[str] = Field(default_factory=list)
    assumptions: list[str] = Field(default_factory=list)
    recommendation: list[str] = Field(default_factory=list)
    affected_files: list[str] = Field(default_factory=list)
    dependencies: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    next_actions: list[str] = Field(default_factory=list)
    confidence: Confidence = Confidence.MEDIUM
    domain: Domain


class ExplorationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    request_id: str
    mode: Literal["explore"] = "explore"
    summary: str
    findings: list[SpecialistOutput] = Field(default_factory=list)
    recommendation: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    next_actions: list[str] = Field(default_factory=list)
    evidence_refs: list[str] = Field(default_factory=list)
    confidence: Confidence = Confidence.MEDIUM


class ExecutionReport(BaseModel):
    model_config = ConfigDict(extra="forbid")

    request_id: str
    approval_id: str
    mode: Literal["execute"] = "execute"
    status: Literal["validated", "blocked", "failed"]
    execution_authority: Literal["staging_only"] = "staging_only"
    summary: str
    observations: list[str] = Field(default_factory=list)
    rollback_plan: list[str] = Field(default_factory=list)
    verification_results: list[str] = Field(default_factory=list)
    audit_refs: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    next_actions: list[str] = Field(default_factory=list)
    confidence: Confidence = Confidence.MEDIUM

