import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import HomePage from "./pages/HomePage";
import MonitorPage from "./pages/MonitorPage";
import AguaDashboard from "./pages/AguaDashboard";
import EnergiaDashboard from "./pages/EnergiaDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import { motion } from "framer-motion";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Aplicación Monita"
    >
      <Navbar />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path="/agua" element={<AguaDashboard />} />
        <Route path="/energia" element={<EnergiaDashboard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </motion.div>
  );
}

export default App;