import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";

export default function NotFoundPage() {
  return (
    <motion.div
      className="main-content flex-center"
      style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "100vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Página no encontrada"
    >
      <div className="card text-center" style={{ background: "var(--color-card)", color: "var(--color-text)", borderRadius: 8, padding: 32 }}>
        <h2 style={{ fontSize: "2.1rem" }}>
          <span data-tip="La página que buscas no existe" tabIndex={0}>
            404 - Página no encontrada
          </span>
        </h2>
        <Link to="/" className="hero-btn mt-2" data-tip="Volver a la página de inicio" aria-label="Volver al inicio">
          Volver al inicio
        </Link>
        <ReactTooltip effect="solid" />
      </div>
    </motion.div>
  );
}