from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

@router.post("/chat")
def chat(request: ChatRequest):
    return {
        "reply": "Analizando datos históricos de tráfico... Re-enrutando flotilla activa para priorizar el Mercado.",
        "action_trigger": "refresh_routes" 
    }
