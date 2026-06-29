"""Audit logger — immutable audit trail for all PCE actions."""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass, field
from typing import Any


@dataclass
class AuditEvent:
    """An immutable audit event recording a significant system action."""

    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: str = ""
    user_id: str = ""
    action: str = ""
    resource_type: str = ""
    resource_id: str | None = None
    outcome: str = "success"
    attributes: dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)


class AuditLogger:
    """
    Records audit events for security, compliance, and debugging.

    In production, persist events to Postgres `audit_events` table.
    """

    def __init__(self) -> None:
        self._events: list[AuditEvent] = []

    def log(
        self,
        action: str,
        tenant_id: str,
        user_id: str,
        resource_type: str = "",
        resource_id: str | None = None,
        outcome: str = "success",
        attributes: dict[str, Any] | None = None,
    ) -> AuditEvent:
        event = AuditEvent(
            tenant_id=tenant_id,
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            outcome=outcome,
            attributes=attributes or {},
        )
        self._events.append(event)
        return event

    def get_events(
        self,
        tenant_id: str | None = None,
        user_id: str | None = None,
        action: str | None = None,
    ) -> list[AuditEvent]:
        events = self._events
        if tenant_id:
            events = [e for e in events if e.tenant_id == tenant_id]
        if user_id:
            events = [e for e in events if e.user_id == user_id]
        if action:
            events = [e for e in events if e.action == action]
        return list(events)
