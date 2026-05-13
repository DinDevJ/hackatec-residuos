import io
import json
import os
from datetime import datetime

import pandas as pd
from fastapi import APIRouter
from fastapi.responses import Response
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch

router = APIRouter()

CSV_PATH = "data/contenedores.csv"

def load_json_file(filename: str):
    file_path = os.path.join("data", filename)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_zone_live_stats(zona: str) -> dict:
    """Lee el CSV y calcula métricas en vivo para una zona específica."""
    try:
        df = pd.read_csv(CSV_PATH)
        group = df[df["zona"].str.lower() == zona.lower()]
        if group.empty:
            return {}
        return {
            "total_contenedores": len(group),
            "sat_promedio": int(group["nivel_actual"].mean()),
            "contenedores_criticos": int((group["nivel_actual"] >= 80).sum()),
            "capacidad_total_kg": int(group["capacidad_kg"].sum()),
            "ids_criticos": group[group["nivel_actual"] >= 80]["id_contenedor"].tolist()[:10]
        }
    except Exception:
        return {}

def enrich_route(route: dict) -> dict:
    """Agrega datos en vivo del CSV a cada tarjeta de ruta."""
    zona = route.get("zone", "")
    live = get_zone_live_stats(zona)
    route["live_stats"] = live
    return route

@router.get("/active")
def get_active_routes():
    routes = load_json_file("rutas.json")
    return [enrich_route(r) for r in routes]

@router.get("/optimized")
def get_optimized_routes():
    routes = load_json_file("rutas.json")
    return [enrich_route(r) for r in routes]

@router.get("/{route_id}/export-pdf")
def export_pdf(route_id: str):
    routes_data = load_json_file("rutas.json")
    route_info = next(
        (r for r in routes_data if r.get("route_id") == route_id or r.get("id") == route_id),
        None
    )

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=50, leftMargin=50,
                            topMargin=60, bottomMargin=50)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("title", fontSize=20, fontName="Helvetica-Bold",
                                 textColor=colors.HexColor("#4d614e"), spaceAfter=4)
    subtitle_style = ParagraphStyle("subtitle", fontSize=10, fontName="Helvetica",
                                    textColor=colors.HexColor("#666666"), spaceAfter=20)
    section_style = ParagraphStyle("section", fontSize=12, fontName="Helvetica-Bold",
                                   textColor=colors.HexColor("#1b1c1a"), spaceBefore=16, spaceAfter=8)
    body_style = ParagraphStyle("body", fontSize=10, fontName="Helvetica",
                                textColor=colors.HexColor("#333333"), spaceAfter=6)

    story = []

    # --- Encabezado ---
    story.append(Paragraph("EcoTrack — Manifiesto de Ruta", title_style))
    story.append(Paragraph(f"Generado el {datetime.now().strftime('%d/%m/%Y %H:%M')} • Impulsado por Eco-Brain IA", subtitle_style))
    story.append(Spacer(1, 0.1 * inch))

    if route_info:
        zona = route_info.get("zone", "—")
        live = get_zone_live_stats(zona)

        # --- Tabla de datos de la ruta ---
        story.append(Paragraph("Datos de la Ruta", section_style))
        route_table_data = [
            ["Campo", "Valor"],
            ["ID de Ruta", route_info.get("route_id", route_id)],
            ["Nombre", route_info.get("name", "—")],
            ["Zona Asignada", zona],
            ["Camión Asignado", route_info.get("truck", "—")],
            ["Estatus", route_info.get("status", "—")],
            ["Tiempo Estimado", route_info.get("est_time", "—")],
            ["Eficiencia / Ahorro", route_info.get("efficiency_saved", "Estándar")],
            ["Contenedores a Cubrir", f"{route_info.get('containers_current', '—')} / {route_info.get('containers_max', '—')}"],
        ]
        t = Table(route_table_data, colWidths=[2.5 * inch, 4 * inch])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4d614e")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f5f3f0")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#ffffff"), colors.HexColor("#f5f3f0")]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ]))
        story.append(t)
        story.append(Spacer(1, 0.2 * inch))

        # --- Datos en vivo de la zona ---
        if live:
            story.append(Paragraph(f"Telemetría en Vivo — Zona {zona}", section_style))
            live_table_data = [
                ["Métrica", "Valor"],
                ["Total Contenedores en la Zona", str(live.get("total_contenedores", "—"))],
                ["Saturación Promedio", f"{live.get('sat_promedio', '—')}%"],
                ["Contenedores Críticos (≥80%)", str(live.get("contenedores_criticos", "—"))],
                ["Capacidad Total de la Zona", f"{live.get('capacidad_total_kg', '—'):,} kg"],
            ]
            lt = Table(live_table_data, colWidths=[2.5 * inch, 4 * inch])
            lt.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#8e6b73")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#ffffff"), colors.HexColor("#fdf5f7")]),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ]))
            story.append(lt)

            # IDs críticos
            if live.get("ids_criticos"):
                story.append(Spacer(1, 0.15 * inch))
                story.append(Paragraph("Contenedores Prioritarios (Requieren Atención Inmediata):", section_style))
                ids_str = "  •  ".join(live["ids_criticos"])
                story.append(Paragraph(ids_str, body_style))

    else:
        story.append(Paragraph(f"Ruta ID {route_id} no encontrada en el sistema.", body_style))

    # --- Instrucciones Eco-Brain ---
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Instrucciones de Optimización — Eco-Brain", section_style))
    instrucciones = [
        "1. Seguir la secuencia de paradas dictada por el algoritmo heurístico de priorización.",
        "2. Atender primero los contenedores con nivel de saturación ≥80% para evitar desbordamiento.",
        "3. Reportar anomalías o bloqueos viales en tiempo real a través de la app EcoTrack.",
        "4. Minimizar el tiempo en ralentí: apagar el motor en esperas mayores a 3 minutos.",
        "5. Al finalizar la ruta, confirmar cierre digital en el sistema para actualizar la telemetría.",
    ]
    for instruccion in instrucciones:
        story.append(Paragraph(instruccion, body_style))

    # --- Footer ---
    story.append(Spacer(1, 0.3 * inch))
    footer_style = ParagraphStyle("footer", fontSize=8, fontName="Helvetica-Oblique",
                                  textColor=colors.gray, alignment=1)
    story.append(Paragraph("Documento generado automáticamente por Eco-Brain IA • EcoTrack Analytics • Confidencial", footer_style))

    doc.build(story)
    pdf_content = buffer.getvalue()
    buffer.close()

    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=manifiesto_ruta_{route_id}.pdf"}
    )

