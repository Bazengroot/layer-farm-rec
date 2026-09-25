// frontend/src/utils/exportCsv.ts

/**
 * Convert an array of objects to CSV and trigger a download.
 * @param data Array of records (objects) to export
 * @param filename Desired filename without extension
 */
export function exportCsv(data: any[], filename: string) {
  if (!data.length) {
    alert('No data to export');
    return;
  }
  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));
  for (const row of data) {
    const values = headers.map((h) => {
      const val = row[h];
      // Escape quotes and commas
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
