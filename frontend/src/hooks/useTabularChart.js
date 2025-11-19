// src/hooks/useTabularChart.js
import { useState, useEffect } from "react";
import { fetchResourceChart } from "../api";

export function useTabularChart(resourceId, column, chartType = "histogram", bins = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!resourceId || !column) return;
    setLoading(true);
    setError("");
    fetchResourceChart(resourceId, column, chartType, bins)
      .then(res => setData(res.data || []))
      .catch(err => setError(err.message || "Error al cargar gráfico"))
      .finally(() => setLoading(false));
  }, [resourceId, column, chartType, bins]);
  return { data, loading, error };
}