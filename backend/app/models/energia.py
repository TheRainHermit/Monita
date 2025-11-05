from fastapi import APIRouter
from app.services.energia_analysis import (
    get_timeseries, get_zonas, get_summary, get_anomalies, get_comparativa, get_datasets, get_raw
)

router = APIRouter(prefix="/energia", tags=["energia"])

@router.get("/datasets")
def list_datasets():
    return get_datasets()

@router.get("/consumo/timeseries")
def consumo_timeseries(zona: str = None, fecha_inicio: str = None, fecha_fin: str = None):
    return get_timeseries(zona=zona, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/zonas")
def consumo_zonas(fecha_inicio: str = None, fecha_fin: str = None):
    return get_zonas(fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/summary")
def consumo_summary(zona: str = None, fecha_inicio: str = None, fecha_fin: str = None):
    return get_summary(zona=zona, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/anomalies")
def consumo_anomalies(zona: str = None, fecha_inicio: str = None, fecha_fin: str = None):
    return get_anomalies(zona=zona, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/comparativa")
def consumo_comparativa(zona1: str, zona2: str, fecha_inicio: str = None, fecha_fin: str = None):
    return get_comparativa(zona1=zona1, zona2=zona2, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/raw")
def consumo_raw(zona: str = None, fecha_inicio: str = None, fecha_fin: str = None):
    return get_raw(zona=zona, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)