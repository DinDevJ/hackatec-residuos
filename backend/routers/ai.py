import os
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

try:
    from google import genai
    from google.genai import types
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

load_dotenv()

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str

def get_live_context():
    try:
        df = pd.read_csv("data/contenedores.csv")
        context_str = "Estado en tiempo real de las zonas:\n"
        for zona, group in df.groupby("zona"):
            avg_sat = int(group["nivel_actual"].mean())
            criticos = int((group["nivel_actual"] >= 80).sum())
            context_str += f"- {zona}: Saturación {avg_sat}%, Contenedores Críticos: {criticos}.\n"
        return context_str
    except Exception as e:
        return "No hay datos en tiempo real disponibles."

@router.post("/chat")
def chat(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "reply": "No se encontró la API key de Gemini. Configura GEMINI_API_KEY en tu .env",
            "action_trigger": "none"
        }
    
    if not HAS_GENAI:
        return {
            "reply": "Error: SDK de google-genai no está instalado en el entorno de Uvicorn. Ejecuta pip install google-genai.",
            "action_trigger": "none"
        }

    try:
        live_data = get_live_context()
        client = genai.Client(api_key=api_key)
        
        system_prompt = f"Eres Eco-Brain, el copiloto de IA de EcoTrack. Tu tarea es analizar y optimizar rutas de recolección. Usa los siguientes datos reales de la ciudad para contestar. Sé breve (máximo 3 oraciones), técnico y proactivo. Responde en español.\n\n{live_data}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
            )
        )
        
        return {
            "reply": response.text,
            "action_trigger": "refresh_routes"
        }
    except Exception as e:
        return {
            "reply": f"Error al contactar a la IA: {str(e)}",
            "action_trigger": "none"
        }
