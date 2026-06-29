"""Unit tests for the memory engine components."""

import pytest

from services.memory_engine.app.profile_memory import ProfileMemoryStore
from services.memory_engine.app.session_memory import SessionMemoryStore
from services.memory_engine.app.promotion_policy import MemoryPromotionPolicy


class TestProfileMemoryStore:
    def setup_method(self):
        self.store = ProfileMemoryStore()
        self.tid = "tenant1"
        self.uid = "user1"

    def test_upsert_and_retrieve(self):
        mem = {"subject": "name", "summary": "My name is Jeffe", "memory_type": "profile"}
        self.store.upsert(mem, self.tid, self.uid)
        results = self.store.get_for_user(self.uid, self.tid)
        assert len(results) == 1
        assert results[0]["summary"] == "My name is Jeffe"

    def test_upsert_updates_existing(self):
        mem1 = {"subject": "name", "summary": "Old summary"}
        mem2 = {"subject": "name", "summary": "New summary"}
        self.store.upsert(mem1, self.tid, self.uid)
        self.store.upsert(mem2, self.tid, self.uid)
        results = self.store.get_for_user(self.uid, self.tid)
        assert len(results) == 1
        assert results[0]["summary"] == "New summary"

    def test_tenant_isolation(self):
        mem = {"subject": "secret", "summary": "Only for tenant1"}
        self.store.upsert(mem, "tenant1", self.uid)
        results = self.store.get_for_user(self.uid, "tenant2")
        assert len(results) == 0

    def test_delete(self):
        mem = {"subject": "deleteme", "summary": "To be deleted"}
        self.store.upsert(mem, self.tid, self.uid)
        deleted = self.store.delete("deleteme", self.uid, self.tid)
        assert deleted
        assert len(self.store.get_for_user(self.uid, self.tid)) == 0

    def test_delete_nonexistent(self):
        deleted = self.store.delete("nonexistent", self.uid, self.tid)
        assert not deleted


class TestSessionMemoryStore:
    def setup_method(self):
        self.store = SessionMemoryStore()

    def test_write_and_retrieve(self):
        self.store.write("session1", {"subject": "current_task", "summary": "Debugging network"})
        results = self.store.get_for_session("session1")
        assert len(results) == 1
        assert results[0]["subject"] == "current_task"

    def test_different_sessions_isolated(self):
        self.store.write("session1", {"subject": "task1"})
        self.store.write("session2", {"subject": "task2"})
        assert len(self.store.get_for_session("session1")) == 1
        assert self.store.get_for_session("session1")[0]["subject"] == "task1"

    def test_clear(self):
        self.store.write("session1", {"subject": "temp"})
        self.store.clear("session1")
        assert self.store.get_for_session("session1") == []

    def test_update(self):
        self.store.write("session1", {"subject": "goal", "summary": "Old"})
        updated = self.store.update("session1", "goal", {"summary": "New"})
        assert updated
        assert self.store.get_for_session("session1")[0]["summary"] == "New"

    def test_update_nonexistent(self):
        updated = self.store.update("session1", "nonexistent", {"summary": "x"})
        assert not updated


class TestMemoryPromotionPolicy:
    def setup_method(self):
        self.policy = MemoryPromotionPolicy()

    def test_session_memory_never_promoted(self):
        candidate = {"memory_type": "session", "confidence": 1.0, "grounding_sources": ["doc.md"]}
        result = self.policy.evaluate(candidate)
        assert not result.should_promote

    def test_environment_without_grounding_rejected(self):
        candidate = {"memory_type": "environment", "confidence": 0.95, "grounding_sources": []}
        result = self.policy.evaluate(candidate)
        assert not result.should_promote

    def test_environment_with_grounding_approved(self):
        candidate = {"memory_type": "environment", "confidence": 0.92, "grounding_sources": ["infra/topology.md"]}
        result = self.policy.evaluate(candidate)
        assert result.should_promote

    def test_low_confidence_rejected(self):
        candidate = {"memory_type": "preference", "confidence": 0.50, "grounding_sources": []}
        result = self.policy.evaluate(candidate)
        assert not result.should_promote

    def test_profile_always_requires_confirmation(self):
        candidate = {"memory_type": "profile", "confidence": 0.99, "grounding_sources": ["doc.md"]}
        result = self.policy.evaluate(candidate)
        assert result.should_promote
        assert result.requires_confirmation

    def test_preference_auto_promote_below_max(self):
        candidate = {"memory_type": "preference", "confidence": 0.82, "grounding_sources": []}
        result = self.policy.evaluate(candidate)
        assert result.should_promote
        assert result.requires_confirmation
