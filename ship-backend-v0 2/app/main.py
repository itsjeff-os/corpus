from fastapi import FastAPI
from home_model import get_home_model, get_rooms, get_devices
from model_index import get_entities_for_room
from validator import validate_action
from executor import execute_action

app = FastAPI(title="SHIP Backend")

@app.get("/health")
def health():
    return {"status": "SHIP backend online"}

@app.get("/home-model")
def home_model():
    return get_home_model()

@app.get("/rooms")
def rooms():
    return get_rooms()

@app.get("/devices")
def devices():
    return get_devices()

@app.get("/rooms/{room_id}/entities")
def room_entities(room_id: str):
    return get_entities_for_room(room_id)

@app.post("/validate/action")
def validate(data: dict):
    return validate_action(data)

@app.post("/execute/action")
def execute(data: dict):
    return execute_action(data)