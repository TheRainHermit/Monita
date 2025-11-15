import pandas as pd
from app.services.ckan_client import search_datasets
from app.config import AGUA_DATASET_URL
from app.models.common import (
    TimeSeriesResponse, TimeSeriesItem, ZonasResponse, ZonaItem,
    SummaryResponse, SummaryKPIs, AnomaliesResponse, AnomalyItem,
    ComparativaResponse, ComparativaItem, DatasetsResponse, DatasetInfo
)

def apply_filters(df, zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    if zonas:
        df = df[df["zona"].isin(zonas)]
    if tipo_usuario:
        df = df[df["tipo_usuario"] == tipo_usuario]
    if fecha_inicio:
        df = df[df["fecha"] >= fecha_inicio]
    if fecha_fin:
        df = df[df["fecha"] <= fecha_fin]
    return df

def get_timeseries(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(AGUA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["mes"] = df["fecha"].dt.to_period("M").astype(str)
    timeseries = df.groupby("mes")["consumo_m3"].sum().reset_index()
    return TimeSeriesResponse(
        series=[
            TimeSeriesItem(mes=row["mes"], consumo_m3=row["consumo_m3"])
            for _, row in timeseries.iterrows()
        ]
    )

def get_zonas(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(AGUA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    df["zona"] = df["zona"].fillna("Desconocida")
    zonas_df = df.groupby("zona")["consumo_m3"].sum().reset_index()
    zonas_df = zonas_df.sort_values(by="consumo_m3", ascending=False)
    return ZonasResponse(
        zonas=[
            ZonaItem(zona=row["zona"], consumo_m3=row["consumo_m3"])
            for _, row in zonas_df.iterrows()
        ]
    )

def get_summary(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(AGUA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    total = float(df["consumo_m3"].sum())
    promedio = float(df["consumo_m3"].mean())
    maximo = float(df["consumo_m3"].max())
    minimo = float(df["consumo_m3"].min())
    return SummaryResponse(
        summary=SummaryKPIs(
            total=total, promedio=promedio, maximo=maximo, minimo=minimo
        )
    )

def get_anomalies(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(AGUA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    mean = df["consumo_m3"].mean()
    std = df["consumo_m3"].std()
    df["z"] = (df["consumo_m3"] - mean) / std
    anomalies = df[abs(df["z"]) > 2]
    return AnomaliesResponse(
        anomalies=[
            AnomalyItem(fecha=str(row["fecha"]), valor=row["consumo_m3"], tipo="outlier")
            for _, row in anomalies.iterrows()
        ]
    )

def get_comparativa(zona1, zona2, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(AGUA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, None, tipo_usuario, fecha_inicio, fecha_fin)
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["mes"] = df["fecha"].dt.to_period("M").astype(str)
    comp = []
    for mes, group in df.groupby("mes"):
        v1 = group[group["zona"] == zona1]["consumo_m3"].sum()
        v2 = group[group["zona"] == zona2]["consumo_m3"].sum()
        comp.append(ComparativaItem(periodo=mes, zona1=v1, zona2=v2))
    return ComparativaResponse(comparativa=comp)

def seleccionar_recurso_principal(resources):
    # 1. Filtra por CSV
    csvs = [r for r in resources if r.get("format", "").lower() == "csv"]
    if csvs:
        # 2. Toma el de mayor tamaño si hay size
        csvs_con_size = [r for r in csvs if r.get("size")]
        if csvs_con_size:
            return max(csvs_con_size, key=lambda r: r["size"])
        # 3. Si no hay size, toma el más reciente si hay fecha
        csvs_con_fecha = [r for r in csvs if r.get("last_modified")]
        if csvs_con_fecha:
            return max(csvs_con_fecha, key=lambda r: r["last_modified"])
        # 4. Si no, el primero
        return csvs[0]
    # 5. XLSX
    xlsxs = [r for r in resources if r.get("format", "").lower() == "xlsx"]
    if xlsxs:
        return xlsxs[0]
    # 6. JSON
    jsons = [r for r in resources if r.get("format", "").lower() == "json"]
    if jsons:
        return jsons[0]
    # 7. Si nada de lo anterior, primero disponible
    if resources:
        return resources[0]
    return None

def get_datasets():
    ckan_results = search_datasets(query="agua", rows=10)
    datasets = []
    for ds in ckan_results:
        resources = ds.get("resources", [])
        recurso_principal = seleccionar_recurso_principal(resources)
        datasets.append(DatasetInfo(
            id=ds["id"],
            nombre=ds.get("title", "Sin título"),
            url=recurso_principal["url"] if recurso_principal else ds.get("url", ""),
            resources=resources
        ))
    return DatasetsResponse(datasets=datasets)


def get_raw(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    return get_timeseries(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)