"""JWT token creation and validation for the API Gateway."""

from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Any

# In production, use python-jose or PyJWT with a securely managed secret.
# Token signing is delegated to the secrets manager; this module provides
# the interface only. The actual signing key must never be committed.


@dataclass
class TokenPayload:
    sub: str
    tenant_id: str
    roles: list[str]
    exp: float
    iat: float
    extra: dict[str, Any]


def create_access_token(
    subject: str,
    tenant_id: str,
    roles: list[str],
    expires_in_seconds: int = 3600,
    signing_key: str | None = None,
) -> str:
    """
    Create a signed JWT access token.

    In production: provide signing_key from secrets manager.
    Returns a placeholder string in environments without a signing key.
    """
    if signing_key is None:
        # Raise clearly rather than silently produce an insecure token.
        raise ValueError(
            "A signing key is required to create access tokens. "
            "Provide it via the secrets manager — never hard-code it."
        )

    # Production: use python-jose / PyJWT here.
    # Example (not executed without the library):
    #   import jwt
    #   payload = {"sub": subject, "tenant_id": tenant_id, "roles": roles,
    #              "exp": time.time() + expires_in_seconds, "iat": time.time()}
    #   return jwt.encode(payload, signing_key, algorithm="HS256")
    raise NotImplementedError("Install python-jose or PyJWT to enable token signing.")


def decode_access_token(token: str, signing_key: str) -> TokenPayload:
    """
    Decode and validate a JWT access token.

    Raises ValueError if the token is invalid or expired.
    """
    raise NotImplementedError("Install python-jose or PyJWT to enable token validation.")
