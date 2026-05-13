from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import contenedores, kpis, asistente, ai, map_router, routes, dashboard, fleet, alerts

app = FastAPI(
    root_path="/api",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing routes (keep if needed, otherwise ignore)
app.include_router(contenedores.router, prefix="/contenedores")
app.include_router(kpis.router, prefix="/kpis")
app.include_router(asistente.router, prefix="/asistente")

# New contract routes
app.include_router(ai.router, prefix="/ai")
app.include_router(map_router.router, prefix="/map")
app.include_router(routes.router, prefix="/routes")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(fleet.router, prefix="/fleet")
app.include_router(alerts.router, prefix="/alerts")

@app.get("/")
def root():
    return {"status": "ok"}
