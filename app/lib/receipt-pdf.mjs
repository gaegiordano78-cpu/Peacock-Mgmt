import { jsPDF } from 'jspdf';

// Create a real file locally. Never invoke the Android PWA print window.
export function createReceiptPDF(html) {
  const source = new DOMParser().parseFromString(html, 'text/html');
  const doc = new jsPDF({ format: 'a4', unit: 'mm', compress: true });
  doc.setProperties({ title: source.title || "Ritenuta d'acconto", author: 'Peacock Mgmt' });
  const left = 22.5, width = 165;
  let y = 20;
  const text = node => (node.textContent || '').replace(/\s+/g, ' ').trim();
  const font = (size = 9, style = 'normal') => { doc.setFont('helvetica', style); doc.setFontSize(size); };
  const room = height => { if (y + height > 278) { doc.addPage(); y = 20; } };
  const paragraph = (value, size = 9, bold = false, after = 2) => {
    font(size, bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(value, width);
    for (const line of lines) { room(4.2); doc.text(line, left, y + 3.2); y += 4.2; }
    y += after;
  };
  const table = element => {
    for (const row of element.rows) {
      const cells = [...row.cells];
      let values = cells.map(text);
      let fractions = element.classList.contains('compensi') ? [0.75, 0.25] : [0.292, 0.708];
      const nested = cells[1]?.querySelector('table');
      if (nested) {
        values = [text(cells[0]), ...[...nested.rows[0].cells].map(text)];
        fractions = [0.292, 0.425, 0.085, 0.198];
      }
      const wrapped = values.map((value, i) => {
        font(9, i === 0 || (nested && i === 2) ? 'bold' : 'normal');
        return doc.splitTextToSize(value, width * fractions[i] - 4.5);
      });
      const height = Math.max(7.4, ...wrapped.map(lines => lines.length * 4 + 3));
      room(height);
      let x = left;
      values.forEach((_, i) => {
        const w = width * fractions[i];
        doc.setLineWidth(0.25); doc.rect(x, y, w, height);
        font(9, i === 0 || (nested && i === 2) ? 'bold' : 'normal');
        const right = element.classList.contains('compensi') && i === 1;
        doc.text(wrapped[i], right ? x + w - 2.5 : x + 2.5, y + 4.8, { align: right ? 'right' : 'left', lineHeightFactor: 1.26 });
        x += w;
      });
      y += height;
    }
    y += 2;
  };
  for (const element of source.body.children) {
    if (element.classList.contains('head')) {
      font(12, 'bold'); doc.text(text(element.querySelector('h1')).toUpperCase(), left, y + 3);
      font(10, 'italic'); doc.text(text(element.querySelector('.num')), left + width, y + 3, { align: 'right' });
      y += 10;
    } else if (element.tagName === 'H2') {
      room(16); paragraph(text(element), 10, true, 2);
    } else if (element.tagName === 'TABLE') {
      table(element);
    } else if (element.tagName === 'P') {
      const label = element.querySelector('strong');
      if (label) {
        font(9, 'bold'); const prefix = text(label);
        const rest = text(element).slice(prefix.length).trim();
        const labelWidth = doc.getTextWidth(prefix + ' ');
        room(6.5); doc.text(prefix, left, y + 3.2);
        font(); doc.text(rest, left + labelWidth, y + 3.2); y += 6.5;
      } else paragraph(text(element));
    } else if (element.classList.contains('dich')) {
      room(24); paragraph(text(element.querySelector('h3')), 9, true, 1);
      for (const p of element.querySelectorAll('p')) paragraph(text(p), 8, false, 1.5);
    } else if (element.classList.contains('firma-row')) {
      room(14); y += 5; font();
      doc.text(text(element.querySelector('.left')), left, y + 3);
      doc.text('Firma del prestatore:', left + 38, y + 3);
      doc.line(left + 71, y + 4, left + 137, y + 4);
    }
  }
  return doc.output('blob');
}

export function receiptFilename(name, brand) {
  const safe = value => String(value || '').normalize('NFKC')
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, ' ').trim().replace(/[. ]+$/g, '').slice(0, 90);
  const model = safe(name) || 'Ritenuta';
  const client = safe(brand);
  return `${model}${client ? ' per ' + client : ''}.pdf`;
}

export function downloadReceiptPDF(text, name, brand) {
  downloadReceiptBlob(createReceiptPDF(text), receiptFilename(name, brand));
}

export function downloadReceiptBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  try { link.click(); } finally {
    link.remove();
    // Android may consume the blob after the click handler has returned.
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}
