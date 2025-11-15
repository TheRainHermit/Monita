from fastapi import FastAPI
from app.routers import agua, energia, health
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Monita API",
    description="API para monitoreo intensivo de agua y energía de Cali",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o ["*"] para pruebas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(agua.router)
app.include_router(energia.router)
app.include_router(health.router)