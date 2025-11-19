export function exportToCSV(columns, rows, filename = "datos.csv") {
  const csv =
    columns.join(",") +
    "\n" +
    rows.map(row =>
      columns.map(col => `"${(row[col] ?? "").toString().replace(/"/g, '""')}"`).join(",")
    ).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}