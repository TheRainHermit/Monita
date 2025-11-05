import React, { useState } from "react";
import { fetchDatasetSearch } from "../api";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";

export default function DatasetSearch({ onSelectDataset }) {
  const [query, setQuery] = useState("");
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await fetchDatasetSearch(query);
      setDatasets(data.datasets || []);
      toast.success("Datasets buscados exitosamente.");
    } catch (err) {
      setError("Error al buscar datasets.");
      toast.error("Error al buscar datasets.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="dataset-search-block"
      style={{
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        padding: 16,
        marginBottom: 32
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Buscador de datasets públicos"
    >
      <h3>
        Buscar Datasets
        <span
          data-tip="Busca datasets públicos por palabra clave, por ejemplo: agua, energía, consumo"
          tabIndex={0}
          style={{ marginLeft: 8, cursor: "help" }}
          aria-label="Ayuda sobre búsqueda de datasets"
        >
          ℹ️
        </span>
      </h3>
      <form onSubmit={handleSearch} className="dataset-search-form" aria-label="Formulario de búsqueda de datasets">
        <label htmlFor="dataset-query" style={{ display: "none" }}>Palabra clave</label>
        <input
          id="dataset-query"
          type="text"
          placeholder="Palabra clave (ej: agua, energía, consumo)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Palabra clave para buscar datasets"
        />
        <button type="submit" data-tip="Buscar datasets con la palabra clave" aria-label="Buscar datasets">
          Buscar
        </button>
      </form>
      {loading && <Loader />}
      {error && <div style={{ color: "red" }} aria-live="polite">{error}</div>}
      <ul className="dataset-list" aria-live="polite">
        {datasets.map((ds) => (
          <li key={ds.id}>
            <strong>{ds.title}</strong>
            <div style={{ fontSize: "0.98em", color: "var(--color-text)", margin: "6px 0" }}>
              {ds.notes?.slice(0, 120)}...
            </div>
            <div style={{ fontSize: "0.95em", color: "var(--color-primary)" }}>
              Recursos: {ds.resources?.length || 0}
              <button
                onClick={() => onSelectDataset(ds)}
                style={{
                  marginLeft: 12,
                  padding: "6px 18px",
                  fontSize: "0.97em",
                  borderRadius: 6,
                  border: "none",
                  background: "var(--color-primary)",
                  color: "var(--color-text)",
                  cursor: "pointer"
                }}
                aria-label={`Seleccionar dataset ${ds.title}`}
                data-tip={`Seleccionar el dataset "${ds.title}" para analizar`}
              >
                Seleccionar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}