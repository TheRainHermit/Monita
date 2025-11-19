# Monita Frontend

Interfaz para exploración, filtrado, análisis y exportación de recursos tabulares conectada al backend Monita.

## Características principales

- **Tabla paginada** para visualizar datos tabulares de recursos seleccionados.
- **Filtros interactivos por columna** y búsqueda rápida.
- **KPIs automáticos**: métricas clave de columnas numéricas.
- **Visualización de gráficos**: histograma, barras, pastel, línea.
- **Exportación de datos filtrados**: descarga en CSV y XLSX.
- **Accesibilidad avanzada**: navegación por teclado, roles ARIA, tooltips y ayuda contextual.
- **Feedback visual**: indicadores de carga y mensajes de error claros.

## Flujos principales

1. Selecciona un recurso tabular.
2. Filtra datos usando los inputs por columna.
3. Navega entre páginas con los botones "Anterior/Siguiente".
4. Consulta KPIs y gráficos automáticos.
5. Exporta los datos filtrados (CSV/XLSX) con los botones correspondientes.

## Instalación y dependencias

```bash
npm install
npm install recharts react-tooltip xlsx