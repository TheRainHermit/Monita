from app.main import limiter
from fastapi import Request, APIRouter, HTTPException, Query
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
import math
import logging
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from urllib.parse import urlparse
from functools import lru_cache
import gc
from app.config import settings
from app.models.common import (
    ResourcePreviewResponse,
    ResourceColumnsResponse,
    ResourceFilterResponse,
    ResourceKPIsResponse,
    ResourceChartResponse,
    ColumnKPI,
    ChartDataPoint
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

session = requests.Session()
retries = Retry(
    total=settings.MAX_RETRIES,
    backoff_factor=0.5,
    status_forcelist=[500, 502, 503, 504]
)
session.mount('http://', HTTPAdapter(max_retries=retries))
session.mount('https://', HTTPAdapter(max_retries=retries))

def validate_url(url: str) -> bool:
    """Valida que la URL sea segura, esté permitida y tenga extensión válida"""
    try:
        result = urlparse(url)
        if not all([result.scheme in ['http', 'https'], result.netloc]):
            return False
        if not any(result.netloc.endswith(domain) for domain in settings.ALLOWED_DOMAINS):
            return False
        allowed_exts = ('.csv', '.xls', '.xlsx')
        if not url.lower().endswith(allowed_exts):
            return False
        return True
    except Exception:
        return False

def get_file_size(url: str) -> int:
    """Obtiene el tamaño del archivo en bytes sin descargarlo completamente"""
    try:
        response = session.head(url, timeout=settings.REQUEST_TIMEOUT, allow_redirects=True)
        response.raise_for_status()
        size = int(response.headers.get('content-length', 0))
        return size
    except requests.RequestException as e:
        logger.error(f"Error al obtener tamaño del archivo {url}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"No se pudo obtener el tamaño del archivo: {str(e)}"
        )

@lru_cache(maxsize=128)
def get_resource_metadata_cached(resource_id: str) -> Dict[str, Any]:
    """Obtiene los metadatos de un recurso desde CKAN (con caché simple)"""
    try:
        res = session.get(f"{settings.CKAN_BASE_URL}/resource_show?id={resource_id}", timeout=settings.REQUEST_TIMEOUT)
        data = res.json()
        if not data.get("success"):
            raise HTTPException(status_code=404, detail="Recurso no encontrado en CKAN")
        return data["result"]
    except Exception as e:
        logger.error(f"Error al obtener metadatos del recurso {resource_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener metadatos del recurso")

def get_resource_dataframe(url: str, formato: str, nrows: Optional[int] = None) -> pd.DataFrame:
    """Carga un DataFrame desde una URL con manejo de memoria y validaciones"""
    if not validate_url(url):
        raise HTTPException(status_code=400, detail="URL no permitida o inválida")

    file_size_bytes = get_file_size(url)
    max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if file_size_bytes > max_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"El archivo es demasiado grande. Tamaño máximo permitido: {settings.MAX_FILE_SIZE_MB}MB"
        )

    try:
        if file_size_bytes > 10 * 1024 * 1024:  # >10MB
            chunks = []
            chunk_iter = pd.read_csv(
                url,
                chunksize=settings.PANDAS_READ_CHUNKSIZE,
                nrows=nrows,
                encoding_errors='replace'
            ) if formato == "csv" else pd.read_excel(
                url,
                chunksize=settings.PANDAS_READ_CHUNKSIZE,
                nrows=nrows
            )
            for chunk in chunk_iter:
                chunks.append(chunk)
                if nrows and len(chunks) * settings.PANDAS_READ_CHUNKSIZE >= nrows:
                    break
            df = pd.concat(chunks, ignore_index=True)
            if nrows:
                df = df.head(nrows)
            return df
        if formato == "csv":
            return pd.read_csv(url, nrows=nrows, encoding_errors='replace')
        elif formato in ["xlsx", "xls"]:
            return pd.read_excel(url, nrows=nrows)
        else:
            return pd.read_csv(url, nrows=nrows, encoding_errors='replace')
    except Exception as e:
        logger.error(f"Error al leer archivo {formato} desde {url}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Error al leer el archivo {formato}: {str(e)}"
        )

