"""Scoring — combines component scores into a final ranking score."""

from __future__ import annotations

from dataclasses import dataclass

from .trust import TrustScorer
from .freshness import FreshnessScorer


@dataclass
class ComponentScores:
    semantic_score: float = 0.0
    lexical_score: float = 0.0
    entity_overlap: float = 0.0
    graph_relevance: float = 0.0
    trust_score: float = 0.0
    freshness_score: float = 0.0
    session_relevance: float = 0.0

    def final(self) -> float:
        """
        Weighted ranking formula:

          semantic_score        * 0.20
          lexical_score         * 0.15
          entity_overlap        * 0.20
          graph_relevance       * 0.15
          trust_score           * 0.15
          freshness_score       * 0.10
          session_relevance     * 0.05
        """
        return (
            self.semantic_score * 0.20
            + self.lexical_score * 0.15
            + self.entity_overlap * 0.20
            + self.graph_relevance * 0.15
            + self.trust_score * 0.15
            + self.freshness_score * 0.10
            + self.session_relevance * 0.05
        )


class RankingScorer:
    """Computes final ranking scores for retrieved chunks."""

    def __init__(self) -> None:
        self.trust_scorer = TrustScorer()
        self.freshness_scorer = FreshnessScorer()

    def compute(
        self,
        semantic_score: float = 0.0,
        lexical_score: float = 0.0,
        entity_overlap: float = 0.0,
        graph_relevance: float = 0.0,
        trust_level: str = "source_backed",
        last_updated=None,
        session_relevance: float = 0.0,
    ) -> ComponentScores:
        """Build a ComponentScores from raw inputs, computing trust and freshness."""
        return ComponentScores(
            semantic_score=semantic_score,
            lexical_score=lexical_score,
            entity_overlap=entity_overlap,
            graph_relevance=graph_relevance,
            trust_score=self.trust_scorer.score(trust_level),
            freshness_score=self.freshness_scorer.score(last_updated),
            session_relevance=session_relevance,
        )
