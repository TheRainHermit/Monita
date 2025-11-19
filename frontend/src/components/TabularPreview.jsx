import { useState, useMemo, useEffect } from "react";
import { useTabularResource } from "../hooks/useTabularResource";
import { useTabularKPIs } from "../hooks/useTabularKPIs";
import { useTabularChart } from "../hooks/useTabularChart";
import { fetchResourceFilter } from "../api";
import { exportToCSV, exportToXLSX } from "../utils/export";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tooltip as ReactTooltip } from "react-tooltip";

// Utilidad para screen-reader only
const srOnly = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  border: 0,
};

export default function TabularPreview({ resourceId }) {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [filters, setFilters] = useState({});
  const [chartColumn, setChartColumn] = useState("");
  const [chartType, setChartType] = useState("histogram");
  const [bins, setBins] = useState(10);

  const cleanFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v && v.trim() !== "")
      ),
    [filters]
  );

  const { columns, rows, totalRows, totalPages, loading, error } = useTabularResource(
    resourceId,
    page,
    pageSize,
    cleanFilters
  );

  const { kpis, loading: loadingKPI, error: errorKPI } = useTabularKPIs(resourceId);

  const { data: chartData, loading: loadingChart, error: errorChart } = useTabularChart(
    resourceId,
    chartColumn,
    chartType,
    bins
  );

  useEffect(() => {
    setPage(1);
  }, [resourceId, cleanFilters]);

  useEffect(() => {
    if (columns.length && !columns.includes(chartColumn)) setChartColumn("");
  }, [columns, chartColumn]);

  async function handleExportAllCSV() {
    try {
      const data = await fetchResourceFilter(resourceId, 1, 10000, cleanFilters);
      if (data && data.rows && data.rows.length) {
        exportToCSV(data.columns, data.rows, "datos-filtrados.csv");
      } else {
        alert("No hay datos para exportar.");
      }
      if (data.total > 10000) {
        alert("Solo se exportaron los primeros 10,000 registros por límite de exportación.");
      }
    } catch (err) {
      alert("Error al exportar datos: " + (err.message || err));
    }
  }

  async function handleExportAllXLSX() {
    try {
      const data = await fetchResourceFilter(resourceId, 1, 10000, cleanFilters);
      if (data && data.rows && data.rows.length) {
        exportToXLSX(data.columns, data.rows, "datos-filtrados.xlsx");
      } else {
        alert("No hay datos para exportar.");
      }
      if (data.total > 10000) {
        alert("Solo se exportaron los primeros 10,000 registros por límite de exportación.");
      }
    } catch (err) {
      alert("Error al exportar datos: " + (err.message || err));
    }
  }

  if (!resourceId) return null;

  return (
    <div>
      <span style={srOnly} aria-live="polite">
        {loading ? "Cargando datos..." : error ? `Error: ${error}` : ""}
      </span>
      {/* KPIs */}
      <div style={{ marginBottom: 16 }}>
        <h4>KPIs automáticos</h4>
        {loadingKPI && <div aria-live="polite">Cargando KPIs...</div>}
        {errorKPI && <div style={{ color: "red" }} aria-live="assertive">{errorKPI}</div>}
        {!loadingKPI && !errorKPI && kpis.length > 0 && (
          <table role="table" aria-label="KPIs automáticos">
            <thead>
              <tr role="row">
                <th role="columnheader">Columna</th>
                <th role="columnheader">Count</th>
                <th role="columnheader">Mean</th>
                <th role="columnheader">Min</th>
                <th role="columnheader">Max</th>
                <th role="columnheader">Sum</th>
                <th role="columnheader">Std</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map(kpi => (
                <tr role="row" key={kpi.column}>
                  <td role="cell">{kpi.column}</td>
                  <td role="cell">{kpi.count}</td>
                  <td role="cell">{kpi.mean ?? "-"}</td>
                  <td role="cell">{kpi.min ?? "-"}</td>
                  <td role="cell">{kpi.max ?? "-"}</td>
                  <td role="cell">{kpi.sum ?? "-"}</td>
                  <td role="cell">{kpi.std ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loadingKPI && !errorKPI && kpis.length === 0 && (
          <div>No hay columnas numéricas para mostrar KPIs.</div>
        )}
      </div>

      {/* Gráficos */}
      <div style={{ margin: "20px 0" }}>
        <h4>Visualización de Gráficos</h4>
        <label>
          Columna:
          <select
            value={chartColumn}
            onChange={e => setChartColumn(e.target.value)}
            aria-label="Selecciona columna para gráfico"
            data-tooltip-id="chart-col-tooltip"
            data-tooltip-content="Selecciona la columna para graficar"
          >
            <option value="">Selecciona columna</option>
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: 12 }}>
          Tipo:
          <select
            value={chartType}
            onChange={e => setChartType(e.target.value)}
            aria-label="Selecciona tipo de gráfico"
            data-tooltip-id="chart-type-tooltip"
            data-tooltip-content="Elige el tipo de gráfico"
          >
            <option value="histogram">Histograma</option>
            <option value="bar">Barras</option>
            <option value="pie">Pastel</option>
            <option value="line">Línea</option>
          </select>
        </label>
        {chartType === "histogram" && (
          <label style={{ marginLeft: 12 }}>
            Bins:
            <input
              type="number"
              min={2}
              max={50}
              value={bins}
              onChange={e => setBins(Number(e.target.value))}
              style={{ width: 50, marginLeft: 4 }}
              aria-label="Número de bins para histograma"
              data-tooltip-id="bins-tooltip"
              data-tooltip-content="Cantidad de intervalos para el histograma"
            />
          </label>
        )}
        <ReactTooltip id="chart-col-tooltip" place="top" effect="solid" />
        <ReactTooltip id="chart-type-tooltip" place="top" effect="solid" />
        <ReactTooltip id="bins-tooltip" place="top" effect="solid" />
        {loadingChart && <div aria-live="polite">Cargando gráfico...</div>}
        {errorChart && <div style={{ color: "red" }} aria-live="assertive">{errorChart}</div>}
        {!loadingChart && !errorChart && chartData && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "pie" ? (
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"][idx % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <BarChart data={chartData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Exportación */}
      <div style={{ margin: "8px 0" }}>
        <button
          onClick={handleExportAllCSV}
          disabled={loading || !rows.length}
          aria-label="Exportar todos los datos filtrados en CSV"
          title="Exportar todos los datos filtrados en CSV"
          data-tooltip-id="export-csv-tooltip"
          data-tooltip-content="Descarga los datos filtrados como archivo CSV"
        >
          Exportar todos los datos filtrados (CSV)
        </button>
        <button
          onClick={handleExportAllXLSX}
          disabled={loading || !rows.length}
          aria-label="Exportar todos los datos filtrados en XLSX"
          title="Exportar todos los datos filtrados en XLSX"
          data-tooltip-id="export-xlsx-tooltip"
          data-tooltip-content="Descarga los datos filtrados como archivo Excel"
          style={{ marginLeft: 8 }}
        >
          Exportar todos los datos filtrados (XLSX)
        </button>
        <ReactTooltip id="export-csv-tooltip" place="top" effect="solid" />
        <ReactTooltip id="export-xlsx-tooltip" place="top" effect="solid" />
      </div>

      {/* Tabla y filtros */}
      <table
        role="table"
        aria-label="Datos tabulares filtrados"
        tabIndex={0}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr role="row">
            {columns.map(col => (
              <th role="columnheader" key={col}>
                {col}
                <div>
                  <input
                    type="text"
                    value={filters[col] || ""}
                    onChange={e => {
                      setFilters(f => ({ ...f, [col]: e.target.value }));
                    }}
                    placeholder="Filtrar"
                    style={{ width: "90%" }}
                    aria-label={`Filtrar por ${col}`}
                    tabIndex={0}
                    title={`Filtrar por ${col}`}
                    data-tooltip-id={`filter-tooltip-${col}`}
                    data-tooltip-content={`Filtra los resultados por la columna ${col}`}
                  />
                  <ReactTooltip id={`filter-tooltip-${col}`} place="top" effect="solid" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr role="row" key={i}>
              {columns.map(col => (
                <td role="cell" key={col} tabIndex={0}>
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          title="Página anterior"
          data-tooltip-id="prev-page-tooltip"
          data-tooltip-content="Ir a la página anterior"
        >
          Anterior
        </button>
        <span style={{ margin: "0 10px" }}>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
          title="Página siguiente"
          data-tooltip-id="next-page-tooltip"
          data-tooltip-content="Ir a la página siguiente"
        >
          Siguiente
        </button>
        <ReactTooltip id="prev-page-tooltip" place="top" effect="solid" />
        <ReactTooltip id="next-page-tooltip" place="top" effect="solid" />
      </div>
      <div>
        Mostrando {rows.length} de {totalRows} filas.
      </div>
    </div>
  );
}