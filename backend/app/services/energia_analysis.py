import pandas as pd
from app.config import ENERGIA_DATASET_URL
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
    df = pd.read_csv(ENERGIA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["mes"] = df["fecha"].dt.to_period("M").astype(str)
    timeseries = df.groupby("mes")["consumo_kwh"].sum().reset_index()
    return TimeSeriesResponse(
        series=[
            TimeSeriesItem(mes=row["mes"], consumo_m3=row["consumo_kwh"])
            for _, row in timeseries.iterrows()
        ]
    )

def get_zonas(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(ENERGIA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    df["zona"] = df["zona"].fillna("Desconocida")
    zonas_df = df.groupby("zona")["consumo_kwh"].sum().reset_index()
    zonas_df = zonas_df.sort_values(by="consumo_kwh", ascending=False)
    return ZonasResponse(
        zonas=[
            ZonaItem(zona=row["zona"], consumo_m3=row["consumo_kwh"])
            for _, row in zonas_df.iterrows()
        ]
    )

def get_summary(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(ENERGIA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    total = float(df["consumo_kwh"].sum())
    promedio = float(df["consumo_kwh"].mean())
    maximo = float(df["consumo_kwh"].max())
    minimo = float(df["consumo_kwh"].min())
    return SummaryResponse(
        summary=SummaryKPIs(
            total=total, promedio=promedio, maximo=maximo, minimo=minimo
        )
    )

def get_anomalies(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(ENERGIA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, zonas, tipo_usuario, fecha_inicio, fecha_fin)
    mean = df["consumo_kwh"].mean()
    std = df["consumo_kwh"].std()
    df["z"] = (df["consumo_kwh"] - mean) / std
    anomalies = df[abs(df["z"]) > 2]
    return AnomaliesResponse(
        anomalies=[
            AnomalyItem(fecha=str(row["fecha"]), valor=row["consumo_kwh"], tipo="outlier")
            for _, row in anomalies.iterrows()
        ]
    )

def get_comparativa(zona1, zona2, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    df = pd.read_csv(ENERGIA_DATASET_URL, encoding="utf-8")
    df = apply_filters(df, None, tipo_usuario, fecha_inicio, fecha_fin)
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["mes"] = df["fecha"].dt.to_period("M").astype(str)
    comp = []
    for mes, group in df.groupby("mes"):
        v1 = group[group["zona"] == zona1]["consumo_kwh"].sum()
        v2 = group[group["zona"] == zona2]["consumo_kwh"].sum()
        comp.append(ComparativaItem(periodo=mes, zona1=v1, zona2=v2))
    return ComparativaResponse(comparativa=comp)

def get_datasets():
    return DatasetsResponse(
        datasets=[
            DatasetInfo(
                id="xxxx-energia-dataset-id",
                nombre="Consumo de Energía Cali",
                url=ENERGIA_DATASET_URL
            )
        ]
    )

def get_raw(zonas=None, tipo_usuario=None, fecha_inicio=None, fecha_fin=None):
    return get_timeseries(zonas=zonas, tipo_usuario=tipo_usuario, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin)