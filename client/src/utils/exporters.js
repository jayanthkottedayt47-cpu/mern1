// client/src/utils/exporters.js
import { saveAs } from "file-saver";

export function exportCSV(filename = "export.csv", rows = []) {
  if (!rows || !rows.length) {
    alert("No rows to export");
    return;
  }
  const keys = Object.keys(rows[0]);
  const csvRows = [
    keys.join(","),
    ...rows.map(r => keys.map(k => {
      const v = r[k] == null ? "" : String(r[k]).replace(/"/g, '""');
      return `"${v}"`;
    }).join(","))
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
