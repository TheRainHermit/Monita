import React from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import ReactTooltip from "react-tooltip";

const customSelectTheme = (base) => ({
  ...base,
  colors: {
    ...base.colors,
    primary: "var(--color-primary)",
    primary25: "rgba(46, 122, 120, 0.18)",
    neutral0: "var(--color-card)",
    neutral80: "var(--color-text)",
    neutral90: "var(--color-text)",
    neutral20: "var(--color-primary)",
    neutral30: "var(--color-primary)",
    neutral10: "var(--color-bg)",
    neutral5: "var(--color-bg)",
  }
});

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    background: "var(--color-card)",
    color: "var(--color-text)",
    borderColor: "var(--color-primary)"
  }),
  menu: (provided) => ({
    ...provided,
    background: "var(--color-card)",
    color: "var(--color-text)"
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isFocused
      ? "var(--color-primary)"
      : "var(--color-card)",
    color: "var(--color-text)",
  }),
  multiValue: (provided) => ({
    ...provided,
    background: "var(--color-primary)",
    color: "var(--color-text)"
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--color-text)"
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--color-text)"
  })
};

export default function FiltersPanel({
  zonasDisponibles = [],
  zonasSeleccionadas = [],
  setZonasSeleccionadas,
  tiposUsuarioDisponibles = [],
  tipoUsuario,
  setTipoUsuario,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin
}) {
  const zonaOptions = zonasDisponibles.map(z => ({ value: z, label: z }));
  const tipoUsuarioOptions = tiposUsuarioDisponibles.map(t => ({ value: t, label: t }));

  return (
    <motion.div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 24,
        alignItems: "center",
        background: "var(--color-card)",
        color: "var(--color-text)",
        borderRadius: 8,
        padding: 16
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Panel de filtros avanzados"
    >
      <label style={{ minWidth: 200 }}>
        <span data-tip="Selecciona una o varias zonas para filtrar" tabIndex={0}>
          Zonas:
        </span>
        <Select
          isMulti
          options={zonaOptions}
          value={zonaOptions.filter(opt => zonasSeleccionadas.includes(opt.value))}
          onChange={opts => setZonasSeleccionadas(opts.map(o => o.value))}
          placeholder="Selecciona zonas..."
          theme={customSelectTheme}
          styles={customSelectStyles}
          aria-label="Filtro de zonas"
        />
      </label>
      <label style={{ minWidth: 200 }}>
        <span data-tip="Filtra por tipo de usuario (ej: residencial, comercial)" tabIndex={0}>
          Tipo usuario:
        </span>
        <Select
          options={[{ value: "", label: "Todos" }, ...tipoUsuarioOptions]}
          value={tipoUsuarioOptions.find(opt => opt.value === tipoUsuario) || { value: "", label: "Todos" }}
          onChange={opt => setTipoUsuario(opt.value)}
          isClearable
          placeholder="Tipo usuario"
          theme={customSelectTheme}
          styles={customSelectStyles}
          aria-label="Filtro de tipo de usuario"
        />
      </label>
      <label>
        <span data-tip="Selecciona la fecha de inicio" tabIndex={0}>
          Desde:
        </span>
        <input
          type="date"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
          aria-label="Fecha de inicio"
        />
      </label>
      <label>
        <span data-tip="Selecciona la fecha de fin" tabIndex={0}>
          Hasta:
        </span>
        <input
          type="date"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
          aria-label="Fecha de fin"
        />
      </label>
      <ReactTooltip effect="solid" />
    </motion.div>
  );
}