# Notas de deployment

## Requisitos del servidor
- Ubuntu 22.04+
- Python 3.11+
- Node.js 20+
- nginx

## Pasos manuales
1. Clonar repo en `/opt/hackatec-residuos`
2. Copiar `.env.example` → `.env` y poner la API key real
3. Instalar dependencias: `pip install -r backend/requirements.txt`
4. Generar dataset: `cd backend/data && python generador.py`
5. Build frontend: `cd frontend && npm install && npm run build`
6. Copiar build a `/var/www/hackatec-residuos`
7. Instalar servicio: `sudo cp infra/fastapi.service /etc/systemd/system/`
8. `sudo systemctl enable --now fastapi`
9. `sudo cp infra/nginx.conf /etc/nginx/nginx.conf && sudo systemctl reload nginx`

## Puertos
- `8000` — FastAPI (interno)
- `80` — nginx (público)
