import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function TimeSeriesChart({ data }) {
  if (!data || data.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: "var(--color-card)", color: "var(--color-text)", padding: 16, borderRadius: 8, textAlign: "center" }}
        aria-live="polite"
      >
        No hay datos para mostrar
      </motion.div>
    );

  return (
    <motion.div
      style={{ width: "100%", height: 300, background: "var(--color-card)", color: "var(--color-text)", borderRadius: 8, padding: 16 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Gráfico de serie temporal de consumo"
    >
      <h3>
        <span data-tip="Evolución temporal del consumo agregado" tabIndex={0}>
          Serie Temporal de Consumo
        </span>
      </h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <RechartsTooltip />
          <Line type="monotone" dataKey="consumo_m3" stroke="var(--color-primary)" name="Consumo (m³)" />
        </LineChart>
      </ResponsiveContainer>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}