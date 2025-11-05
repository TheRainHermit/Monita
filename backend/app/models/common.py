from pydantic import BaseModel
from typing import List, Optional

class TimeSeriesItem(BaseModel):
    mes: str
    consumo_m3: float

class ZonaItem(BaseModel):
    zona: str
    consumo_m3: float

class SummaryKPIs(BaseModel):
    total: float
    promedio: float
    maximo: float
    minimo: float

class AnomalyItem(BaseModel):
    fecha: str
    valor: float
    tipo: str  # ejemplo: "alto", "bajo", "outlier"

class ComparativaItem(BaseModel):
    periodo: str
    zona1: float
    zona2: float

class DatasetInfo(BaseModel):
    id: str
    nombre: str
    url: str

# Respuestas completas

class TimeSeriesResponse(BaseModel):
    series: List[TimeSeriesItem]

class ZonasResponse(BaseModel):
    zonas: List[ZonaItem]

class SummaryResponse(BaseModel):
    summary: SummaryKPIs

class AnomaliesResponse(BaseModel):
    anomalies: List[AnomalyItem]

class ComparativaResponse(BaseModel):
    comparativa: List[ComparativaItem]

class DatasetsResponse(BaseModel):
    datasets: List[DatasetInfo]

class ZonasDistinctResponse(BaseModel):
    zonas: List[str]

class TiposUsuarioDistinctResponse(BaseModel):
    tipos_usuario: List[str]