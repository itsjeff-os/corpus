from __future__ import annotations

import json
from typing import Any

import httpx


MAX_TOOL_OUTPUT = 24_000


def safe_json(value: Any) -> str:
    payload = json.dumps(value, ensure_ascii=False, default=str)
    if len(payload) <= MAX_TOOL_OUTPUT:
        return payload
    return json.dumps(
        {
            "truncated": True,
            "original_characters": len(payload),
            "preview": payload[:MAX_TOOL_OUTPUT],
        },
        ensure_ascii=False,
    )


def request_json(
    method: str,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    json_body: dict[str, Any] | None = None,
    timeout: float = 15,
) -> str:
    try:
        with httpx.Client(timeout=timeout, follow_redirects=False) as client:
            response = client.request(method, url, headers=headers, json=json_body)
        if response.status_code >= 400:
            return safe_json(
                {
                    "ok": False,
                    "status_code": response.status_code,
                    "error": "upstream request failed",
                }
            )
        try:
            data = response.json()
        except ValueError:
            data = {"text": response.text[:MAX_TOOL_OUTPUT]}
        return safe_json({"ok": True, "status_code": response.status_code, "data": data})
    except httpx.HTTPError as error:
        return safe_json({"ok": False, "error": type(error).__name__, "detail": str(error)[:500]})

