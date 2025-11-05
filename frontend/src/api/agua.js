const BASE_URL = "http://localhost:8000/agua";

export async function fetchSummary(params) {
  // params: { zona, fecha_inicio, fecha_fin }
  const url = new URL(`${BASE_URL}/consumo/summary`);
  Object.entries(params || {}).forEach(([k, v]) => v && url.searchParams.append(k, v));
  const res = await fetch(url);
  return res.json();
}

export async function fetchTimeSeries(params) {
  const url = new URL(`${BASE_URL}/consumo/timeseries`);
  Object.entries(params || {}).forEach(([k, v]) => v && url.searchParams.append(k, v));
  const res = await fetch(url);
  return res.json();
}

// ...igual para zonas, comparativa, anomalies, datasets, raw