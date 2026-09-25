// frontend/src/utils/exportPdf.ts

/**
 * Generate a printable PDF from an array of objects using jspdf and autoTable.
 * @param data Array of records (objects) to export
 * @param title Title shown at the top of the PDF
 * @param filename Desired filename without extension
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportPdf(data: any[], title: string, filename: string) {
  if (!data.length) {
    alert('No data to export');
    return;
  }
  const doc = new jsPDF();
  const margin = 10;
  doc.setFontSize(16);
  doc.text(title, margin, 20);
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => String(row[h] ?? '')));
  (autoTable as any)(doc, {
    startY: 30,
    head: [headers],
    body: rows,
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
  });
  doc.save(`${filename}.pdf`);
}
