import { jsPDF } from 'jspdf';

// Create a real file locally. Never invoke the Android PWA print window.
export function createReceiptPDF(text) {
  const doc = new jsPDF({ format: 'a4', unit: 'mm', compress: true });
  doc.setProperties({ title: "Ritenuta d'acconto", author: 'Peacock Mgmt' });
  let y = 16;
  const lines = String(text).replace(/\r/g, '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/[ \t]+/g, ' ').trim();
    const heading = i === 0 || line.endsWith(':');
    doc.setFont('helvetica', heading ? 'bold' : 'normal');
    doc.setFontSize(i === 0 ? 12 : 9);
    if (heading && i > 0) y += 2;
    const wrapped = doc.splitTextToSize(line, 178);
    for (const row of wrapped) {
      if (y > 279) { doc.addPage(); y = 16; }
      doc.text(row, 16, y);
      y += 4.2;
    }
  }
  return doc.output('blob');
}

export function receiptFilename(name, number) {
  const safe = value => String(value || '').normalize('NFKC').replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 70);
  return `Ritenuta-${safe(name) || 'Peacock'}${number ? '-' + safe(number) : ''}.pdf`;
}

export function downloadReceiptPDF(text, name, number) {
  const url = URL.createObjectURL(createReceiptPDF(text));
  const link = document.createElement('a');
  link.href = url;
  link.download = receiptFilename(name, number);
  document.body.appendChild(link);
  try { link.click(); } finally {
    link.remove();
    // Android may consume the blob after the click handler has returned.
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}
