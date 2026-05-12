# EcoTrack — Reglas del Proyecto

## Stack obligatorio
- Backend: Python 3.11, FastAPI, Pandas, NumPy, scikit-learn, ReportLab
- Frontend: React 18 + Vite, Tailwind CSS, Mapbox GL JS, Recharts
- IA: Google Gemini 2.5 Flash-Lite vía SDK oficial google-genai
- Datos: CSV/Parquet en disco, sin base de datos

## Reglas duras
- NO usar Streamlit, Dash, ni Flask
- NO usar pypdf ni IronPDF, solo ReportLab
- NO mencionar CVRP en código ni comentarios — usar "algoritmo heurístico de priorización"
- NO crear localStorage ni sessionStorage en frontend
- NO inventar endpoints — seguir el contrato en docs/api-contract.md
- Variables sensibles (GEMINI_API_KEY) van en .env, nunca en código

## Convenciones
- Endpoints REST bajo /api/*
- JSON con snake_case
- Comentarios en español
- Commits en formato: "tipo(scope): mensaje" (feat, fix, docs, refactor)

## Estructura
- backend/ — todo Python aquí
- frontend/ — todo React aquí
- infra/ — Nginx, systemd, deployment
- docs/ — contrato de API, decisiones técnicas