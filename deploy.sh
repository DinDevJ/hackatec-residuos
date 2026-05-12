#!/bin/bash
set -e

echo "==> Desplegando hackatec-residuos..."

# Backend
echo "==> Instalando dependencias backend..."
cd backend
pip install -r requirements.txt
cd ..

# Frontend
echo "==> Build frontend..."
cd frontend
npm install
npm run build
cd ..

echo "==> Reiniciando servicios..."
sudo systemctl restart fastapi

echo "==> Listo."
