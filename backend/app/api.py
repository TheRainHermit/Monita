from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from app import ckan_client
import os
import tempfile
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O restringe a ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/datasets/search")
def search_datasets(
    query: str = "",
    start: int = 0,
    rows: int = 10,
    format: str = None,
    theme: str = None
):
    """
    Busca datasets con paginación y filtros.
    Ejemplo: /datasets/search?query=consumo&format=csv&theme=agua&start=0&rows=5
    """
    try:
        results = ckan_client.search_datasets(
            query=query,
            start=start,
            rows=rows,
            format=format,
            theme=theme
        )
        return {"datasets": results}
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resources/{resource_id}")
def get_resource(resource_id: str):
    try:
        resource = ckan_client.get_resource(resource_id)
        return resource
    except Exception as e:
        print("ERROR:", e) 
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resources/{resource_id}/download")
def download_resource(resource_id: str):
    try:
        resource = ckan_client.get_resource(resource_id)
        resource_url = resource.get("url")
        if not resource_url or not resource_url.endswith('.csv'):
            raise HTTPException(status_code=400, detail="El recurso no es un archivo CSV válido o no tiene URL.")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            ckan_client.download_csv(resource_url, tmp.name)
            tmp_path = tmp.name
        filename = os.path.basename(resource_url)
        return FileResponse(tmp_path, filename=filename, media_type="text/csv")
    except Exception as e:
        print("ERROR:", e) 
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resources/{resource_id}/columns")
def get_csv_columns(resource_id: str):
    try:
        resource = ckan_client.get_resource(resource_id)
        resource_url = resource.get("url")
        if not resource_url or not resource_url.endswith('.csv'):
            raise HTTPException(status_code=400, detail="El recurso no es un archivo CSV válido o no tiene URL.")
        df = pd.read_csv(resource_url, encoding="latin1", sep=";", on_bad_lines='skip')
        return {"columns": df.columns.tolist()}
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resources/{resource_id}/filter")
def filter_csv_rows(resource_id: str, columna: str, valor: str, page: int = 1, page_size: int = 10):
    try:
        resource = ckan_client.get_resource(resource_id)
        resource_url = resource.get("url")
        if not resource_url or not resource_url.endswith('.csv'):
            raise HTTPException(status_code=400, detail="El recurso no es un archivo CSV válido o no tiene URL.")
        df = pd.read_csv(resource_url, encoding="latin1", sep=";", on_bad_lines='skip')
        if columna not in df.columns:
            raise HTTPException(status_code=400, detail=f"La columna '{columna}' no existe en el recurso.")
        filtered = df[df[columna].astype(str) == valor]
        total = len(filtered)
        start = (page - 1) * page_size
        end = start + page_size
        rows = filtered.iloc[start:end].to_dict(orient="records")
        return {
            "rows": rows,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (total + page_size - 1) // page_size
        }
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resources/{resource_id}/stats")
def csv_column_stats(resource_id: str, columna: str):
    try:
        resource = ckan_client.get_resource(resource_id)
        resource_url = resource.get("url")
        if not resource_url or not resource_url.endswith('.csv'):
            raise HTTPException(status_code=400, detail="El recurso no es un archivo CSV válido o no tiene URL.")
        df = pd.read_csv(resource_url, encoding="latin1", sep=";", on_bad_lines='skip')
        if columna not in df.columns:
            raise HTTPException(status_code=400, detail=f"La columna '{columna}' no existe en el recurso.")
        if not pd.api.types.is_numeric_dtype(df[columna]):
            raise HTTPException(status_code=400, detail=f"La columna '{columna}' no es numérica.")
        stats = {
            "count": int(df[columna].count()),
            "sum": float(df[columna].sum()),
            "mean": float(df[columna].mean()),
            "min": float(df[columna].min()),
            "max": float(df[columna].max())
        }
        return {"stats": stats}
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))