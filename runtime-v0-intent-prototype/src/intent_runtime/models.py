from typing import Literal

from pydantic import BaseModel, Field


AuthorityMode = Literal[
    "talk_through",
    "audit_only",
    "proposal",
    "bounded_execution",
    "approval_required",
    "blocked",
]

AmbitionLevel = Literal["small", "medium", "high", "system_shaping"]


class DomainSurface(BaseModel):
    name: str = Field(description="System, project, service, or runtime involved.")
    role: str = Field(description="Why this surface matters for the intent.")
    write_risk: Literal["none", "low", "medium", "high"]


class NextAction(BaseModel):
    label: str
    owner: Literal["user", "runtime", "agent", "gateway", "domain_service"]
    action_type: Literal["clarify", "inspect", "propose", "execute", "verify", "log"]
    requires_approval: bool
    rationale: str


class ApprovalBoundary(BaseModel):
    required: bool
    reason: str
    approval_prompt: str


class ReceiptPlan(BaseModel):
    required: bool
    fields: list[str]
    storage_hint: str


class IntentPacket(BaseModel):
    summary: str
    underlying_goal: str
    intended_user_experience: str
    capability_gain: str
    ambition_level: AmbitionLevel
    authority_mode: AuthorityMode
    domains: list[DomainSurface]
    constraints: list[str]
    open_questions: list[str]
    distortion_risk: str
    approval_boundary: ApprovalBoundary
    next_actions: list[NextAction]
    receipt_plan: ReceiptPlan
    completion_condition: str


class CompileIntentRequest(BaseModel):
    text: str = Field(min_length=1)
    project: str | None = None
    mode_hint: AuthorityMode | None = None


class CompileIntentResponse(BaseModel):
    input: CompileIntentRequest
    intent: IntentPacket

