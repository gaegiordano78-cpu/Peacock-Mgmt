import test from 'node:test';
import assert from 'node:assert/strict';
import { contractSchedule } from '../app/lib/contracts.mjs';

test('a fixed twelve-month trial remains expired after its end date', () => {
  assert.deepEqual(contractSchedule({contratto_inizio:'10/04/2025', contratto_scadenza:'10/04/2026', contratto_rinnovo_automatico:false}, '2026-10-15'), {date:'10/04/2026', automatic:false, alert:'scaduto'});
});
test('a renewed Start advances to the next period without an expired badge', () => {
  assert.deepEqual(contractSchedule({contratto_inizio:'07/04/2025', contratto_scadenza:'07/04/2026', contratto_rinnovo_automatico:true, contratto_durata_mesi:12}, '2026-10-15'), {date:'07/04/2027', automatic:true, alert:null});
});
test('24-month Start stays in its original period and warns only near renewal', () => {
  const model={contratto_inizio:'24/10/2025', contratto_rinnovo_automatico:true, contratto_durata_mesi:24};
  assert.equal(contractSchedule(model,'2026-10-15').date,'24/10/2027');
  assert.equal(contractSchedule(model,'2027-10-15').alert,'rinnovo vicino');
  assert.equal(contractSchedule(model,'2027-10-25').date,'24/10/2029');
});
test('renewal day remains current, leap-day anniversaries clamp to February', () => {
  const model={contratto_inizio:'29/02/2024', contratto_rinnovo_automatico:true, contratto_durata_mesi:12};
  assert.equal(contractSchedule(model,'2025-02-28').date,'28/02/2025');
  assert.equal(contractSchedule(model,'2025-03-01').date,'28/02/2026');
});
test('missing or malformed dates never fabricate a renewal date', () => {
  assert.equal(contractSchedule({contratto_inizio:'31/02/2025',contratto_rinnovo_automatico:true,contratto_durata_mesi:12},'2026-10-15').date,'');
});
test('month-only starts preserve precision through automatic renewals', () => {
  const model={contratto_inizio:'03/2026',contratto_rinnovo_automatico:true,contratto_durata_mesi:24};
  assert.equal(contractSchedule(model,'2026-10-15').date,'03/2028');
  assert.equal(contractSchedule(model,'2028-03-25').date,'03/2028');
  assert.equal(contractSchedule(model,'2028-04-01').date,'03/2030');
});
