import React, { useState } from "react";
import { fetchFilteredRows } from "../api";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function FilterTable({ resource, column }) {
  const [filterValue, setFilterValue] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const fetchPage = async (pageToFetch = 1) => {
    if (!resource || !column || !filterValue) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchFilteredRows(resource.id, column, filterValue, pageToFetch, pageSize);
      setRows(data.rows || []);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      toast.success("Filas filtradas exitosamente.");
    } catch (err) {
      setError("Error al filtrar filas.");
      toast.error("Error al filtrar filas.");
    }
    setLoading(false);
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    fetchPage(1);
  };

  const handleExport = () => {
    if (rows.length === 0) return;
    const csv =
      Object.keys(rows[0]).join(",") +
      "\n" +
      rows.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultados_filtrados.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV exportado exitosamente.");
  };

  if (!resource || !column) return null;

  return (
    <motion.div
      style={{
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        padding: 16,
        marginTop: 0
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Tabla filtrada por columna"
    >
      <h3>
        Filtrar y ver datos
        <span
          data-tip="Filtra los datos de la columna seleccionada e inspecciona los resultados"
          tabIndex={0}
          style={{ marginLeft: 8, cursor: "help" }}
          aria-label="Ayuda sobre filtrado de datos"
        >
          ℹ️
        </span>
      </h3>
      <form onSubmit={handleFilter} style={{ marginBottom: 12 }} aria-label="Formulario de filtrado de datos">
        <label htmlFor="filter-value" style={{ display: "none" }}>Valor para filtrar</label>
        <input
          id="filter-value"
          type="text"
          placeholder={`Valor para filtrar en "${column}"`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          aria-label={`Valor para filtrar en ${column}`}
        />
        <button
          type="submit"
          data-tip="Filtrar filas por valor"
          aria-label="Filtrar filas"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={handleExport}
          disabled={rows.length === 0}
          style={{ marginLeft: 8 }}
          data-tip="Exportar resultados filtrados a CSV"
          aria-label="Exportar CSV"
        >
          Exportar CSV
        </button>
      </form>
      {loading && <Loader />}
      {error && <div className="text-center" style={{ color: "red" }} aria-live="polite">{error}</div>}
      {rows.length > 0 && (
        <div>
          <table className="w-100" border={1} cellPadding={4} style={{
            marginTop: 12,
            background: "var(--color-card)",
            color: "var(--color-text)"
          }}
            aria-label="Resultados filtrados"
          >
            <thead>
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th key={k}>
                    <span data-tip={`Columna: ${k}`} tabIndex={0}>{k}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Controles de paginación */}
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => fetchPage(page - 1)}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <span style={{ margin: "0 10px" }}>
              Página {page} de {totalPages} ({total} resultados)
            </span>
            <button
              onClick={() => fetchPage(page + 1)}
              disabled={page === totalPages}
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
      {rows.length === 0 && !loading && (
        <div aria-live="polite">No hay resultados.</div>
      )}
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}