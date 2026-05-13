from fastapi import APIRouter
import json
import os

router = APIRouter()

DASHBOARD_FILE = os.path.join("data", "dashboard.json")

import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

load_dotenv()

# Caché en memoria para evitar llamar a Gemini en cada carga del dashboard
_prediction_cache = {
    "timestamp": None,
    "predictions": None
}

@router.get("/summary")
def get_dashboard_summary():
    global _prediction_cache
    with open(DASHBOARD_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Intentar generar predicción en vivo si tenemos la API y el SDK
    api_key = os.getenv("GEMINI_API_KEY")
    if HAS_GENAI and api_key:
        now = datetime.now()
        # Verificar si tenemos un caché válido (menos de 1 hora de antigüedad)
        if (_prediction_cache["timestamp"] is not None and 
            _prediction_cache["predictions"] is not None and 
            (now - _prediction_cache["timestamp"]).total_seconds() < 3600):
            predictions = _prediction_cache["predictions"]
        else:
            try:
                client = genai.Client(api_key=api_key)
                
                # Tomar los datos históricos (últimos 5 días)
                historical_data = data.get("chart_data", [])[-5:]
                hist_volumes = [item["real_volume"] for item in historical_data]
                
                prompt = (
                    f"Eres un modelo predictivo de logística urbana. El volumen histórico de basura de los últimos 5 días fue: {hist_volumes} toneladas.\n"
                    "Predice de forma realista el volumen de los próximos 5 días considerando la tendencia.\n"
                    "Responde ÚNICAMENTE con una lista de 5 números enteros separados por comas, sin texto adicional."
                )
                
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(temperature=0.4)
                )
                
                # Limpiar respuesta y extraer números
                pred_text = response.text.strip().replace('[', '').replace(']', '').replace(' ', '')
                predictions = [int(x) for x in pred_text.split(',')]
                
                # Guardar en caché si es válido
                if len(predictions) == 5:
                    _prediction_cache["timestamp"] = now
                    _prediction_cache["predictions"] = predictions
            except Exception as e:
                print(f"Error generando predicción en vivo: {e}")
                with open("error.log", "w") as f:
                    f.write(str(e))
                predictions = []
                
        # Si tenemos predicciones (ya sea cacheadas o nuevas), extender los datos
        if len(predictions) == 5:
            today = datetime.now()
            for i in range(1, 6):
                date = today + timedelta(days=i)
                data["chart_data"].append({
                    "time": date.strftime('%d/%m'),
                    "real_volume": None,
                    "ai_prediction": predictions[i-1]
                })
    else:
        with open("error.log", "w") as f:
            f.write(f"HAS_GENAI={HAS_GENAI}, api_key={'SET' if api_key else 'NONE'}")
            
    return data

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
