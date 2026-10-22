from model_index import build_index

def get_home_model():
    return build_index()["model"]

def get_rooms():
    return list(build_index()["rooms_by_id"].values())

def get_devices():
    return list(build_index()["devices_by_id"].values())