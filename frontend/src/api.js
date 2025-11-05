const BASE_URL = "http://localhost:8000";

export async function fetchColumns(resourceId) {
  const res = await fetch(`${BASE_URL}/resources/${resourceId}/columns`);
  return res.json();
}

export async function fetchStats(resourceId, column) {
  const res = await fetch(`${BASE_URL}/resources/${resourceId}/stats?column=${column}`);
  return res.json();
}

export async function fetchFilteredRows(resourceId, column, value, page = 1, pageSize = 10) {
  const res = await fetch(
    `${BASE_URL}resources/${resourceId}/filter?columna=${encodeURIComponent(column)}&valor=${encodeURIComponent(value)}&page=${page}&page_size=${pageSize}`
  );
  return res.json();
}

export async function fetchDatasetSearch(query) {
  const res = await fetch(`${BASE_URL}/datasets/search?query=${query}`);
  return res.json();
}

export async function fetchResourceDownload(resourceId) {
  const res = await fetch(`${BASE_URL}/resources/${resourceId}/download`);
  return res.json();
}

