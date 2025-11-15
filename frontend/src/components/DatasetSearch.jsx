import React, { useState } from "react";
import { useAguaDatasets } from "../hooks/useAguaApi";
import { useEnergiaDatasets } from "../hooks/useEnergiaApi";
import Loader from "./Loader";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function DatasetSearch({ onSelectDataset }) {
  const [fuente, setFuente] = useState("agua");
  const { data: aguaData, loading: loadingAgua, error: errorAgua } = useAguaDatasets("");
  const { data: energiaData, loading: loadingEnergia, error: errorEnergia } = useEnergiaDatasets("");
  const datasets = fuente === "agua" ? aguaData?.datasets || [] : energiaData?.datasets || [];
  const loading = fuente === "agua" ? loadingAgua : loadingEnergia;
  const error = fuente === "agua" ? errorAgua : errorEnergia;

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
      aria-label="Selector de datasets por fuente"
    >
      <h3>
        Selecciona la fuente de datos
        <span
          data-tip="Elige si quieres ver datasets de agua o energía"
          tabIndex={0}
          style={{ marginLeft: 8, cursor: "help" }}
          aria-label="Ayuda sobre selección de fuente"
        >
          ℹ️
        </span>
      </h3>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="fuente" style={{ marginRight: 8 }}>Fuente:</label>
        <select
          id="fuente"
          value={fuente}
          onChange={e => setFuente(e.target.value)}
          aria-label="Seleccionar fuente de datasets"
        >
          <option value="agua">Agua</option>
          <option value="energia">Energía</option>
        </select>
      </div>
      {loading && <Loader />}
      {error && (
        <div style={{ color: "red" }} aria-live="polite">
          {typeof error === "string" ? error : error?.message || "Error desconocido"}
        </div>
      )}
      <ul className="dataset-list" aria-live="polite">
        {datasets.map((ds) => (
          <li key={ds.id}>
            <strong>{ds.nombre}</strong>
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
                aria-label={`Seleccionar dataset ${ds.nombre}`}
                data-tip={`Seleccionar el dataset "${ds.nombre}" para analizar`}
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