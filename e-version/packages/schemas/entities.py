"""Entity and Relation schemas — the typed world model for the knowledge graph."""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class EntityType(str, Enum):
    PERSON = "person"
    DEVICE = "device"
    NETWORK = "network"
    VLAN = "vlan"
    SUBNET = "subnet"
    SERVICE = "service"
    PROJECT = "project"
    DOCUMENT = "document"
    TASK = "task"
    LOCATION = "location"
    CREDENTIAL_REFERENCE = "credential_reference"
    PROCEDURE = "procedure"
    ISSUE = "issue"
    DECISION = "decision"
    PREFERENCE = "preference"
    SOURCE = "source"
    FACT = "fact"
    RULE = "rule"
    EVENT = "event"
    UNKNOWN = "unknown"


class RelationType(str, Enum):
    DEVICE_ON_NETWORK = "device_on_network"
    SERVICE_HOSTED_ON = "service_hosted_on"
    VLAN_ROUTES_TO = "vlan_routes_to"
    DOCUMENT_MENTIONS_ENTITY = "document_mentions_entity"
    PERSON_OWNS_DEVICE = "person_owns_device"
    PROJECT_DEPENDS_ON = "project_depends_on"
    FACT_DERIVED_FROM_SOURCE = "fact_derived_from_source"
    MEMORY_GROUNDED_BY_FACT = "memory_grounded_by_fact"
    ISSUE_AFFECTS_SERVICE = "issue_affects_service"
    PROCEDURE_APPLIES_TO_DEVICE = "procedure_applies_to_device"
    ENTITY_RELATED_TO = "entity_related_to"
    MEMBER_OF = "member_of"
    DEPENDS_ON = "depends_on"
    CONFLICTS_WITH = "conflicts_with"


class Entity(BaseModel):
    """A typed real-world or conceptual entity in the knowledge graph."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: str
    user_id: str
    entity_type: EntityType
    name: str
    canonical_name: str | None = None
    aliases: list[str] = Field(default_factory=list)
    description: str | None = None
    description_embedding: list[float] | None = None
    embedding_model: str | None = None
    attributes: dict[str, Any] = Field(default_factory=dict)
    source_ids: list[str] = Field(default_factory=list)
    document_ids: list[str] = Field(default_factory=list)
    fact_ids: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}


class Relation(BaseModel):
    """A directed typed relation between two entities in the knowledge graph."""

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tenant_id: str
    user_id: str
    relation_type: RelationType
    source_entity_id: str
    target_entity_id: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.8)
    provenance: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"use_enum_values": True}
