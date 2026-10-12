from __future__ import annotations

from typing import Any

import httpx

from src.config import Settings


class RuntimeContextClient:
    def __init__(self, settings: Settings):
        self.settings = settings

    def _headers(self) -> dict[str, str]:
        headers = {"Accept": "application/json"}
        if self.settings.runtime_core_token:
            headers["Authorization"] = f"Bearer {self.settings.runtime_core_token.get_secret_value()}"
        return headers

    async def get_context(
        self,
        *,
        thread_id: str | None,
        user_id: str | None,
        message: str,
    ) -> dict[str, Any]:
        if not self.settings.runtime_core_base_url:
            return {"configured": False, "degraded": True, "context": ""}
        try:
            async with httpx.AsyncClient(
                timeout=self.settings.request_timeout_seconds,
                follow_redirects=False,
            ) as client:
                response = await client.post(
                    f"{self.settings.runtime_core_base_url.rstrip('/')}/memory/context",
                    headers=self._headers(),
                    json={"thread_id": thread_id, "user_id": user_id, "message": message},
                )
            response.raise_for_status()
            return {"configured": True, "degraded": False, "context": response.json()}
        except (httpx.HTTPError, ValueError) as error:
            return {
                "configured": True,
                "degraded": True,
                "context": "",
                "error": f"{type(error).__name__}: {str(error)[:300]}",
            }

    async def log_turn(
        self,
        *,
        thread_id: str | None,
        user_id: str | None,
        user_message: str,
        assistant_message: str,
    ) -> dict[str, Any]:
        if not self.settings.memory_write_enabled:
            return {"attempted": False, "reason": "MEMORY_WRITE_ENABLED is false"}
        try:
            async with httpx.AsyncClient(
                timeout=self.settings.request_timeout_seconds,
                follow_redirects=False,
            ) as client:
                response = await client.post(
                    f"{self.settings.runtime_core_base_url.rstrip('/')}/memory/turn",
                    headers=self._headers(),
                    json={
                        "thread_id": thread_id,
                        "user_id": user_id,
                        "user_message": user_message,
                        "assistant_message": assistant_message,
                    },
                )
            response.raise_for_status()
            return {"attempted": True, "ok": True}
        except httpx.HTTPError as error:
            return {"attempted": True, "ok": False, "error": f"{type(error).__name__}: {str(error)[:300]}"}

