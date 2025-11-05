import React from "react";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";
import landingImg from "../assets/landing.svg";

export default function HomePage() {
  return (
    <motion.div
      className="main-content"
      style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "100vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Página de inicio Monita"
    >
      <div className="landing-row">
        <img
          src={landingImg}
          alt="Ilustración de monitoreo de consumo"
          style={{ maxWidth: "340px", margin: "2rem auto", display: "block" }}
          data-tip="Visualización y monitoreo de datos de consumo"
          tabIndex={0}
        />
        <h1>
          <span data-tip="Bienvenido a Monita: monitoreo intensivo de agua y energía" tabIndex={0}>
            Bienvenido a Monita
          </span>
        </h1>
        <p style={{ fontSize: "1.3rem", margin: "1.5rem 0" }}>
          Plataforma de monitoreo intensivo y análisis de consumo de agua y energía.
        </p>
        <ul>
          <li>
            <span data-tip="Consulta dashboards interactivos" tabIndex={0}>
              Dashboards interactivos para agua y energía
            </span>
          </li>
          <li>
            <span data-tip="Filtros avanzados y comparativas" tabIndex={0}>
              Filtros avanzados, comparativas y análisis de anomalías
            </span>
          </li>
          <li>
            <span data-tip="Visualización responsiva y modo oscuro" tabIndex={0}>
              Visualización responsiva y modo oscuro
            </span>
          </li>
        </ul>
        <ReactTooltip effect="solid" />
      </div>
    </motion.div>
  );
}