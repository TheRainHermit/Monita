from typing import List, Optional
from fastapi import APIRouter, Query
from app.services.agua_analysis import (
    get_timeseries, get_zonas, get_summary, get_anomalies, get_comparativa, get_datasets, get_raw
)
from app.models.common import (
    TimeSeriesResponse, ZonasResponse, SummaryResponse, AnomaliesResponse,
    ComparativaResponse, DatasetsResponse, ZonasDistinctResponse, TiposUsuarioDistinctResponse
)

router = APIRouter(prefix="/agua", tags=["agua"])

@router.get("/datasets", response_model=DatasetsResponse)
def list_datasets():
    return get_datasets()

@router.get("/consumo/timeseries", response_model=TimeSeriesResponse)
def consumo_timeseries(
    zonas: Optional[List[str]] = Query(None),
    tipo_usuario: Optional[str] = None,
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None
):
    return get_timeseries(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/zonas", response_model=ZonasResponse)
def consumo_zonas(
    zonas: Optional[List[str]] = Query(None),
    tipo_usuario: Optional[str] = None,
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None
):
    return get_zonas(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/summary", response_model=SummaryResponse)
def consumo_summary(
    zonas: Optional[List[str]] = Query(None),
    tipo_usuario: Optional[str] = None,
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None
):
    return get_summary(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/anomalies", response_model=AnomaliesResponse)
def consumo_anomalies(
    zonas: Optional[List[str]] = Query(None),
    tipo_usuario: Optional[str] = None,
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None
):
    return get_anomalies(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/comparativa", response_model=ComparativaResponse)
def consumo_comparativa(
    zona1: str,
    zona2: str,
    tipo_usuario: Optional[str] = None,
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None
):
    return get_comparativa(zona1=zona1, zona2=zona2, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/consumo/raw", response_model=TimeSeriesResponse)
def consumo_raw(
    zonas: Optional[List[str]] = Query(None),
    tipo_usuario: Optional[str] = None,
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None
):
    return get_raw(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)

@router.get("/zonas/distinct", response_model=ZonasDistinctResponse)
def get_zonas_distinct():
    import pandas as pd
    from app.config import AGUA_DATASET_URL
    df = pd.read_csv(AGUA_DATASET_URL, encoding="utf-8")
    zonas = sorted(df["zona"].dropna().unique())
    return {"zonas": zonas}

@router.get("/tipos_usuario/distinct", response_model=TiposUsuarioDistinctResponse)
def get_tipos_usuario_distinct():
    import pandas as pd
    from app.config import AGUA_DATASET_URL
    df = pd.read_csv(AGUA_DATASET_URL, encoding="utf-8")
    tipos = sorted(df["tipo_usuario"].dropna().unique())
    return {"tipos_usuario": tipos}