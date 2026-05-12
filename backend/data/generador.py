import pandas as pd
import random
from datetime import datetime, timedelta

CONTENEDORES = 20
OUTPUT = "contenedores.csv"


def generar():
    rows = []
    now = datetime.now()
    for i in range(1, CONTENEDORES + 1):
        rows.append({
            "id": i,
            "zona": f"Zona-{chr(64 + ((i - 1) % 5 + 1))}",
            "lat": round(19.4 + random.uniform(-0.05, 0.05), 6),
            "lon": round(-99.1 + random.uniform(-0.05, 0.05), 6),
            "nivel_llenado": random.randint(0, 100),
            "ultima_recoleccion": (now - timedelta(days=random.randint(0, 7))).isoformat(),
        })
    df = pd.DataFrame(rows)
    df.to_csv(OUTPUT, index=False)
    print(f"Generado {OUTPUT} con {len(df)} contenedores.")


if __name__ == "__main__":
    generar()
