from fastapi import FastAPI
from app.routers import agua, energia, health

app = FastAPI(
    title="Monita API",
    description="API para monitoreo intensivo de agua y energía de Cali",
    version="1.0.0"
)

# Incluir routers
app.include_router(agua.router)
app.include_router(energia.router)
app.include_router(health.router)