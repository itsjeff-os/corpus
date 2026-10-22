from model_index import build_index

SERVICE_REQUIREMENTS = {
    "light.turn_on": {"device_type": ["light", "light_group"], "capabilities": []},
    "light.turn_off": {"device_type": ["light", "light_group"], "capabilities": []},
    "scene.turn_on": {"device_type": [], "capabilities": []},
    "cover.set_cover_position": {"device_type": ["window_treatment"], "capabilities": ["set_position"]},
}

def validate_action(action):
    if "entity_id" not in action:
        return {"valid": False, "error": "entity_id missing"}

    if "service" not in action:
        return {"valid": False, "error": "service missing"}

    service = action["service"]
    entity_id = action["entity_id"]

    if service not in SERVICE_REQUIREMENTS:
        return {"valid": False, "error": "service not allowed"}

    if service == "scene.turn_on":
        return {"valid": True}

    entity = build_index()["entities_by_id"].get(entity_id)
    if not entity:
        return {"valid": False, "error": "entity not found in SHIP model"}

    rule = SERVICE_REQUIREMENTS[service]

    allowed_types = rule["device_type"]
    if allowed_types and entity["device_type"] not in allowed_types:
        return {
            "valid": False,
            "error": f"service {service} not valid for device_type {entity['device_type']}"
        }

    for required_cap in rule["capabilities"]:
        if required_cap not in entity["capabilities"]:
            return {
                "valid": False,
                "error": f"device missing capability {required_cap}"
            }

    return {"valid": True}