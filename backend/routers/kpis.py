from fastapi import APIRouter
import pandas as pd

router = APIRouter()
CSV_PATH = "data/contenedores.csv"


@router.get("/")
def kpis():
    df = pd.read_csv(CSV_PATH)
    return {
        "total_contenedores": len(df),
        "promedio_llenado": round(df["nivel_actual"].mean(), 1),
        "criticos": int((df["nivel_actual"] >= 80).sum()),
    }
