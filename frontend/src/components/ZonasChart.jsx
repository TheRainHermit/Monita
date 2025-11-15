import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function ZonasChart({ data }) {
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
      aria-label="Gráfico de consumo por zona"
    >
      <h3>
        <span data-tip="Consumo total por zona para el periodo filtrado" tabIndex={0}>
          Consumo por Zona
        </span>
      </h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="zona" />
          <YAxis />
          <RechartsTooltip />
          <Bar dataKey="consumo_m3" fill="var(--color-secondary)" name="Consumo (m³)" />
        </BarChart>
      </ResponsiveContainer>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}