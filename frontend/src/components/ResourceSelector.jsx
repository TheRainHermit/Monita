import React from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function ResourceSelector({ dataset, onSelectResource }) {
  if (!dataset) return null;

  return (
    <motion.div
      className="dataset-search-block"
      style={{
        marginBottom: 32,
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        padding: 16
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Selector de recursos del dataset"
    >
      <h3>
        Recursos disponibles
        <span
          data-tip="Selecciona un recurso del dataset para visualizar o analizar"
          tabIndex={0}
          style={{ marginLeft: 8, cursor: "help" }}
          aria-label="Ayuda sobre selección de recursos"
        >
          ℹ️
        </span>
      </h3>
      <ul className="dataset-list" aria-live="polite">
        {dataset.resources?.map((res) => {
          const esPrincipal = res.url === dataset.url;
          return (
            <li
              key={res.id}
              style={
                esPrincipal
                  ? { fontWeight: "bold", background: "#1e293b", borderRadius: 6 }
                  : {}
              }
            >
              <strong>
                {res.name || res.id}
                {esPrincipal && (
                  <span
                    style={{
                      color: "var(--color-primary)",
                      marginLeft: 8,
                      fontSize: "1.1em"
                    }}
                    data-tip="Recurso principal seleccionado automáticamente"
                  >
                    ★
                  </span>
                )}
              </strong>
              <div style={{ fontSize: "0.98em", color: "var(--color-text)", margin: "6px 0" }}>
                Formato: {res.format} {res.description ? `| ${res.description.slice(0, 60)}...` : ""}
              </div>
              <div style={{ fontSize: "0.95em", color: "var(--color-primary)" }}>
                <button
                  onClick={() => {
                    onSelectResource(res);
                    toast.success("Recurso seleccionado.");
                  }}
                  style={{
                    marginTop: 5,
                    padding: "6px 18px",
                    fontSize: "0.97em",
                    borderRadius: 6,
                    border: "none",
                    background: "var(--color-primary)",
                    color: "var(--color-text)",
                    cursor: "pointer"
                  }}
                  aria-label={`Seleccionar recurso ${res.name || res.id}`}
                  data-tip={`Seleccionar el recurso "${res.name || res.id}"`}
                >
                  Seleccionar
                </button>
              </div>
            </li>
          );
        })}
        {(!dataset.resources || dataset.resources.length === 0) && (
          <li style={{ color: "var(--color-text)", fontStyle: "italic" }}>
            No hay recursos disponibles.
          </li>
        )}
      </ul>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}