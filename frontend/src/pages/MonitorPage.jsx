import React, { useState } from "react";
import DatasetSearch from "../components/DatasetSearch";
import ResourceSelector from "../components/ResourceSelector";
import ColumnSelector from "../components/ColumnSelector";
import StatsViewer from "../components/StatsViewer";
import FilterTable from "../components/FilterTable";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function MonitorPage() {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  return (
    <motion.div
      className="main-content"
      style={{
        alignItems: "stretch",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        minHeight: "100vh"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-label="Página de monitor de consumo"
    >
      <h1
        className="text-primary mb-2"
        style={{ textAlign: "center", fontSize: "2.4rem" }}
      >
        <span data-tip="Busca y explora datasets de consumo de agua y energía" tabIndex={0}>
          Monitor de Consumo
        </span>
      </h1>
      <p
        className="subtitle text-center"
        style={{ maxWidth: 900, margin: "0 auto 2rem", fontSize: "1.2rem" }}
      >
        Busca conjuntos de datos públicos de consumo de agua y energía. Escribe una palabra clave y selecciona el dataset que más te interese.
      </p>
      <div className="monitor-layout" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="monitor-sidebar">
          <DatasetSearch onSelectDataset={setSelectedDataset} />
          <ResourceSelector dataset={selectedDataset} onSelectResource={setSelectedResource} />
        </div>
        <div className="monitor-main">
          <ColumnSelector resource={selectedResource} onSelectColumn={setSelectedColumn} />
          <StatsViewer resource={selectedResource} column={selectedColumn} />
          <FilterTable resource={selectedResource} column={selectedColumn} />
        </div>
      </div>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}