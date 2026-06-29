"""Unit tests for the ranking package."""

from datetime import datetime, timezone, timedelta

import pytest

from packages.ranking.trust import TrustScorer, TRUST_WEIGHTS
from packages.ranking.freshness import FreshnessScorer
from packages.ranking.scoring import RankingScorer, ComponentScores
from packages.ranking.reranking import Reranker


class TestTrustScorer:
    def setup_method(self):
        self.scorer = TrustScorer()

    def test_known_trust_levels(self):
        assert self.scorer.score("pinned") == 1.00
        assert self.scorer.score("canonical") == 0.95
        assert self.scorer.score("machine_verified") == 0.90
        assert self.scorer.score("stale") == 0.25
        assert self.scorer.score("deprecated") == 0.05

    def test_unknown_trust_level_returns_default(self):
        assert self.scorer.score("unknown_level") == 0.50

    def test_case_insensitive(self):
        assert self.scorer.score("PINNED") == self.scorer.score("pinned")
        assert self.scorer.score("Canonical") == self.scorer.score("canonical")

    def test_compare(self):
        assert self.scorer.compare("canonical", "derived") == 1
        assert self.scorer.compare("derived", "canonical") == -1
        assert self.scorer.compare("canonical", "canonical") == 0

    def test_all_weights_in_range(self):
        for level, weight in TRUST_WEIGHTS.items():
            assert 0.0 <= weight <= 1.0, f"Weight out of range for {level}: {weight}"


class TestFreshnessScorer:
    def setup_method(self):
        self.scorer = FreshnessScorer(max_age_days=365)

    def test_very_fresh_scores_near_one(self):
        now = datetime.now(tz=timezone.utc)
        score = self.scorer.score(now)
        assert score > 0.99

    def test_old_content_scores_near_zero(self):
        old = datetime.now(tz=timezone.utc) - timedelta(days=400)
        score = self.scorer.score(old)
        assert score == 0.0

    def test_none_returns_default(self):
        score = self.scorer.score(None)
        assert score == 0.50

    def test_classify_current(self):
        now = datetime.now(tz=timezone.utc) - timedelta(days=3)
        assert self.scorer.classify(now) == "current"

    def test_classify_recent(self):
        recent = datetime.now(tz=timezone.utc) - timedelta(days=20)
        assert self.scorer.classify(recent) == "recent"

    def test_classify_stale(self):
        stale = datetime.now(tz=timezone.utc) - timedelta(days=200)
        assert self.scorer.classify(stale) == "stale"

    def test_classify_expired(self):
        expired = datetime.now(tz=timezone.utc) - timedelta(days=400)
        assert self.scorer.classify(expired) == "expired"

    def test_classify_none(self):
        assert self.scorer.classify(None) == "unknown"


class TestComponentScores:
    def test_final_score_weights_sum_to_one(self):
        weights = [0.20, 0.15, 0.20, 0.15, 0.15, 0.10, 0.05]
        assert abs(sum(weights) - 1.0) < 1e-9

    def test_all_ones_gives_one(self):
        s = ComponentScores(
            semantic_score=1.0,
            lexical_score=1.0,
            entity_overlap=1.0,
            graph_relevance=1.0,
            trust_score=1.0,
            freshness_score=1.0,
            session_relevance=1.0,
        )
        assert abs(s.final() - 1.0) < 1e-9

    def test_all_zeros_gives_zero(self):
        s = ComponentScores()
        assert s.final() == 0.0

    def test_partial_scores(self):
        s = ComponentScores(semantic_score=1.0)
        assert s.final() == 0.20


class TestRanker:
    def setup_method(self):
        self.reranker = Reranker(top_k=3)

    def test_rerank_sorts_descending(self):
        items = [
            {"chunk_id": "a", "final_score": 0.3},
            {"chunk_id": "b", "final_score": 0.8},
            {"chunk_id": "c", "final_score": 0.5},
        ]
        result = self.reranker.rerank_dicts(items)
        scores = [r["final_score"] for r in result]
        assert scores == sorted(scores, reverse=True)

    def test_rerank_respects_top_k(self):
        items = [{"chunk_id": str(i), "final_score": float(i)} for i in range(10)]
        result = self.reranker.rerank_dicts(items)
        assert len(result) == 3

    def test_empty_list(self):
        assert self.reranker.rerank_dicts([]) == []
