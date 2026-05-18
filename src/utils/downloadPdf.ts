import html2pdf from 'html2pdf.js';

function resolveColor(color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 0 ? 'transparent' : `rgb(${r}, ${g}, ${b})`;
}

function sanitizeModernColors(css: string): string {
  return css
    .replace(/@supports\s*\([^{}]*color-mix[^{}]*\)\s*\{(?:[^{}]|\{[^{}]*\})*\}/g, '')
    .replace(/\s+in\s+oklab/g, '')
    .replace(/(?:oklch|oklab)\([^)]+\)/g, match => resolveColor(match));
}

async function fixModernColors(doc: Document): Promise<void> {
  doc.querySelectorAll('style').forEach(styleEl => {
    if (styleEl.textContent) styleEl.textContent = sanitizeModernColors(styleEl.textContent);
  });

  const linkEls = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
  await Promise.all(linkEls.map(async link => {
    try {
      const res = await fetch(link.href);
      const css = sanitizeModernColors(await res.text());
      const style = doc.createElement('style');
      style.textContent = css;
      link.parentNode?.insertBefore(style, link);
      link.remove();
    } catch {
    }
  }));
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
      onclone: (clonedDoc: Document) => fixModernColors(clonedDoc),
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  });
}
