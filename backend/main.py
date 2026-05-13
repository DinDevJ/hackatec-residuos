from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import contenedores, kpis, asistente

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

app.include_router(contenedores.router, prefix="/contenedores")
app.include_router(kpis.router, prefix="/kpis")
app.include_router(asistente.router, prefix="/asistente")


@app.get("/")
def root():
    return {"status": "ok"}
