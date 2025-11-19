import { useState, useEffect } from "react";
import { fetchResourceFilter } from "../api";

export function useTabularResource(resourceId, page = 1, pageSize = 20, filters = null, sortBy = null, sortOrder = "asc") {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resourceId) return;
    setLoading(true);
    setError("");
    fetchResourceFilter(resourceId, page, pageSize, filters, sortBy, sortOrder)
      .then(data => {
        setColumns(data.columns || []);
        setRows(data.rows || []);
        setTotalRows(data.total || 0);
        setTotalPages(data.total_pages || 1);
      })
      .catch(err => setError(err.message || "Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [resourceId, page, pageSize, filters, sortBy, sortOrder]);

  return { columns, rows, totalRows, totalPages, loading, error };
}