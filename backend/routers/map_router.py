from fastapi import APIRouter
import pandas as pd

router = APIRouter()
CSV_PATH = "data/contenedores.csv"

# Function to generate a simple polygon given a center lat/lng
def get_polygon(lat, lng, size=0.005):
    return [
        [lng - size, lat - size],
        [lng + size, lat - size],
        [lng + size, lat + size],
        [lng - size, lat + size],
        [lng - size, lat - size]
    ]

# Generaremos centros estáticos falsos para las 5 zonas
ZONAS_CENTERS = {
    "Centro": {"lat": 19.7032, "lng": -101.1923},
    "Norte": {"lat": 19.7250, "lng": -101.1850},
    "Sur": {"lat": 19.6750, "lng": -101.1850},
    "Oriente": {"lat": 19.7000, "lng": -101.1500},
    "Poniente": {"lat": 19.7000, "lng": -101.2200}
}

@router.get("/zones-geojson")
def get_zones_geojson():
    df = pd.read_csv(CSV_PATH)
    features = []
    
    # Agrupar por zona
    for zona, group in df.groupby("zona"):
        avg_sat = int(group["nivel_actual"].mean())
        criticos = int((group["nivel_actual"] >= 80).sum())
        
        fill_color = "#E57373" if avg_sat >= 80 else ("#FFB74D" if avg_sat >= 50 else "#81C784")
        
        center = ZONAS_CENTERS.get(zona, {"lat": group["lat"].mean(), "lng": group["lng"].mean()})
        poly = get_polygon(center["lat"], center["lng"], size=0.01) # Hacerlos un poco más grandes para que cubran zonas enteras
        
        features.append({
            "type": "Feature",
            "geometry": { "type": "Polygon", "coordinates": [poly] },
            "properties": {
                "name": zona,
                "saturation_pct": avg_sat,
                "generated_tons": len(group) * 2, 
                "critical_bins": criticos,
                "fill_color": fill_color
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/saturation-list")
def get_saturation_list():
    df = pd.read_csv(CSV_PATH)
    sat_list = []
    
    for zona, group in df.groupby("zona"):
        avg_sat = int(group["nivel_actual"].mean())
        alert = "CRITICAL" if avg_sat >= 80 else ("WARNING" if avg_sat >= 50 else "NORMAL")
        sat_list.append({
            "zone": zona,
            "sat_pct": avg_sat,
            "alert": alert
        })
        
    sat_list.sort(key=lambda x: x["sat_pct"], reverse=True)
    return sat_list
