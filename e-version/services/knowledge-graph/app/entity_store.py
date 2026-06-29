"""Entity Store — manages the typed entity registry."""

from __future__ import annotations

from typing import Any

from packages.schemas.entities import Entity, EntityType


class EntityStore:
    """
    In-memory entity store (production: backed by Postgres).

    Provides upsert, lookup by name/type, and alias resolution.
    """

    def __init__(self) -> None:
        self._entities: dict[str, Entity] = {}
        self._name_index: dict[str, str] = {}

    def upsert(self, entity: Entity) -> Entity:
        """Insert or update an entity. Returns the stored entity."""
        self._entities[entity.id] = entity
        self._name_index[entity.name.lower()] = entity.id
        for alias in entity.aliases:
            self._name_index[alias.lower()] = entity.id
        return entity

    def get_by_id(self, entity_id: str) -> Entity | None:
        return self._entities.get(entity_id)

    def get_by_name(self, name: str) -> Entity | None:
        entity_id = self._name_index.get(name.lower())
        if entity_id:
            return self._entities.get(entity_id)
        return None

    def find_by_type(self, entity_type: EntityType, tenant_id: str, user_id: str) -> list[Entity]:
        return [
            e for e in self._entities.values()
            if e.entity_type == entity_type and e.tenant_id == tenant_id and e.user_id == user_id
        ]

    def all(self, tenant_id: str, user_id: str) -> list[Entity]:
        return [
            e for e in self._entities.values()
            if e.tenant_id == tenant_id and e.user_id == user_id
        ]

    def resolve_names(self, names: list[str]) -> list[Entity]:
        """Resolve a list of entity names to Entity objects."""
        results: list[Entity] = []
        for name in names:
            entity = self.get_by_name(name)
            if entity:
                results.append(entity)
        return results
