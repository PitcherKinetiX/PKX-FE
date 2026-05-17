import html2pdf from 'html2pdf.js';

export function downloadPdf(elementId: string, filename: string = 'report.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  html2pdf(element, {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });
}
