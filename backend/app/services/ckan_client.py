import requests

CKAN_BASE_URL = "https://datos.cali.gov.co/api/3/action"

def search_datasets(query="", start=0, rows=10, format=None, theme=None):
    """Busca datasets con paginación y filtros opcionales."""
    url = f"{CKAN_BASE_URL}/package_search"
    # Construir el query CKAN
    q = query
    if theme:
        q += f" {theme}"
    params = {
        "q": q.strip(),
        "start": start,
        "rows": rows
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    datasets = response.json()["result"]["results"]

    # Si se solicita filtro por formato (ej: CSV)
    if format:
        format = format.lower()
        datasets = [
            ds for ds in datasets
            if any(r.get("format", "").lower() == format for r in ds.get("resources", []))
        ]
    return datasets

def get_resource(resource_id):
    """Obtiene detalles de un recurso por su ID."""
    url = f"{CKAN_BASE_URL}/resource_show"
    params = {"id": resource_id}
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()["result"]

def download_csv(resource_url, dest_path):
    """Descarga un recurso CSV dado su URL."""
    response = requests.get(resource_url)
    response.raise_for_status()
    with open(dest_path, "wb") as f:
        f.write(response.content)
    return dest_path

def get_curated_agua_resource():
    # Devuelve el recurso CKAN específico para agua
    return {
        "id": "xxxx-agua-dataset-id",
        "url": "https://datos.cali.gov.co/path/to/agua.csv"
    }