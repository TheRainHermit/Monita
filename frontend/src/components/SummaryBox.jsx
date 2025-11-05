import React from "react";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";

// props: { total, promedio, maximo, minimo }
export default function SummaryBox({ total, promedio, maximo, minimo }) {
  return (
    <motion.div
      className="summary-box"
      style={{
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        padding: 16,
        margin: "1em 0"
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Resumen de KPIs de consumo"
    >
      <div>
        <span data-tip="Consumo total acumulado" tabIndex={0}>Total:</span> {total}
      </div>
      <div>
        <span data-tip="Promedio de consumo" tabIndex={0}>Promedio:</span> {promedio}
      </div>
      <div>
        <span data-tip="Valor máximo registrado" tabIndex={0}>Máximo:</span> {maximo}
      </div>
      <div>
        <span data-tip="Valor mínimo registrado" tabIndex={0}>Mínimo:</span> {minimo}
      </div>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}