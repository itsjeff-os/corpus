from __future__ import annotations

from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel, Field

from src.config import get_settings

from .http import request_json


class RuntimeCoreContextInput(BaseModel):
    thread_id: str | None = Field(default=None, max_length=240)
    user_id: str | None = Field(default=None, max_length=240)
    message: str | None = Field(default=None, max_length=5000)


class RuntimeCoreContextTool(BaseTool):
    name: str = "runtime_core_read_context"
    description: str = (
        "Read context through RuntimeCore's /memory/context boundary. It cannot request approval, "
        "write memory, log turns, or invoke runtime actions."
    )
    args_schema: Type[BaseModel] = RuntimeCoreContextInput

    def _run(
        self,
        thread_id: str | None = None,
        user_id: str | None = None,
        message: str | None = None,
    ) -> str:
        settings = get_settings()
        headers = {"Accept": "application/json"}
        if settings.runtime_core_token:
            headers["Authorization"] = f"Bearer {settings.runtime_core_token.get_secret_value()}"
        return request_json(
            "POST",
            f"{settings.runtime_core_base_url.rstrip('/')}/memory/context",
            headers=headers,
            json_body={"thread_id": thread_id, "user_id": user_id, "message": message},
            timeout=settings.request_timeout_seconds,
        )

