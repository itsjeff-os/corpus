"""Unit tests for the policy engine components."""

import pytest

from services.policy_engine.app.access_policy import AccessPolicyEngine
from services.policy_engine.app.sensitivity_policy import SensitivityPolicyEngine
from services.policy_engine.app.source_policy import SourcePolicyEngine
from services.memory_engine.app.promotion_policy import MemoryPromotionPolicy


class TestAccessPolicyEngine:
    def setup_method(self):
        self.engine = AccessPolicyEngine()
        self.tenant = "tenant1"
        self.user = "user1"

    def test_deprecated_fact_denied(self):
        fact = {"trust_level": "deprecated", "tenant_id": self.tenant}
        assert not self.engine.can_use_fact(fact, self.tenant, self.user)

    def test_canonical_fact_allowed(self):
        fact = {"trust_level": "canonical", "tenant_id": self.tenant}
        assert self.engine.can_use_fact(fact, self.tenant, self.user)

    def test_cross_tenant_fact_denied(self):
        fact = {"trust_level": "canonical", "tenant_id": "other_tenant"}
        assert not self.engine.can_use_fact(fact, self.tenant, self.user)

    def test_chunk_with_wrong_permissions_denied(self):
        chunk = {"tenant_id": self.tenant, "permissions": ["user2", "user3"]}
        assert not self.engine.can_access_chunk(chunk, self.tenant, self.user)

    def test_chunk_with_empty_permissions_allowed(self):
        chunk = {"tenant_id": self.tenant, "permissions": []}
        assert self.engine.can_access_chunk(chunk, self.tenant, self.user)

    def test_chunk_user_in_permissions_allowed(self):
        chunk = {"tenant_id": self.tenant, "permissions": [self.user, "user2"]}
        assert self.engine.can_access_chunk(chunk, self.tenant, self.user)

    def test_filter_facts(self):
        facts = [
            {"trust_level": "canonical", "tenant_id": self.tenant},
            {"trust_level": "deprecated", "tenant_id": self.tenant},
            {"trust_level": "source_backed", "tenant_id": "other"},
        ]
        result = self.engine.filter_facts(facts, self.tenant, self.user)
        assert len(result) == 1
        assert result[0]["trust_level"] == "canonical"


class TestSensitivityPolicyEngine:
    def setup_method(self):
        self.engine = SensitivityPolicyEngine()

    def test_detects_password(self):
        text = "password: mysecretpassword123"
        assert "password" in self.engine.contains_sensitive(text)

    def test_detects_api_key(self):
        text = "api_key=sk-abc123xyz"
        assert "api_key" in self.engine.contains_sensitive(text)

    def test_detects_token(self):
        text = "token=******"
        assert "token" in self.engine.contains_sensitive(text)

    def test_clean_text_is_safe(self):
        text = "The VLAN 20 subnet is 192.168.20.0/24."
        assert self.engine.is_safe_for_prompt(text)

    def test_redact_replaces_values(self):
        text = "password: mysecretpassword123"
        redacted = self.engine.redact(text)
        assert "mysecretpassword123" not in redacted
        assert "[REDACTED]" in redacted

    def test_audit_document_clean(self):
        result = self.engine.audit_document("This is safe content.", "doc1.md")
        assert result["is_clean"]
        assert result["source_id"] == "doc1.md"

    def test_audit_document_with_secret(self):
        result = self.engine.audit_document("api_key=sk-secret", "doc1.md")
        assert not result["is_clean"]
        assert "api_key" in result["found_patterns"]


class TestSourcePolicyEngine:
    def setup_method(self):
        self.engine = SourcePolicyEngine(
            allowed_source_types=["markdown", "router_export"],
            denied_source_ids={"blocked-source-id"},
        )
        self.tenant = "tenant1"
        self.user = "user1"

    def test_allowed_source_type_permitted(self):
        source = {"source_type": "markdown", "permissions": []}
        assert self.engine.can_query_source(source, self.tenant, self.user)

    def test_denied_source_type_blocked(self):
        source = {"source_type": "slack", "permissions": []}
        assert not self.engine.can_query_source(source, self.tenant, self.user)

    def test_denied_source_id_blocked(self):
        source = {"id": "blocked-source-id", "source_type": "markdown", "permissions": []}
        assert not self.engine.can_query_source(source, self.tenant, self.user)

    def test_filter_sources(self):
        sources = [
            {"source_type": "markdown", "permissions": []},
            {"source_type": "slack", "permissions": []},
        ]
        result = self.engine.filter_sources(sources, self.tenant, self.user)
        assert len(result) == 1
        assert result[0]["source_type"] == "markdown"
