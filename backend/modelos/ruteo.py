def calcular_ruta(contenedores: list) -> list:
    """Placeholder: ordena contenedores por nivel de llenado descendente."""
    return sorted(contenedores, key=lambda c: c.get("nivel_llenado", 0), reverse=True)
