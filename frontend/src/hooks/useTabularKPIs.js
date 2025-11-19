import { useState, useEffect } from "react";
import { fetchResourceKPIs } from "../api";

export function useTabularKPIs(resourceId) {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resourceId) return;
    setLoading(true);
    setError("");
    fetchResourceKPIs(resourceId)
      .then(data => setKpis(data.kpis || []))
      .catch(err => setError(err.message || "Error al cargar KPIs"))
      .finally(() => setLoading(false));
  }, [resourceId]);

  return { kpis, loading, error };
}