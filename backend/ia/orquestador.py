from ia.motor import preguntar


def construir_contexto(contenedores: list) -> str:
    resumen = "\n".join(
        f"- Contenedor {c['id']} ({c['zona']}): {c['nivel_llenado']}% lleno"
        for c in contenedores
    )
    return f"Estado actual de contenedores:\n{resumen}"


def responder_consulta(pregunta: str, contenedores: list) -> str:
    contexto = construir_contexto(contenedores)
    prompt = f"{contexto}\n\nPregunta del operador: {pregunta}\nResponde de forma concisa."
    return preguntar(prompt)