@router.get("/resources/{resource_id}/preview", response_model=ResourcePreviewResponse)
@limiter.limit("10/minute")
async def get_resource_preview(
    request: Request,
    resource_id: str,
    rows: int = Query(10, ge=1, le=100, description="Número de filas a devolver")
):
    """
    Devuelve una vista previa de las primeras filas de un recurso tabular.

    **Advertencia:** Límite de 10 solicitudes por minuto por IP.

    **Parámetros:**
    - `resource_id`: ID del recurso en CKAN.
    - `rows`: Número de filas a mostrar (máx: 100).

    **Ejemplo de uso:**
    ```
    GET /resources/xxxx-agua-dataset-id/preview?rows=10
    ```

    **Errores comunes:**
    - 400: El recurso no es tabular o la URL no es válida.
    - 404: El recurso no existe.
    - 413: El archivo es demasiado grande.
    - 429: Se excedió el rate limit.
    """
    df = None
    try:
        resource = get_resource_metadata_cached(resource_id)
        url = resource["url"]
        formato = resource.get("format", "").lower()
        if not any(ext in formato for ext in ["csv", "xlsx", "xls"]):
            raise HTTPException(status_code=400, detail="Formato de archivo no soportado para vista previa")
        df = get_resource_dataframe(url, formato, nrows=rows + 1)
        total_rows = len(df)
        has_more = total_rows > rows
        df_preview = df.head(rows)
        return {
            "columns": df_preview.columns.tolist(),
            "rows": df_preview.replace({np.nan: None}).to_dict(orient="records"),
            "total_rows": total_rows,
            "has_more": has_more
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en get_resource_preview: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al generar la vista previa")
    finally:
        if df is not None:
            del df
            gc.collect()

@router.get("/resources/{resource_id}/columns", response_model=ResourceColumnsResponse)
@limiter.limit("20/minute")
async def get_columns(
    request: Request,
    resource_id: str
):
    """
    Devuelve la lista de columnas de un recurso tabular.

    **Advertencia:** Límite de 20 solicitudes por minuto por IP.

    **Parámetros:**
    - `resource_id`: ID del recurso en CKAN.

    **Ejemplo de uso:**
    ```
    GET /resources/xxxx-agua-dataset-id/columns
    ```

    **Errores comunes:**
    - 400: El recurso no es tabular o la URL no es válida.
    - 404: El recurso no existe.
    - 429: Se excedió el rate limit.
    """
    df = None
    try:
        resource = get_resource_metadata_cached(resource_id)
        url = resource["url"]
        formato = resource.get("format", "").lower()
        df = get_resource_dataframe(url, formato, nrows=1)
        return {"columns": df.columns.tolist()}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en get_columns: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener las columnas")
    finally:
        if df is not None:
            del df
            gc.collect()

@router.get("/resources/{resource_id}/filter", response_model=ResourceFilterResponse)
@limiter.limit("10/minute")
async def filter_resource(
    request: Request,
    resource_id: str,
    page: int = Query(1, ge=1, description="Número de página"),
    page_size: int = Query(settings.CHUNK_SIZE, ge=1, le=100, description="Tamaño de página"),
    filters: Optional[str] = Query(None, description="Filtros en formato JSON: {\"columna\": \"valor\"}"),
    sort_by: Optional[str] = Query(None, description="Columna por la que ordenar"),
    sort_order: str = Query("asc", regex="^(asc|desc)$", description="Orden: asc (ascendente) o desc (descendente)")
):
    """
    Filtra y pagina los datos del recurso tabular.

    **Advertencia:** Límite de 10 solicitudes por minuto por IP.

    **Parámetros:**
    - `resource_id`: ID del recurso en CKAN.
    - `page`: Número de página.
    - `page_size`: Tamaño de página (máx: 100).
    - `filters`: Filtros en formato JSON, ej: {"columna": "valor"}.
    - `sort_by`: Columna para ordenar.
    - `sort_order`: "asc" o "desc".

    **Ejemplo de uso:**
    ```
    GET /resources/xxxx-agua-dataset-id/filter?page=1&page_size=20&filters={"comuna":"1"}
    ```

    **Errores comunes:**
    - 400: Filtros inválidos o recurso no tabular.
    - 404: El recurso no existe.
    - 429: Se excedió el rate limit.
    """
    df = None
    try:
        resource = get_resource_metadata_cached(resource_id)
        url = resource["url"]
        formato = resource.get("format", "").lower()
        df = get_resource_dataframe(url, formato)
        total_rows = len(df)
        total_pages = math.ceil(total_rows / page_size)
        if filters:
            import json
            try:
                filter_dict = json.loads(filters)
                for col, val in filter_dict.items():
                    if col in df.columns:
                        if pd.api.types.is_numeric_dtype(df[col]):
                            try:
                                df = df[df[col] == float(val)]
                            except (ValueError, TypeError):
                                df = df[df[col].astype(str).str.contains(str(val), case=False, na=False)]
                        else:
                            df = df[df[col].astype(str).str.contains(str(val), case=False, na=False)]
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Formato de filtros inválido")
        if sort_by and sort_by in df.columns:
            df = df.sort_values(by=sort_by, ascending=(sort_order == "asc"))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        df_page = df.iloc[start_idx:end_idx]
        return {
            "columns": df.columns.tolist(),
            "rows": df_page.replace({np.nan: None}).to_dict(orient="records"),
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "total": total_rows
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en filter_resource: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al filtrar los datos")
    finally:
        if df is not None:
            del df
            gc.collect()

@router.get("/resources/{resource_id}/kpis", response_model=ResourceKPIsResponse)
@limiter.limit("5/minute")
async def get_resource_kpis(
    request: Request,
    resource_id: str
):
    """
    Calcula y devuelve KPIs automáticos para las columnas numéricas del recurso tabular.

    **Advertencia:** Límite de 5 solicitudes por minuto por IP.

    **Parámetros:**
    - `resource_id`: ID del recurso en CKAN.

    **Ejemplo de uso:**
    ```
    GET /resources/xxxx-agua-dataset-id/kpis
    ```

    **Errores comunes:**
    - 400: El recurso no es tabular o la URL no es válida.
    - 404: El recurso no existe.
    - 429: Se excedió el rate limit.
    """
    df = None
    try:
        resource = get_resource_metadata_cached(resource_id)
        url = resource["url"]
        formato = resource.get("format", "").lower()
        df = get_resource_dataframe(url, formato)
        kpis = []
        for col in df.columns:
            if pd.api.types.is_numeric_dtype(df[col]):
                col_kpi = {
                    "column": col,
                    "count": int(df[col].count()),
                    "mean": float(df[col].mean()) if not df[col].empty else None,
                    "min": float(df[col].min()) if not df[col].empty else None,
                    "max": float(df[col].max()) if not df[col].empty else None,
                    "sum": float(df[col].sum()) if not df[col].empty else None,
                    "std": float(df[col].std()) if len(df[col]) > 1 else None
                }
                kpis.append(ColumnKPI(**col_kpi))
        return {"kpis": kpis}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en get_resource_kpis: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al calcular los KPIs")
    finally:
        if df is not None:
            del df
            gc.collect()

@router.get("/resources/{resource_id}/chart", response_model=ResourceChartResponse)
@limiter.limit("5/minute")
async def get_chart_data(
    request: Request,
    resource_id: str,
    column: str,
    chart_type: str = Query("histogram", regex="^(histogram|bar|line|pie)$"),
    bins: int = Query(10, ge=2, le=50, description="Número de bins para histograma")
):
    """
    Genera datos agregados para gráficas a partir de una columna del recurso tabular.

    **Advertencia:** Límite de 5 solicitudes por minuto por IP.

    **Parámetros:**
    - `resource_id`: ID del recurso en CKAN.
    - `column`: Columna para graficar.
    - `chart_type`: Tipo de gráfica ("histogram", "bar", "line", "pie").
    - `bins`: Número de bins para histogramas (2-50).

    **Ejemplo de uso:**
    ```
    GET /resources/xxxx-agua-dataset-id/chart?column=consumo&chart_type=histogram&bins=10
    ```

    **Errores comunes:**
    - 400: Columna inválida o recurso no tabular.
    - 404: El recurso o la columna no existen.
    - 429: Se excedió el rate limit.
    """
    df = None
    try:
        resource = get_resource_metadata_cached(resource_id)
        url = resource["url"]
        formato = resource.get("format", "").lower()
        df = get_resource_dataframe(url, formato)
        if column not in df.columns:
            raise HTTPException(status_code=404, detail=f"Columna '{column}' no encontrada")
        data_points = []
        if pd.api.types.is_numeric_dtype(df[column]):
            if chart_type == "histogram":
                hist, bin_edges = np.histogram(df[column].dropna(), bins=bins)
                for i in range(len(hist)):
                    label = f"{bin_edges[i]:.2f}-{bin_edges[i+1]:.2f}"
                    data_points.append(ChartDataPoint(label=label, value=float(hist[i])))
            else:
                if chart_type == "pie":
                    value_counts = df[column].value_counts().head(10)
                    for val, count in value_counts.items():
                        data_points.append(ChartDataPoint(label=str(val), value=float(count)))
                else:
                    unique_values = df[column].drop_duplicates().sort_values()
                    for val in unique_values:
                        count = (df[column] == val).sum()
                        data_points.append(ChartDataPoint(label=str(val), value=float(count)))
        else:
            value_counts = df[column].value_counts().head(20)
            for val, count in value_counts.items():
                data_points.append(ChartDataPoint(label=str(val), value=float(count)))
        return {
            "column": column,
            "chart_type": chart_type,
            "data": data_points
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en get_chart_data: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al generar los datos del gráfico")
    finally:
        if df is not None:
            del df
            gc.collect()