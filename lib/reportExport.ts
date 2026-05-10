import jsPDF from 'jspdf';
import { formatCurrency, formatDate } from './formatters';

export interface ReportData {
  title: string;
  generatedDate: Date;
  metrics: {
    label: string;
    value: string;
  }[];
  sections: {
    title: string;
    data: string[][];
  }[];
}

export function exportReportToPDF(data: ReportData) {
  const doc = new jsPDF();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.text(data.title, 20, yPosition);
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${formatDate(data.generatedDate)}`, 20, yPosition);
  yPosition += 10;

  // Metrics
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Key Metrics', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  data.metrics.forEach((metric) => {
    doc.text(`${metric.label}: ${metric.value}`, 25, yPosition);
    yPosition += 7;
  });

  yPosition += 5;

  // Sections with tables
  data.sections.forEach((section) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.text(section.title, 20, yPosition);
    yPosition += 10;

    // Simple table
    doc.setFontSize(9);
    section.data.slice(0, 10).forEach((row) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(row.join(' | '), 25, yPosition);
      yPosition += 6;
    });

    yPosition += 5;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('ShopPro - Shop Management System', 20, doc.internal.pageSize.height - 10);

  const filename = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${formatDate(data.generatedDate)}.pdf`;
  doc.save(filename);
}

export function exportReportToCSV(data: ReportData): string {
  let csv = `${data.title}\n`;
  csv += `Generated: ${formatDate(data.generatedDate)}\n\n`;

  csv += 'Key Metrics\n';
  data.metrics.forEach((metric) => {
    csv += `${metric.label},${metric.value}\n`;
  });
  csv += '\n';

  data.sections.forEach((section) => {
    csv += `${section.title}\n`;
    section.data.forEach((row) => {
      csv += `${row.join(',')}\n`;
    });
    csv += '\n';
  });

  return csv;
}

export function downloadCSV(csv: string, filename: string) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
