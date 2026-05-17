import html2pdf from 'html2pdf.js';

// Canvas API로 oklch 등 모든 CSS 색상을 rgb로 변환
function resolveColor(color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 0 ? 'transparent' : `rgb(${r}, ${g}, ${b})`;
}

// 클론된 문서의 <style> 태그 텍스트에서 oklch()를 rgb()로 치환
function replaceOklchInStylesheets(doc: Document): void {
  doc.querySelectorAll('style').forEach(styleEl => {
    if (!styleEl.textContent) return;
    styleEl.textContent = styleEl.textContent.replace(
      /oklch\([^)]+\)/g,
      match => resolveColor(match)
    );
  });
}

export function downloadPdf(elementId: string, filename: string = 'report.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;

  html2pdf(element, {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      onclone: (clonedDoc: Document) => {
        replaceOklchInStylesheets(clonedDoc);
      },
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });
}
