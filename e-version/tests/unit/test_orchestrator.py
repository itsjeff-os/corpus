"""Unit tests for the Chat Orchestrator components."""

import pytest

from packages.schemas.retrieval import RetrievalIntent, RetrievalMode
from packages.schemas.sessions import Session
from services.chat_orchestrator.app.retrieval_planner import RetrievalPlanner
from services.chat_orchestrator.app.context_builder import ContextBuilder
from services.chat_orchestrator.app.response_validator import ResponseValidator


class TestRetrievalPlanner:
    def setup_method(self):
        self.planner = RetrievalPlanner()

    def _plan(self, message: str):
        return self.planner.plan("sess1", "turn1", message)

    def test_network_intent_detected(self):
        plan = self._plan("Why can't my Apple TV find the NAS on VLAN 20?")
        assert plan.intent == RetrievalIntent.NETWORK_TROUBLESHOOTING
        assert RetrievalMode.FACT_LOOKUP in plan.retrieval_modes

    def test_procedure_intent_detected(self):
        plan = self._plan("How do I configure mDNS on my router?")
        assert plan.intent == RetrievalIntent.PROCEDURE_LOOKUP

    def test_summarization_intent(self):
        plan = self._plan("Can you summarize my network setup?")
        assert plan.intent == RetrievalIntent.SUMMARIZATION

    def test_default_intent_for_generic_query(self):
        plan = self._plan("Tell me something interesting.")
        assert plan.intent == RetrievalIntent.QUESTION_ANSWERING

    def test_json_plan_parsed(self):
        import json
        llm_json = json.dumps({
            "intent": "fact_verification",
            "entities": ["vlan_20"],
            "needed_context": ["vlan_rules"],
            "retrieval_modes": ["fact_lookup", "lexical"],
            "freshness_requirement": "high",
            "risk_level": "medium",
        })
        plan = self.planner.plan("sess1", "turn1", "Is VLAN 20 on 192.168.20.0/24?", llm_plan_json=llm_json)
        assert plan.intent == RetrievalIntent.FACT_VERIFICATION
        assert RetrievalMode.FACT_LOOKUP in plan.retrieval_modes

    def test_malformed_json_falls_back_to_heuristic(self):
        plan = self.planner.plan("sess1", "turn1", "VLAN 20 subnet?", llm_plan_json="{bad json")
        # Should not raise, should return a valid plan
        assert plan.intent is not None


class TestContextBuilder:
    def setup_method(self):
        self.builder = ContextBuilder()

    def test_build_returns_dict(self):
        ctx = self.builder.build("What is VLAN 20?")
        assert "user_message" in ctx
        assert "high_trust_facts" in ctx
        assert "supporting_chunks" in ctx

    def test_high_trust_filter(self):
        facts = [
            {"trust_level": "canonical", "subject": "vlan_20"},
            {"trust_level": "inferred", "subject": "vlan_20"},
        ]
        ctx = self.builder.build("query", facts=facts)
        # canonical (0.95) >= 0.75, inferred (0.45) < 0.75
        assert len(ctx["high_trust_facts"]) == 1
        assert ctx["high_trust_facts"][0]["trust_level"] == "canonical"

    def test_token_budget_trims_chunks(self):
        chunks = [{"content": "x" * 5000}] * 20
        ctx = self.builder.build("query", chunks=chunks)
        trimmed = self.builder.estimate_token_budget(ctx, max_tokens=100)
        # Most chunks should be trimmed
        assert len(trimmed["supporting_chunks"]) < 20


class TestResponseValidator:
    def setup_method(self):
        self.validator = ResponseValidator()

    def test_valid_response_passes(self):
        result = self.validator.validate(
            answer="The NAS is on VLAN 10.",
            citations=[{"chunk_id": "c1", "source": "docs.md"}],
            retrieved_chunk_ids={"c1"},
            selected_fact_ids={"f1"},
            stale_fact_ids=set(),
            conflict_ids=set(),
            known_entities=set(),
        )
        assert result.is_valid

    def test_unknown_chunk_citation_fails(self):
        result = self.validator.validate(
            answer="...",
            citations=[{"chunk_id": "unknown_chunk", "source": "docs.md"}],
            retrieved_chunk_ids={"c1"},
            selected_fact_ids=set(),
            stale_fact_ids=set(),
            conflict_ids=set(),
            known_entities=set(),
        )
        assert not result.is_valid
        assert any("unknown_chunk" in issue for issue in result.issues)

    def test_stale_fact_warns(self):
        result = self.validator.validate(
            answer="...",
            citations=[{"fact_id": "f1", "source": "docs.md"}],
            retrieved_chunk_ids=set(),
            selected_fact_ids={"f1"},
            stale_fact_ids={"f1"},
            conflict_ids=set(),
            known_entities=set(),
        )
        assert len(result.stale_facts_used) == 1

    def test_credential_pattern_flagged(self):
        result = self.validator.validate(
            answer="The password: admin123 for the router.",
            citations=[],
            retrieved_chunk_ids=set(),
            selected_fact_ids=set(),
            stale_fact_ids=set(),
            conflict_ids=set(),
            known_entities=set(),
        )
        assert not result.is_valid
        assert any("sensitive" in issue.lower() or "credential" in issue.lower() for issue in result.issues)
