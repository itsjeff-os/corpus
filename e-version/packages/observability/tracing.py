"""Distributed tracing support for the Personal Context Engine."""

from __future__ import annotations

import time
import uuid
from contextlib import contextmanager
from dataclasses import dataclass, field
from typing import Any, Generator


@dataclass
class Span:
    """A single operation within a distributed trace."""

    trace_id: str
    span_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    parent_span_id: str | None = None
    name: str = ""
    service: str = ""
    started_at: float = field(default_factory=time.time)
    ended_at: float | None = None
    attributes: dict[str, Any] = field(default_factory=dict)
    events: list[dict[str, Any]] = field(default_factory=list)
    status: str = "ok"
    error: str | None = None

    @property
    def duration_ms(self) -> float | None:
        if self.ended_at is not None:
            return (self.ended_at - self.started_at) * 1000
        return None

    def finish(self, status: str = "ok", error: str | None = None) -> None:
        self.ended_at = time.time()
        self.status = status
        self.error = error

    def add_event(self, name: str, attributes: dict[str, Any] | None = None) -> None:
        self.events.append({"name": name, "timestamp": time.time(), "attributes": attributes or {}})

    def set_attribute(self, key: str, value: Any) -> None:
        self.attributes[key] = value


class Tracer:
    """
    Lightweight in-process tracer.

    In production, replace with OpenTelemetry SDK.
    """

    def __init__(self, service: str = "pce") -> None:
        self.service = service
        self._spans: list[Span] = []

    @contextmanager
    def start_span(
        self,
        name: str,
        trace_id: str | None = None,
        parent_span_id: str | None = None,
    ) -> Generator[Span, None, None]:
        tid = trace_id or str(uuid.uuid4())
        span = Span(
            trace_id=tid,
            name=name,
            service=self.service,
            parent_span_id=parent_span_id,
        )
        try:
            yield span
        except Exception as exc:
            span.finish(status="error", error=str(exc))
            raise
        else:
            span.finish()
        finally:
            self._spans.append(span)

    def get_spans(self, trace_id: str | None = None) -> list[Span]:
        if trace_id:
            return [s for s in self._spans if s.trace_id == trace_id]
        return list(self._spans)
