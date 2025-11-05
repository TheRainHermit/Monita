import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";

export default function ThemeToggle() {
  useEffect(() => {
    const userPref = localStorage.getItem("theme");
    const systemPref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", userPref || systemPref);
  }, []);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";

  return (
    <motion.button
      onClick={toggleTheme}
      style={{
        margin: 8,
        borderRadius: 20,
        border: "1px solid var(--color-primary)",
        background: "var(--color-card)",
        color: "var(--color-text)",
        padding: "0.5em 1.2em",
        fontSize: "1em",
        cursor: "pointer"
      }}
      whileTap={{ scale: 0.93 }}
      data-tip={currentTheme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label="Cambiar entre modo claro y oscuro"
    >
      {currentTheme === "dark" ? "☀️ Claro" : "🌙 Oscuro"}
      <ReactTooltip effect="solid" />
    </motion.button>
  );
}