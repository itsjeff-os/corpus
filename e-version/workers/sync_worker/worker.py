"""
Sync Worker — polls source connectors for changes and queues ingestion jobs.

Runs on a schedule (e.g., every 15 minutes) or triggered by webhooks.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from packages.connectors.base import SourceConnector

logger = logging.getLogger(__name__)


class SyncWorker:
    """
    Polls registered source connectors for new or changed content.

    For each changed source, enqueues an ingestion job.
    """

    def __init__(self, queue=None) -> None:
        self.queue = queue
        self._connectors: list[tuple[SourceConnector, datetime | None]] = []

    def register(self, connector: SourceConnector, last_synced_at: datetime | None = None) -> None:
        """Register a connector to be polled."""
        self._connectors.append((connector, last_synced_at))

    def run_once(self) -> dict[str, Any]:
        """Poll all connectors and enqueue changed sources."""
        enqueued = 0
        errors: list[str] = []

        for connector, last_synced in self._connectors:
            try:
                sources = connector.discover()
                for source_meta in sources:
                    if last_synced is None:
                        changed = True
                    else:
                        updated_at = source_meta.updated_at
                        changed = updated_at is not None and updated_at > last_synced

                    if changed:
                        job = {
                            "source_id": source_meta.source_id,
                            "source_type": source_meta.source_type,
                            "connector_class": type(connector).__name__,
                            "enqueued_at": datetime.now(tz=timezone.utc).isoformat(),
                        }
                        if self.queue:
                            self.queue.put(job)
                        enqueued += 1
                        logger.info("Enqueued ingestion job for %s", source_meta.source_id)
            except Exception as exc:
                errors.append(f"Connector {type(connector).__name__} failed: {exc}")
                logger.error("Sync error: %s", exc)

        return {"enqueued": enqueued, "errors": errors}
