from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
from ia.orquestador import responder_consulta

router = APIRouter()
CSV_PATH = "data/contenedores.csv"


class Pregunta(BaseModel):
    texto: str


@router.post("/")
def consultar(pregunta: Pregunta):
    df = pd.read_csv(CSV_PATH)
    contenedores = df.to_dict(orient="records")
    respuesta = responder_consulta(pregunta.texto, contenedores)
    return {"respuesta": respuesta}
