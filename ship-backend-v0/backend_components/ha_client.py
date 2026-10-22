import requests
from config import HA_URL, HEADERS

def get_entity_state(entity_id):
    url = f"{HA_URL}/api/states/{entity_id}"
    r = requests.get(url, headers=HEADERS)
    if r.status_code != 200:
        return None
    return r.json()

def call_service(domain, service, data):
    url = f"{HA_URL}/api/services/{domain}/{service}"
    r = requests.post(url, headers=HEADERS, json=data)
    return r.json()