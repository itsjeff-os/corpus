import json
from functools import lru_cache

REGISTRY_PATH = "/data/home_registry.json"

@lru_cache
def load_registry():
    with open(REGISTRY_PATH) as f:
        return json.load(f)

@lru_cache
def build_index():
    model = load_registry()

    rooms_by_id = {}
    room_aliases = {}
    devices_by_id = {}
    entities_by_id = {}
    entities_by_room = {}

    for room in model.get("rooms", []):
        room_id = room["id"]
        rooms_by_id[room_id] = room
        entities_by_room.setdefault(room_id, [])

        room_aliases[room["name"].lower()] = room_id
        for alias in room.get("aliases", []):
            room_aliases[alias.lower()] = room_id

    def register_entity(entity_id, room_id, device_id, device_name, capabilities, device_type):
        entities_by_id[entity_id] = {
            "entity_id": entity_id,
            "room_id": room_id,
            "device_id": device_id,
            "device_name": device_name,
            "capabilities": capabilities or [],
            "device_type": device_type,
        }
        if room_id:
            entities_by_room.setdefault(room_id, []).append(entity_id)

    for collection_name in ["devices", "actuators", "infrastructure", "zones"]:
        for item in model.get(collection_name, []):
            item_id = item["id"]
            devices_by_id[item_id] = item

            room_id = item.get("room_id") or item.get("location_room_id")
            integrations = item.get("integrations", {})
            capabilities = item.get("capabilities", [])
            item_type = item.get("type")

            if isinstance(integrations, dict):
                ha = integrations.get("home_assistant", {})
                for entity_id in ha.get("primary_entities", []):
                    register_entity(
                        entity_id=entity_id,
                        room_id=room_id,
                        device_id=item_id,
                        device_name=item.get("name"),
                        capabilities=capabilities,
                        device_type=item_type,
                    )

    return {
        "model": model,
        "rooms_by_id": rooms_by_id,
        "room_aliases": room_aliases,
        "devices_by_id": devices_by_id,
        "entities_by_id": entities_by_id,
        "entities_by_room": entities_by_room,
    }

def get_entities_for_room(room_id: str):
    idx = build_index()
    entity_ids = idx["entities_by_room"].get(room_id, [])
    return [idx["entities_by_id"][eid] for eid in entity_ids if eid in idx["entities_by_id"]]