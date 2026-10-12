from __future__ import annotations

from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel

from src.config import get_settings

from .http import request_json


class NodeRedFlowsInput(BaseModel):
    pass


class NodeRedFlowsTool(BaseTool):
    name: str = "node_red_read_flows"
    description: str = (
        "Read the current Node-RED flow document with GET /flows. This tool cannot deploy flows, "
        "invoke admin mutations, or restart Node-RED."
    )
    args_schema: Type[BaseModel] = NodeRedFlowsInput

    def _run(self) -> str:
        settings = get_settings()
        headers = {"Accept": "application/json"}
        if settings.node_red_token:
            headers["Authorization"] = f"Bearer {settings.node_red_token.get_secret_value()}"
        return request_json(
            "GET",
            f"{settings.node_red_base_url.rstrip('/')}/flows",
            headers=headers,
            timeout=settings.request_timeout_seconds,
        )

