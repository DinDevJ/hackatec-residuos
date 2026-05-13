from fastapi import APIRouter
import pandas as pd

router = APIRouter()
CSV_PATH = "data/contenedores.csv"


@router.get("/")
def listar():
    df = pd.read_csv(CSV_PATH)
    return df.to_dict(orient="records")


@router.get("/{contenedor_id}")
def detalle(contenedor_id: str):
    df = pd.read_csv(CSV_PATH)
    row = df[df["id"] == contenedor_id]
    if row.empty:
        return {"error": "No encontrado"}
    return row.iloc[0].to_dict()
