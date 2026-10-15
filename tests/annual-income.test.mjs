import { test } from 'node:test';
import assert from 'node:assert/strict';
import { annualIncome, romeDate } from '../app/lib/annual-income.mjs';
const paid = (netto_model, date = '2026-10-15', extra = {}) => ({ modella: 'Test Model', stato_pagamento: 'pagato', netto_model, data_pagamento_cliente: date, ...extra });
const sum = jobs => annualIncome(jobs, 'Test Model', '2026-10-15');
test('alerts exactly at 4000 gross and above', () => {
  assert.equal(sum([paid(3199.99)]).reached, false);
  assert.equal(sum([paid(3200)]).grossCents, 400000);
  assert.equal(sum([paid(3200)]).reached, true);
  assert.equal(sum([paid(4000)]).reached, true);
});
test('uses payment year, excludes unpaid, future and other models', () => {
  const result = sum([paid(800, '2026-01-01', {data_shooting:'2025-12-01'}), paid(3200,'2025-12-31'), paid(3200,'2026-10-16'), paid(3200,'2026-01-01',{stato_pagamento:'da pagare'}), paid(3200,'2026-01-01',{modella:'Other'})]);
  assert.equal(result.grossCents, 100000);
});
test('rounds each receipt and excludes reimbursements and invalid amounts', () => {
  assert.equal(sum([paid('800.01', undefined, {rimborso:500}), paid(800), paid('oops'), paid(-100)]).grossCents, 200001);
});
test('does not guess missing or invalid payment dates', () => {
  const result = sum([paid(3200,''), paid(3200,'2026-02-30'), paid(3200,null)]);
  assert.equal(result.grossCents,0);
  assert.equal(result.missingPaymentDates,3);
});
test('calendar resets on January 1 in Rome', () => {
  assert.equal(romeDate(new Date('2026-12-31T23:30:00Z')), '2027-01-01');
  assert.equal(annualIncome([paid(3200,'2026-12-31')], 'Test Model', '2027-01-01').grossCents,0);
  assert.equal(annualIncome([paid(3200,'2026-12-31')], 'Test Model', '2026-12-31').reached,true);
});
test('no profile never counts jobs', () => assert.equal(annualIncome([paid(3200)], undefined).grossCents,0));
