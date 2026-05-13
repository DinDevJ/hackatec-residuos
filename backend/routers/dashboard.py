from fastapi import APIRouter
import json
import os

router = APIRouter()

DASHBOARD_FILE = os.path.join("data", "dashboard.json")

@router.get("/summary")
def get_dashboard_summary():
    with open(DASHBOARD_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/kpis")
def get_dashboard_kpis():
    return {
        "daily_tonnage": { "current": 450, "max": 800 },
        "diesel_saved_pct": 20,
        "active_fleet": { "active": 12, "total": 14 },
        "blind_spots": 180
    }

@router.get("/chart")
def get_dashboard_chart():
    return [
        { "time": "06:00", "real_vol": 100, "ai_prediction": 110 }
    ]

@router.get("/alerts")
def get_dashboard_alerts():
    return [
        { "type": "traffic", "title": "Traffic buildup...", "desc": "Rerouting Truck 04" }
    ]
