import pandas as pd
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

def get_datasets():
    return DatasetsResponse(
        datasets=[
            DatasetInfo(
                id="xxxx-agua-dataset-id",
                nombre="Consumo de Agua Cali",
                url=AGUA_DATASET_URL
            )
        ]
    )

def get_raw(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    return get_timeseries(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)