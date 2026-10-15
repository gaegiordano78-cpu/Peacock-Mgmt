export const INCOME_ALERT_CENTS = 400000;

// Use the business calendar, including around midnight and New Year.
export function romeDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = type => parts.find(p => p.type === type).value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function annualIncome(jobs, modelName, today = romeDate()) {
  const year = Number(today.slice(0, 4));
  let grossCents = 0;
  let missingPaymentDates = 0;
  for (const job of jobs) {
    if (!modelName || job.modella !== modelName || job.stato_pagamento !== 'pagato') continue;
    // This legacy field is written by the model payment action in the app.
    const date = job.data_pagamento_cliente;
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
      missingPaymentDates++;
      continue;
    }
    if (Number(date.slice(0, 4)) !== year || date > today) continue;
    const net = Number(job.netto_model);
    if (!Number.isFinite(net) || net <= 0) continue;
    // Match the withholding receipt: gross = net / 0.8, excluding expenses.
    grossCents += Math.round((Math.round(net * 100) * 5) / 4);
  }
  return { year, grossCents, missingPaymentDates, reached: grossCents >= INCOME_ALERT_CENTS };
}
