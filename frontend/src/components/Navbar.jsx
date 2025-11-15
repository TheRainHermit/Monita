import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/react.svg";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function Navbar() {
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "");
  }, [dark]);

  return (
    <motion.nav
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 2rem 1rem 2rem",
        background: "var(--color-primary)",
        color: "var(--color-text)",
        borderRadius: "0 0 10px 10px",
        marginBottom: 24
      }}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="Barra de navegación principal"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.1rem 0.5rem",
          maxWidth: 1500
        }}
      >
        <img
          src={logo}
          alt="Logo Monita"
          style={{
            height: 34,
            marginRight: 16,
            filter: dark ? "brightness(0.9) invert(1)" : "none",
            transition: "filter 0.2s"
          }}
          data-tip="Ir a la página de inicio"
          tabIndex={0}
        />
        <Link
          to="/"
          style={{
            color: "var(--color-text)",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.2rem",
            letterSpacing: "1px",
            marginRight: 24
          }}
          aria-label="Inicio"
          data-tip="Ir a la página de inicio"
        >
          Monita
        </Link>
        <Link
          to="/monitor"
          style={{
            color: "var(--color-text)",
            textDecoration: location.pathname === "/monitor" ? "underline" : "none",
            marginRight: 16,
            fontWeight: location.pathname === "/monitor" ? "bold" : "normal"
          }}
          aria-label="Monitor"
          data-tip="Ir al monitor de consumo"
        >
          Monitor
        </Link>
      </div>
      <button
        onClick={() => setDark((d) => !d)}
        style={{
          background: "none",
          color: "var(--color-text)",
          border: "1px solid var(--color-text)",
          borderRadius: 20,
          padding: "4px 18px",
          fontSize: "1rem",
          cursor: "pointer"
        }}
        aria-label="Cambiar modo claro/oscuro"
        data-tip={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {dark ? "☀️ Claro" : "🌙 Oscuro"}
      </button>
      <ReactTooltip effect="solid" />
    </motion.nav>
  );
}