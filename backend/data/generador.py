import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Parámetros
NUM_CONTENEDORES = 300
DIAS_HISTORIAL = 60

ZONAS = ["Centro", "Norte", "Sur", "Oriente", "Poniente"]
TIPOS_ZONA = ["residencial", "comercial", "mercado", "escolar"]

def generar_contenedores():
    contenedores = []
    for i in range(1, NUM_CONTENEDORES + 1):
        id_cont = f"MOR-{i:04d}"
        # Lat/Lng dentro de la mancha urbana de Morelia
        lat = np.random.uniform(19.65, 19.75)
        lng = np.random.uniform(-101.25, -101.10)
        zona = random.choice(ZONAS)
        tipo_zona = random.choice(TIPOS_ZONA)
        nivel_actual = random.randint(0, 100)
        
        contenedores.append({
            "id": id_cont,
            "lat": round(lat, 6),
            "lng": round(lng, 6),
            "zona": zona,
            "tipo_zona": tipo_zona,
            "nivel_actual": nivel_actual
        })
    return pd.DataFrame(contenedores)

def generar_historial(df_contenedores):
    # Genera 60 días hacia atrás desde hoy
    fecha_fin = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    fecha_inicio = fecha_fin - timedelta(days=DIAS_HISTORIAL - 1)
    fechas = pd.date_range(start=fecha_inicio, end=fecha_fin, freq='D')
    
    historial = []
    
    for fecha in fechas:
        es_domingo = fecha.weekday() == 6
        
        # Seleccionar contenedor de tianguis aleatorio si es domingo
        tianguis_id = None
        if es_domingo:
            tianguis_id = random.choice(df_contenedores['id'].tolist())

        for _, cont in df_contenedores.iterrows():
            # Nivel base diario
            nivel_diario = random.uniform(30, 60)
            
            # Aplicar patrones según tipo de zona
            if cont['tipo_zona'] == 'mercado':
                nivel_diario *= 1.30 # 30% más rápido
            elif cont['tipo_zona'] == 'comercial' and (fecha.weekday() == 4 or fecha.weekday() == 5):
                nivel_diario *= 1.50 # Pico comercial (Viernes o Sábado)
            elif cont['tipo_zona'] == 'residencial':
                nivel_diario = random.uniform(40, 50) # Constante
            elif cont['tipo_zona'] == 'escolar':
                if fecha.weekday() >= 5: # Fines de semana no hay clases
                    nivel_diario = random.uniform(5, 15)
                else:
                    nivel_diario = random.uniform(50, 70)
                
            # Aplicar evento especial
            if cont['id'] == tianguis_id:
                nivel_diario = 95 # Evento especial tianguis
            else:
                # Asegurar que no rebase el 100% (a menos que sea por un evento atípico, limitamos al 100)
                nivel_diario = min(100, nivel_diario + random.uniform(-10, 10))
            
            # Limitar inferiormente a 0
            nivel_diario = max(0, nivel_diario)
            
            historial.append({
                "id_contenedor": cont['id'],
                "fecha": fecha,
                "nivel_llenado": round(nivel_diario, 2)
            })
            
    return pd.DataFrame(historial)

if __name__ == "__main__":
    # Asegurar que el directorio actual sea el correcto
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("Generando datos de contenedores...")
    df_contenedores = generar_contenedores()
    df_contenedores.to_csv("contenedores.csv", index=False)
    print(f"contenedores.csv generado con {len(df_contenedores)} registros.")
    
    print("Generando historial diario (60 días)...")
    df_historial = generar_historial(df_contenedores)
    df_historial.to_parquet("historial.parquet", index=False)
    print(f"historial.parquet generado con {len(df_historial)} registros.")
