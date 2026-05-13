from fastapi import APIRouter
import json
import os

router = APIRouter()

def load_json_file(filename: str):
    file_path = os.path.join("data", filename)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@router.get("/all")
def get_all_alerts():
    return load_json_file("alertas.json")
