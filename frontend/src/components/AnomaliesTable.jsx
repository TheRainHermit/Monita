import React from "react";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";

export default function AnomaliesTable({ anomalies }) {
  return (
    <motion.table
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        width: "100%",
        margin: "1em 0"
      }}
      aria-label="Tabla de anomalías detectadas"
    >
      <thead>
        <tr>
          <th>
            <span data-tip="Fecha de la anomalía" tabIndex={0}>
              Fecha
            </span>
          </th>
          <th>
            <span data-tip="Valor detectado como anómalo" tabIndex={0}>
              Valor
            </span>
          </th>
          <th>
            <span data-tip="Tipo de anomalía (ej: outlier)" tabIndex={0}>
              Tipo
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {anomalies && anomalies.length > 0 ? (
          anomalies.map((a, i) => (
            <tr key={i}>
              <td>{a.fecha}</td>
              <td>{a.valor}</td>
              <td>{a.tipo}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} style={{ textAlign: "center" }}>
              No hay anomalías detectadas.
            </td>
          </tr>
        )}
      </tbody>
      <ReactTooltip effect="solid" />
    </motion.table>
  );
}