import { romeDate } from './annual-income.mjs';

function parseDate(value) {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value || '');
  if (!match) return null;
  const [, d, m, y] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : null;
}

function addMonths(date, months) {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return target;
}

export function contractSchedule(model, today = romeDate()) {
  const automatic = model.contratto_rinnovo_automatico === true;
  const now = new Date(`${today}T00:00:00Z`);
  const start = parseDate(model.contratto_inizio);
  const months = Number(model.contratto_durata_mesi);
  let end = parseDate(model.contratto_scadenza);
  if (automatic && start && Number.isInteger(months) && months > 0 && months <= 120) {
    let periods = Math.max(1, Math.floor(((now.getUTCFullYear() - start.getUTCFullYear()) * 12 + now.getUTCMonth() - start.getUTCMonth()) / months));
    end = addMonths(start, months * periods);
    if (end < now) end = addMonths(start, months * ++periods);
  }
  const diff = end ? (end - now) / 86400000 : null;
  const date = end ? `${String(end.getUTCDate()).padStart(2, '0')}/${String(end.getUTCMonth() + 1).padStart(2, '0')}/${end.getUTCFullYear()}` : '';
  const alert = diff === null ? null : automatic ? (diff >= 0 && diff <= 30 ? 'rinnovo vicino' : null) : diff < 0 ? 'scaduto' : diff <= 30 ? 'in scadenza' : null;
  return { date, automatic, alert };
}
