#!/bin/bash
echo "=== Iniciando despliegue en Producción ==="

# 1. Traer los últimos cambios
cd /root/hackatec-residuos
git pull origin main

# 2. Actualizar Backend
echo "-> Actualizando Backend..."
source backend/venv/bin/activate
pip install -r backend/requirements.txt
sudo systemctl restart fastapi.service

# 3. Actualizar Frontend
echo "-> Actualizando Frontend..."
cd frontend
npm install
npm run build
# Mover los archivos nuevos a la carpeta de Nginx
sudo rm -rf /var/www/hackatec/*
sudo cp -r dist/* /var/www/hackatec/

echo "=== Despliegue finalizado con éxito! ==="
