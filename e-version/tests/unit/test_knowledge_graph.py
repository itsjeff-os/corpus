"""Unit tests for the knowledge graph service."""

import pytest

from packages.schemas.entities import Entity, EntityType, Relation, RelationType
from services.knowledge_graph.app.entity_store import EntityStore
from services.knowledge_graph.app.relation_store import RelationStore
from services.knowledge_graph.app.graph_expander import GraphExpander
from services.knowledge_graph.app.conflict_detector import ConflictDetector


def make_entity(name: str, entity_type: EntityType = EntityType.DEVICE) -> Entity:
    return Entity(
        tenant_id="t1",
        user_id="u1",
        entity_type=entity_type,
        name=name,
    )


def make_relation(source_id: str, target_id: str, rel_type: RelationType = RelationType.DEVICE_ON_NETWORK) -> Relation:
    return Relation(
        tenant_id="t1",
        user_id="u1",
        relation_type=rel_type,
        source_entity_id=source_id,
        target_entity_id=target_id,
    )


class TestEntityStore:
    def setup_method(self):
        self.store = EntityStore()

    def test_upsert_and_get_by_id(self):
        entity = make_entity("NAS Main")
        self.store.upsert(entity)
        found = self.store.get_by_id(entity.id)
        assert found is not None
        assert found.name == "NAS Main"

    def test_get_by_name_case_insensitive(self):
        entity = make_entity("Apple TV Lounge")
        self.store.upsert(entity)
        found = self.store.get_by_name("apple tv lounge")
        assert found is not None

    def test_resolve_names(self):
        e1 = make_entity("Router")
        e2 = make_entity("Switch")
        self.store.upsert(e1)
        self.store.upsert(e2)
        resolved = self.store.resolve_names(["Router", "Switch", "Unknown"])
        assert len(resolved) == 2

    def test_all_filtered_by_tenant(self):
        e1 = make_entity("Device1")
        e2 = Entity(tenant_id="other", user_id="u1", entity_type=EntityType.DEVICE, name="Device2")
        self.store.upsert(e1)
        self.store.upsert(e2)
        result = self.store.all("t1", "u1")
        assert len(result) == 1
        assert result[0].name == "Device1"


class TestRelationStore:
    def setup_method(self):
        self.store = RelationStore()

    def test_upsert_and_get_outgoing(self):
        rel = make_relation("entity-a", "entity-b")
        self.store.upsert(rel)
        outgoing = self.store.get_outgoing("entity-a")
        assert len(outgoing) == 1
        assert outgoing[0].target_entity_id == "entity-b"

    def test_get_incoming(self):
        rel = make_relation("entity-a", "entity-b")
        self.store.upsert(rel)
        incoming = self.store.get_incoming("entity-b")
        assert len(incoming) == 1
        assert incoming[0].source_entity_id == "entity-a"

    def test_get_neighbors(self):
        r1 = make_relation("a", "b")
        r2 = make_relation("c", "a")
        self.store.upsert(r1)
        self.store.upsert(r2)
        neighbors = self.store.get_neighbors("a")
        assert "b" in neighbors
        assert "c" in neighbors


class TestGraphExpander:
    def setup_method(self):
        self.entity_store = EntityStore()
        self.relation_store = RelationStore()
        self.expander = GraphExpander(self.entity_store, self.relation_store)

    def test_expand_single_hop(self):
        apple_tv = make_entity("Apple TV Lounge")
        vlan20 = make_entity("VLAN 20", EntityType.VLAN)
        self.entity_store.upsert(apple_tv)
        self.entity_store.upsert(vlan20)
        rel = make_relation(apple_tv.id, vlan20.id)
        self.relation_store.upsert(rel)

        result = self.expander.expand(
            entity_names=["Apple TV Lounge"],
            tenant_id="t1",
            user_id="u1",
            max_hops=1,
        )
        expanded_names = [e["name"] for e in result["expanded_entities"]]
        assert "Apple TV Lounge" in expanded_names
        assert "VLAN 20" in expanded_names

    def test_expand_unknown_entity_returns_empty(self):
        result = self.expander.expand(
            entity_names=["Unknown Entity"],
            tenant_id="t1",
            user_id="u1",
        )
        assert result["expanded_entities"] == []

    def test_relevance_scores_decrease_with_hops(self):
        a = make_entity("A")
        b = make_entity("B")
        c = make_entity("C")
        self.entity_store.upsert(a)
        self.entity_store.upsert(b)
        self.entity_store.upsert(c)
        self.relation_store.upsert(make_relation(a.id, b.id))
        self.relation_store.upsert(make_relation(b.id, c.id))

        result = self.expander.expand(["A"], "t1", "u1", max_hops=2)
        relevance = result["graph_relevance"]
        # A (hop 0) → 1.0, B (hop 1) → 0.5, C (hop 2) → 0.33
        assert relevance[a.id] == 1.0
        assert relevance[b.id] == 0.5
        assert relevance.get(c.id, 0) < 0.5


class TestConflictDetector:
    def setup_method(self):
        self.detector = ConflictDetector()

    def test_detects_conflict(self):
        facts = [
            {"subject": "vlan_20", "predicate": "subnet", "value": "192.168.20.0/24", "source": "vlans.md", "trust_level": "canonical", "updated_at": None},
            {"subject": "vlan_20", "predicate": "subnet", "value": "10.20.0.0/24", "source": "router.json", "trust_level": "machine_verified", "updated_at": None},
        ]
        conflicts = self.detector.detect(facts)
        assert len(conflicts) == 1
        assert conflicts[0].entity == "vlan_20"
        assert conflicts[0].field == "subnet"
        assert len(conflicts[0].claims) == 2

    def test_no_conflict_for_same_values(self):
        facts = [
            {"subject": "nas", "predicate": "vlan", "value": "10", "source": "a.md", "trust_level": "canonical", "updated_at": None},
            {"subject": "nas", "predicate": "vlan", "value": "10", "source": "b.md", "trust_level": "source_backed", "updated_at": None},
        ]
        conflicts = self.detector.detect(facts)
        assert len(conflicts) == 0

    def test_machine_verified_suggests_prefer_machine_resolution(self):
        facts = [
            {"subject": "vlan_20", "predicate": "subnet", "value": "192.168.20.0/24", "source": "vlans.md", "trust_level": "canonical", "updated_at": None},
            {"subject": "vlan_20", "predicate": "subnet", "value": "10.20.0.0/24", "source": "router.json", "trust_level": "machine_verified", "updated_at": None},
        ]
        conflicts = self.detector.detect(facts)
        assert conflicts[0].resolution == "prefer_machine_verified_newer_source"
