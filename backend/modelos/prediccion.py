def predecir_llenado(contenedor: dict) -> dict:
    """Placeholder: retorna estimación de dias hasta llenado completo."""
    nivel = contenedor.get("nivel_llenado", 0)
    dias_restantes = max(0, round((100 - nivel) / 10))
    return {"id": contenedor["id"], "dias_para_llenado": dias_restantes}
