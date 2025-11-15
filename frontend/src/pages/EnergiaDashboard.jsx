import React, { useState } from "react";
import {
  useEnergiaSummary,
  useEnergiaTimeSeries,
  useEnergiaZonas,
  useEnergiaAnomalies,
  useEnergiaComparativa,
  useEnergiaZonasDistinct,
  useEnergiaTiposUsuarioDistinct
} from "../hooks/useEnergiaApi";
import SummaryBox from "../components/SummaryBox";
import TimeSeriesChart from "../components/TimeSeriesChart";
import ZonasChart from "../components/ZonasChart";
import AnomaliesTable from "../components/AnomaliesTable";
import ComparativeChart from "../components/ComparativeChart";
import FiltersPanel from "../components/FiltersPanel";
import { motion } from "framer-motion";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function EnergiaDashboard() {
  const zonasDisponibles = useEnergiaZonasDistinct();
  const tiposUsuarioDisponibles = useEnergiaTiposUsuarioDistinct();

  const [zonasSeleccionadas, setZonasSeleccionadas] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [zona1, setZona1] = useState("");
  const [zona2, setZona2] = useState("");

  const filtros = {
    zonas: zonasSeleccionadas,
    tipo_usuario: tipoUsuario,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin
  };

  const { data: summary, loading: loadingSummary } = useEnergiaSummary(filtros);
  const { data: series, loading: loadingSeries } = useEnergiaTimeSeries(filtros);
  const { data: zonas, loading: loadingZonas } = useEnergiaZonas(filtros);
  const { data: anomalies, loading: loadingAnomalies } = useEnergiaAnomalies(filtros);
  const { data: comparativa, loading: loadingComparativa } = useEnergiaComparativa({
    zona1,
    zona2,
    tipo_usuario: tipoUsuario,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin
  });

  const loading =
    loadingSummary ||
    loadingSeries ||
    loadingZonas ||
    loadingAnomalies ||
    loadingComparativa;

  return (
    <motion.div
      className="main-content"
      style={{ background: "var(--color-bg)", color: "var(--color-text)", minHeight: "100vh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      aria-label="Dashboard de monitoreo de energía"
    >
      <h1>
        <span data-tip="Panel principal para el monitoreo y análisis de consumo de energía" tabIndex={0}>
          Monitoreo de Energía
        </span>
      </h1>
      <FiltersPanel
        zonasDisponibles={zonasDisponibles}
        zonasSeleccionadas={zonasSeleccionadas}
        setZonasSeleccionadas={setZonasSeleccionadas}
        tiposUsuarioDisponibles={tiposUsuarioDisponibles}
        tipoUsuario={tipoUsuario}
        setTipoUsuario={setTipoUsuario}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
      />
      <div className="dashboard-row" style={{ gap: 16, marginBottom: 24, alignItems: "center" }}>
        <label>
          <span data-tip="Zona a comparar (eje azul)" tabIndex={0}>Zona 1:</span>
          <select value={zona1} onChange={e => setZona1(e.target.value)} aria-label="Comparar zona 1">
            <option value="">Seleccione</option>
            {zonasDisponibles.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </label>
        <label>
          <span data-tip="Zona a comparar (eje verde)" tabIndex={0}>Zona 2:</span>
          <select value={zona2} onChange={e => setZona2(e.target.value)} aria-label="Comparar zona 2">
            <option value="">Seleccione</option>
            {zonasDisponibles.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </label>
      </div>
      <div aria-live="polite">
        {loading && <div style={{ margin: "1rem 0" }}>🔄 Cargando datos...</div>}
        {!loading && (!series?.series?.length && !summary?.summary)
          ? <div style={{ color: "var(--color-text)", margin: "1rem 0" }}>No hay datos para los filtros seleccionados.</div>
          : (
            <>
              <SummaryBox {...summary?.summary} />
              <TimeSeriesChart data={series?.series} />
              <ZonasChart data={zonas?.zonas} />
              <ComparativeChart data={comparativa?.comparativa} />
              <AnomaliesTable anomalies={anomalies?.anomalies} />
            </>
          )
        }
      </div>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}