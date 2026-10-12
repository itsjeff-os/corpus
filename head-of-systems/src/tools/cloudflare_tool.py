from __future__ import annotations

import json
from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel

from src.config import get_settings

from .http import request_json


class CloudflareZoneInput(BaseModel):
    pass


class CloudflareZoneTool(BaseTool):
    name: str = "cloudflare_read_zone"
    description: str = (
        "Read the configured Cloudflare zone summary. The endpoint and zone ID are fixed by "
        "configuration; this tool cannot change DNS, tunnels, routes, or Workers."
    )
    args_schema: Type[BaseModel] = CloudflareZoneInput

    def _run(self) -> str:
        settings = get_settings()
        if not settings.cloudflare_api_token or not settings.cloudflare_zone_id:
            return json.dumps(
                {
                    "ok": False,
                    "configured": False,
                    "error": "CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID are required",
                }
            )
        return request_json(
            "GET",
            f"{settings.cloudflare_api_url.rstrip('/')}/zones/{settings.cloudflare_zone_id}",
            headers={
                "Authorization": f"Bearer {settings.cloudflare_api_token.get_secret_value()}",
                "Accept": "application/json",
            },
            timeout=settings.request_timeout_seconds,
        )

