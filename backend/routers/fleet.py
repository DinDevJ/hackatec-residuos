from fastapi import APIRouter

router = APIRouter()

import json
import os

def load_json_file(filename: str):
    file_path = os.path.join("data", filename)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@router.get("/status")
def get_fleet_status():
    return load_json_file("flotilla.json")

@router.get("/{unit_id}/telemetry")
def get_fleet_telemetry(unit_id: str):
    return {
        "driver_rating": 4.9,
        "fuel_efficiency": "2.1 km/L",
        "current_speed": "78 km/h",
        "engine_temp": "92°C",
        "eta": "14:30 CST"
    }
