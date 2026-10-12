from __future__ import annotations

import json
from typing import Type
from urllib.parse import quote

from crewai.tools import BaseTool
from pydantic import BaseModel, Field

from src.config import get_settings

from .http import request_json


class ZepContextInput(BaseModel):
    thread_id: str = Field(min_length=1, max_length=240)


class ZepContextTool(BaseTool):
    name: str = "zep_read_thread_context"
    description: str = (
        "Read contextual memory for one known Zep thread. This tool does not create users or "
        "threads and cannot add or update messages."
    )
    args_schema: Type[BaseModel] = ZepContextInput

    def _run(self, thread_id: str) -> str:
        settings = get_settings()
        if not settings.zep_api_key:
            return json.dumps({"ok": False, "configured": False, "error": "ZEP_API_KEY is not configured"})
        encoded = quote(thread_id, safe="._-")
        return request_json(
            "GET",
            f"{settings.zep_api_url.rstrip('/')}/api/v2/threads/{encoded}/context",
            headers={
                "Authorization": f"Api-Key {settings.zep_api_key.get_secret_value()}",
                "Accept": "application/json",
            },
            timeout=settings.request_timeout_seconds,
        )

