# SHIP Backend v0

Minimal operational backend for the SHIP smart home intelligence platform.

## Endpoints

GET /health
GET /home-model
GET /rooms
GET /devices
GET /rooms/{room_id}/entities
POST /validate/action
POST /execute/action

## Example

POST /execute/action

{
  "entity_id": "light.open_plan_ceiling",
  "service": "light.turn_on",
  "data": {
    "brightness_pct": 30
  }
}