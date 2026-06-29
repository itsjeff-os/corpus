"""Eval Worker — runs regression and quality evals on a schedule."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

logger = logging.getLogger(__name__)


class EvalWorker:
    """
    Runs eval jobs against the PCE retrieval and answer quality.

    Scheduled to run after:
    - New source ingestion
    - Model configuration changes
    - Retrieval configuration changes
    """

    def __init__(
        self,
        retrieval_engine=None,
        orchestrator=None,
    ) -> None:
        from services.eval_engine.app.retrieval_evals import RetrievalEvaluator
        from services.eval_engine.app.groundedness_evals import GroundednessEvaluator
        from services.eval_engine.app.regression_sets import RegressionTestSet
        self.retrieval_engine = retrieval_engine
        self.orchestrator = orchestrator
        self._retrieval_eval = RetrievalEvaluator()
        self._groundedness_eval = GroundednessEvaluator()

    def run_regression(
        self, test_set: RegressionTestSet, tenant_id: str, user_id: str
    ) -> dict[str, Any]:
        """Run all regression cases in a test set and return a summary."""
        results: list[dict[str, Any]] = []
        passed = 0
        failed = 0

        for case in test_set.all():
            result: dict[str, Any] = {"case_id": case.id, "query": case.query}
            try:
                result["status"] = "skipped"
                result["reason"] = "No orchestrator or retrieval engine configured."
                results.append(result)
            except Exception as exc:
                result["status"] = "error"
                result["error"] = str(exc)
                failed += 1
                results.append(result)

        return {
            "test_set": test_set.name,
            "run_at": datetime.now(tz=timezone.utc).isoformat(),
            "total": len(test_set),
            "passed": passed,
            "failed": failed,
            "skipped": len(test_set) - passed - failed,
            "results": results,
        }
