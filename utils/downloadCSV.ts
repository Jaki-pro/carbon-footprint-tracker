export function downloadCSV(filename: string, data: any[]) {
  if (!data || data.length === 0) {
    console.warn("No data available to download.");
    return;
  }

  // Extract CSV headers from object keys
  const headers = Object.keys(data[0]).join(",");

  // Convert each row to CSV
  const rows = data
    .map((row) =>
      Object.values(row)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`) // escape quotes
        .join(",")
    )
    .join("\n");

  const csvContent = `${headers}\n${rows}`;

  // Create Blob
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
}
