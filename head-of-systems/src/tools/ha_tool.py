from __future__ import annotations

import json
from typing import Type
from urllib.parse import quote

from crewai.tools import BaseTool
from pydantic import BaseModel, Field

from src.config import get_settings

from .http import request_json


class HomeAssistantStateInput(BaseModel):
    entity_id: str | None = Field(
        default=None,
        description="Exact entity ID. Omit to list states.",
        max_length=255,
    )


class HomeAssistantStateTool(BaseTool):
    name: str = "home_assistant_read_state"
    description: str = (
        "Read Home Assistant state data. This tool can only perform GET requests and cannot call "
        "services, change state, or modify configuration."
    )
    args_schema: Type[BaseModel] = HomeAssistantStateInput

    def _run(self, entity_id: str | None = None) -> str:
        settings = get_settings()
        if not settings.home_assistant_token:
            return json.dumps({"ok": False, "configured": False, "error": "HOME_ASSISTANT_TOKEN is not configured"})
        path = "/api/states"
        if entity_id:
            path = f"{path}/{quote(entity_id, safe='._-')}"
        return request_json(
            "GET",
            f"{settings.home_assistant_base_url.rstrip('/')}{path}",
            headers={
                "Authorization": f"Bearer {settings.home_assistant_token.get_secret_value()}",
                "Accept": "application/json",
            },
            timeout=settings.request_timeout_seconds,
        )

