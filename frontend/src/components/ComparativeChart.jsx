import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function ComparativeChart({ data }) {
  if (!data || data.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "var(--color-card)",
          color: "var(--color-text)",
          padding: 16,
          borderRadius: 8,
          textAlign: "center"
        }}
        aria-live="polite"
      >
        No hay datos para mostrar
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: "100%",
        height: 300,
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        padding: 16
      }}
      aria-label="Gráfico comparativo entre zonas"
    >
      <h3>
        <span data-tip="Comparativa de consumo entre dos zonas seleccionadas" tabIndex={0}>
          Comparativa entre Zonas
        </span>
      </h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="zona1" stroke="var(--color-primary)" name="Zona 1" />
          <Line type="monotone" dataKey="zona2" stroke="var(--color-secondary)" name="Zona 2" />
        </LineChart>
      </ResponsiveContainer>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}