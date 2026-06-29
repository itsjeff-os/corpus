"""Unit tests for the eval engine."""

import pytest

from services.eval_engine.app.retrieval_evals import RetrievalEvaluator
from services.eval_engine.app.groundedness_evals import GroundednessEvaluator
from services.eval_engine.app.regression_sets import RegressionTestSet, EvalCase, build_network_regression_set


class TestRetrievalEvaluator:
    def setup_method(self):
        self.evaluator = RetrievalEvaluator()

    def test_perfect_retrieval(self):
        retrieved = ["a", "b", "c"]
        relevant = {"a", "b", "c"}
        metrics = self.evaluator.evaluate(retrieved, relevant, k=3)
        assert metrics.precision_at_k == 1.0
        assert metrics.recall_at_k == 1.0
        assert metrics.mean_reciprocal_rank == 1.0

    def test_no_relevant_retrieved(self):
        retrieved = ["x", "y", "z"]
        relevant = {"a", "b"}
        metrics = self.evaluator.evaluate(retrieved, relevant, k=3)
        assert metrics.precision_at_k == 0.0
        assert metrics.recall_at_k == 0.0
        assert metrics.mean_reciprocal_rank == 0.0

    def test_partial_retrieval(self):
        retrieved = ["a", "x", "b"]
        relevant = {"a", "b", "c"}
        metrics = self.evaluator.evaluate(retrieved, relevant, k=3)
        assert metrics.precision_at_k == pytest.approx(2 / 3, abs=0.01)
        assert metrics.recall_at_k == pytest.approx(2 / 3, abs=0.01)

    def test_mrr_first_relevant_at_position_2(self):
        retrieved = ["x", "a", "b"]
        relevant = {"a"}
        metrics = self.evaluator.evaluate(retrieved, relevant, k=3)
        assert metrics.mean_reciprocal_rank == pytest.approx(0.5, abs=0.01)

    def test_stale_ratio(self):
        retrieved = ["a", "b", "c"]
        relevant = {"a"}
        stale = {"b", "c"}
        metrics = self.evaluator.evaluate(retrieved, relevant, stale_ids=stale, k=3)
        assert metrics.stale_facts_ratio == pytest.approx(2 / 3, abs=0.01)

    def test_ndcg_perfect(self):
        retrieved = ["a", "b", "c"]
        relevant = {"a", "b", "c"}
        metrics = self.evaluator.evaluate(retrieved, relevant, k=3)
        assert metrics.ndcg_at_k == pytest.approx(1.0, abs=0.01)


class TestGroundednessEvaluator:
    def setup_method(self):
        self.evaluator = GroundednessEvaluator()

    def test_grounded_answer_passes(self):
        answer = "The VLAN 20 subnet is 192.168.20.0/24, as documented in vlans.md."
        citations = [{"source": "vlans.md", "chunk_id": "c1"}]
        result = self.evaluator.evaluate(
            answer=answer,
            citations=citations,
            retrieved_content="VLAN 20 uses subnet 192.168.20.0/24 vlans.md",
        )
        assert result.score > 0.0

    def test_hallucination_signals_detected(self):
        answer = "I think the VLAN 20 subnet is probably 192.168.20.0/24."
        result = self.evaluator.evaluate(
            answer=answer,
            citations=[],
            retrieved_content="",
        )
        assert len(result.hallucination_signals) > 0

    def test_no_citations_reduces_score(self):
        answer = "The VLAN 20 subnet is 192.168.20.0/24. The firewall blocks mDNS."
        result_with = self.evaluator.evaluate(
            answer=answer,
            citations=[{"source": "vlans.md"}, {"source": "firewall.md"}],
            retrieved_content="VLAN 20 subnet 192.168.20.0/24 firewall mDNS",
        )
        result_without = self.evaluator.evaluate(
            answer=answer,
            citations=[],
            retrieved_content="VLAN 20 subnet 192.168.20.0/24 firewall mDNS",
        )
        assert result_with.score >= result_without.score


class TestRegressionTestSet:
    def test_build_and_iterate(self):
        rs = RegressionTestSet("test_set")
        rs.add(EvalCase(id="case1", query="test query", expected_intent="question_answering"))
        assert len(rs) == 1
        assert rs.get("case1") is not None

    def test_get_nonexistent(self):
        rs = RegressionTestSet("empty")
        assert rs.get("nonexistent") is None

    def test_network_regression_set(self):
        rs = build_network_regression_set()
        assert len(rs) > 0
        case = rs.get("net_001")
        assert case is not None
        assert case.should_surface_conflict
