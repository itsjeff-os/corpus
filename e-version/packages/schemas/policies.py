"""Policy schemas — access control, memory gating, source permissions, sensitivity."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class PolicyType(str, Enum):
    ACCESS = "access"
    MEMORY = "memory"
    SOURCE = "source"
    SENSITIVITY = "sensitivity"


class PolicyDecision(str, Enum):
    ALLOW = "allow"
    DENY = "deny"
    REQUIRE_CONFIRMATION = "require_confirmation"
    REDACT = "redact"
    FLAG = "flag"


class Policy(BaseModel):
    """A policy rule that governs fact usage, memory updates, or source access."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: str
    user_id: str | None = None
    policy_type: PolicyType
    name: str
    description: str = ""
    conditions: dict[str, Any] = Field(default_factory=dict)
    decision: PolicyDecision
    priority: int = 0
    enabled: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}


class PolicyEvaluationContext(BaseModel):
    """Context passed to the Policy Engine for evaluation."""

    tenant_id: str
    user_id: str
    action: str
    resource_type: str
    resource_id: str | None = None
    attributes: dict[str, Any] = Field(default_factory=dict)


class PolicyEvaluationResult(BaseModel):
    """Result of evaluating policies for a given context."""

    decision: PolicyDecision
    applied_policy_ids: list[str] = Field(default_factory=list)
    reason: str = ""
    redacted_fields: list[str] = Field(default_factory=list)
    requires_confirmation: bool = False


class AccessPolicy(Policy):
    """Controls what facts and chunks may be accessed."""

    policy_type: PolicyType = PolicyType.ACCESS
    allowed_trust_levels: list[str] = Field(default_factory=list)
    denied_source_types: list[str] = Field(default_factory=list)


class MemoryPolicy(Policy):
    """Controls when and how memories may be created or updated."""

    policy_type: PolicyType = PolicyType.MEMORY
    allowed_memory_types: list[str] = Field(default_factory=list)
    requires_source_grounding: bool = True
    requires_user_confirmation: bool = False
    max_confidence_for_auto_promote: float = 0.95


class SourcePolicy(Policy):
    """Controls which sources may be queried."""

    policy_type: PolicyType = PolicyType.SOURCE
    allowed_source_types: list[str] = Field(default_factory=list)
    denied_source_ids: list[str] = Field(default_factory=list)


class SensitivityPolicy(Policy):
    """Controls handling of sensitive data — redaction, masking, flagging."""

    policy_type: PolicyType = PolicyType.SENSITIVITY
    sensitive_patterns: list[str] = Field(default_factory=list)
    redact_in_prompts: bool = True
    redact_in_responses: bool = False
    log_access: bool = True
