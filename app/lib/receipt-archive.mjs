import { createReceiptPDF, downloadReceiptBlob } from './receipt-pdf.mjs';

export function receiptBlob(base64) {
  const raw = atob(base64);
  return new Blob([Uint8Array.from(raw, c => c.charCodeAt(0))], { type: 'application/pdf' });
}
export async function saveReceipt(client, { html, job, model, number, date }) {
  const bytes = new Uint8Array(await createReceiptPDF(html).arrayBuffer());
  let raw = '';
  for (let i = 0; i < bytes.length; i += 8192) raw += String.fromCharCode(...bytes.subarray(i, i + 8192));
  const { data, error } = await client.rpc('save_receipt', {
    p_data: { model_id: model.id, job_id: job.id, number, date, net: Number(job.netto_model) || 0 },
    p_source: html, p_pdf: btoa(raw),
  });
  if (error || !data?.id || !data?.pdf) throw new Error('Ritenuta non salvata. Controlla la connessione e riprova.');
  return data;
}
export async function getReceipt(client, id) {
  const { data, error } = await client.rpc('get_receipt', { p_id: id });
  if (error || !data?.pdf) throw new Error('Download non riuscito. Riprova.');
  return data;
}
export function downloadSavedReceipt(data) {
  downloadReceiptBlob(receiptBlob(data.pdf), data.filename);
}
