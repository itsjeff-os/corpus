from validator import validate_action
from ha_client import call_service

def execute_action(action):

    check = validate_action(action)

    if not check["valid"]:
        return check

    domain, service = action["service"].split(".")

    data = {
        "entity_id": action["entity_id"]
    }

    if "data" in action:
        data.update(action["data"])

    result = call_service(domain, service, data)

    return {
        "status": "executed",
        "service": action["service"],
        "entity": action["entity_id"],
        "result": result
    }