from fastapi import APIRouter
from fastapi.responses import Response

router = APIRouter()

import json
import os

def load_json_file(filename: str):
    file_path = os.path.join("data", filename)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@router.get("/active")
def get_active_routes():
    return load_json_file("rutas.json")

@router.get("/optimized")
def get_optimized_routes():
    return load_json_file("rutas.json")

@router.get("/{route_id}/export-pdf")
def export_pdf(route_id: str):
    # Dummy PDF for hackathon based on contract
    pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 0 >>\nstream\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000219 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n268\n%%EOF"
    return Response(content=pdf_content, media_type="application/pdf")
