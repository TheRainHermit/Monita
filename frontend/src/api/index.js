export async function fetchResourceKPIs(resourceId) {
  const resp = await fetch(`/resources/${resourceId}/kpis`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Error al cargar KPIs");
  }
  return await resp.json();
}

export async function fetchResourceChart(resourceId, column, chartType = "histogram", bins = 10) {
  const params = new URLSearchParams({ column, chart_type: chartType, bins });
  const resp = await fetch(`/resources/${resourceId}/chart?${params.toString()}`);
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || "Error al cargar gráfico");
  }
  return await resp.json();
}

