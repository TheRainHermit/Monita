import React, { useEffect, useState } from "react";
import { fetchStats } from "../api";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";

export default function StatsViewer({ resource, column }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resource || !column) return;
    setLoading(true);
    fetchStats(resource.id, column)
      .then((data) => setStats(data.stats))
      .finally(() => setLoading(false));
    toast.success("Estadísticas buscadas exitosamente.");
  }, [resource, column]);

  if (!resource || !column) return null;

  return (
    <motion.div
      className="card w-100"
      style={{
        marginTop: 0,
        background: "var(--color-card)",
        color: "var(--color-text)"
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label={`Estadísticas de la columna ${column}`}
    >
      <h3 className="text-center">
        Estadísticas de{" "}
        <span
          data-tip="Resumen estadístico de la columna seleccionada"
          tabIndex={0}
          aria-label="Ayuda sobre estadísticas"
          style={{ cursor: "help" }}
        >
          {column} ℹ️
        </span>
      </h3>
      {loading && <Loader />}
      {stats && (
        <ul style={{ textAlign: "center" }} aria-live="polite">
          {Object.entries(stats).map(([k, v]) => (
            <li key={k}>
              <span data-tip={`Estadístico: ${k}`} tabIndex={0}>{k}: {v}</span>
            </li>
          ))}
        </ul>
      )}
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}