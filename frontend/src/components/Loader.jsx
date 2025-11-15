import React from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function Loader() {
  return (
    <motion.div
      style={{
        textAlign: "center",
        margin: "16px 0",
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        padding: 8
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      aria-live="polite"
      aria-label="Cargando datos"
    >
      <span data-tip="Cargando datos..." tabIndex={0}>
        <ClipLoader color="var(--color-primary)" size={40} />
      </span>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}