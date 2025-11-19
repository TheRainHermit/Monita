import React from "react";
import { fetchColumns } from "../api";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Loader from "./Loader";

export default function ColumnSelector({ resource, onSelectColumn }) {
  const [columns, setColumns] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!resource) return;
    setLoading(true);
    fetchColumns(resource.id)
      .then((data) => setColumns(data.columns || []))
      .finally(() => setLoading(false));
  }, [resource]);

  if (!resource) return null;

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
      aria-label="Selector de columnas del dataset"
    >
      <h3>
        Selecciona una columna
        <span
          data-tip="Elige la columna sobre la que quieres realizar análisis o filtrado"
          tabIndex={0}
          style={{ marginLeft: 8, cursor: "help" }}
          aria-label="Ayuda sobre la selección de columnas"
        >
          ℹ️
        </span>
      </h3>
      {loading && <Loader />}
      <ul className="dataset-list" aria-live="polite">
        {columns.map((col) => (
          <li key={col}>
            <span>{col}</span>
            <button
              onClick={() => onSelectColumn(col)}
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
              aria-label={`Seleccionar columna ${col}`}
              data-tip={`Seleccionar columna "${col}" para análisis`}
            >
              Seleccionar
            </button>
          </li>
        ))}
      </ul>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}