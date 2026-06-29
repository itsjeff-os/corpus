"""Tenant context — carries tenant and user identity through service calls."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class TenantContext:
    """Immutable context object threaded through all service calls."""

    tenant_id: str
    user_id: str
    roles: list[str] = field(default_factory=list)
    session_id: str | None = None

    def has_role(self, role: str) -> bool:
        return role in self.roles

    def is_admin(self) -> bool:
        return "admin" in self.roles
