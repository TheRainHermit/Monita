from pydantic import BaseModel
from typing import List, Dict, Any, Optional

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
    resources: list = []

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

class ResourcePreviewResponse(BaseModel):
    columns: List[str]
    rows: List[Dict[str, Any]]  # Cada fila es un dict columna:valor
    total_rows: int

class ResourceColumnsResponse(BaseModel):
    columns: List[str]

class ResourceFilterResponse(BaseModel):
    columns: List[str]
    rows: List[Dict[str, Any]]
    page: int
    total_pages: int
    total: int

class ColumnKPI(BaseModel):
    column: str
    count: int
    mean: float = None
    min: float = None
    max: float = None
    sum: float = None

class ResourceKPIsResponse(BaseModel):
    kpis: List[ColumnKPI]

class ChartDataPoint(BaseModel):
    label: str
    value: float

class ResourceChartResponse(BaseModel):
    column: str
    chart_type: str  # "histogram", "bar", "line", etc.
    data: List[ChartDataPoint]

