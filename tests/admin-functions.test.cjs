const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.join(__dirname, '../supabase/functions');

function world({ token = 'admin-token', existing = false, targetRole = 'model', otherModel = false, linked = false, missing = false, deletedDuringBatch = false } = {}) {
  const calls = { writes: [], invite: [], recovery: [], reset: [], sends: [], reads: [] };
  const users = existing ? [{ id: 'model-user', email: 'model@example.invalid' }] : [];
  const rows = {
    profiles: [{ id: 'admin-user', ruolo: 'admin' }, ...(existing ? [{ id: 'model-user', ruolo: targetRole }] : [])],
    modelle: missing ? [] : [{ id: 'm1', nome: 'Model Example', user_id: linked ? 'another-user' : existing ? 'model-user' : null, email: 'model@example.invalid' }, ...(otherModel ? [{ id: 'm2', nome: 'Other Model', user_id: 'model-user' }] : [])],
  };
  const client = {
    from(table) {
      const filters = []; let mode = 'select', values, single = false;
      const query = {
        select() { return query; }, limit() { return query; },
        eq(k, v) { filters.push(r => r[k] === v); return query; },
        neq(k, v) { filters.push(r => r[k] !== v); return query; },
        is(k, v) { filters.push(r => r[k] === v); return query; },
        maybeSingle() { single = true; return query; },
        insert(v) { mode = 'insert'; values = v; return query; },
        update(v) { mode = 'update'; values = v; return query; },
        then(resolve, reject) {
          calls.reads.push(table);
          let found = (rows[table] || []).filter(r => filters.every(f => f(r)));
          if (mode === 'insert') { calls.writes.push({ table, mode, values }); (rows[table] ||= []).push(values); found = [values]; }
          if (mode === 'update') { calls.writes.push({ table, mode, values }); found.forEach(r => Object.assign(r, values)); }
          if (deletedDuringBatch && table === 'modelle' && filters.length) found = [];
          return Promise.resolve({ data: single ? found[0] || null : found, error: null }).then(resolve, reject);
        },
      };
      return query;
    },
    auth: {
      getUser: async supplied => supplied === 'admin-token' ? { data: { user: { id: 'admin-user' } }, error: null }
        : supplied === 'model-token' ? { data: { user: { id: 'model-user' } }, error: null }
        : { data: { user: null }, error: new Error('expired') },
      resetPasswordForEmail: async (...args) => { calls.recovery.push(args); return { error: null }; },
      admin: {
        listUsers: async () => ({ data: { users }, error: null }),
        inviteUserByEmail: async (...args) => { calls.invite.push(args); return { data: { user: { id: 'new-user' } }, error: null }; },
        updateUserById: async (...args) => { calls.reset.push(args); throw Error('Must never reset passwords'); },
        getUserById: async id => ({ data: { user: { id, email: 'model@example.invalid' } }, error: null }),
      },
    },
  };
  const execute = (source, imports) => {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
      { exports, require: imports, Deno: { env: { get: () => 'configured' }, serve: fn => handler = fn }, Response, console: { error() {} }, fetch: async (_url, opts) => { calls.sends.push(JSON.parse(opts.body)); return Response.json({ id: 'mock' }); } });
    return exports;
  };
  let handler;
  const helper = execute(fs.readFileSync(path.join(root, '_shared/admin.ts'), 'utf8'), () => ({ createClient: () => client }));
  return { calls, async run(slug, body = {}, method = 'POST') {
    execute(fs.readFileSync(path.join(root, slug, 'index.ts'), 'utf8'), () => helper);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const request = new Request('https://example.invalid', { method, headers, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
    const response = await handler(request);
    return { status: response.status, body: method === 'OPTIONS' ? null : await response.json() };
  } };
}

for (const slug of ['invite-user', 'notify-casting']) {
  for (const [token, expected] of [[null, 401], ['expired-token', 401], ['model-token', 403]]) {
    test(`${slug}: rejects ${token || 'missing token'} before any write or message`, async () => {
      const w = world({ token, existing: true });
      assert.equal((await w.run(slug, { email: 'model@example.invalid', nome: 'Model Example' })).status, expected);
      assert.equal(w.calls.writes.length + w.calls.invite.length + w.calls.recovery.length + w.calls.sends.length, 0);
    });
  }
  test(`${slug}: GET is rejected and OPTIONS has no effects`, async () => {
    const w = world(); assert.equal((await w.run(slug, {}, 'GET')).status, 405);
    assert.equal((await w.run(slug, {}, 'OPTIONS')).status, 200);
    assert.equal(w.calls.reads.length + w.calls.sends.length, 0);
  });
}

test('new invitation uses an individual link and never returns a password', async () => {
  const w = world(); const r = await w.run('invite-user', { email: 'model@example.invalid', nome: 'Model Example' });
  assert.equal(r.status, 200); assert.equal(w.calls.invite.length, 1); assert.equal(w.calls.reset.length, 0);
  assert.equal('password' in r.body, false); assert.equal(w.calls.recovery.length, 0);
  assert.equal(w.calls.writes.find(x => x.table === 'modelle').values.user_id, 'new-user');
});
test('existing model gets a recovery link without resetting its password', async () => {
  const w = world({ existing: true }); const r = await w.run('invite-user', { email: 'model@example.invalid', nome: 'Model Example' });
  assert.equal(r.status, 200); assert.equal(w.calls.invite.length, 0); assert.equal(w.calls.reset.length, 0); assert.equal(w.calls.recovery.length, 1);
});
for (const scenario of [{ existing: true, targetRole: 'admin' }, { existing: true, otherModel: true }, { linked: true }, { missing: true }]) {
  test(`invitation refuses incompatible or missing model ${JSON.stringify(scenario)}`, async () => {
    const w = world(scenario); const r = await w.run('invite-user', { email: 'model@example.invalid', nome: 'Model Example' });
    assert.ok([404, 409].includes(r.status)); assert.equal(w.calls.writes.length + w.calls.invite.length + w.calls.recovery.length, 0);
  });
}
test('admin casting notification keeps active-model delivery', async () => {
  const w = world({ existing: true }); const r = await w.run('notify-casting', { titolo: 'Mock casting' });
  assert.equal(r.status, 200); assert.equal(w.calls.sends.length, 1);
});
test('casting notification still skips models deleted during the batch', async () => {
  const w = world({ existing: true, deletedDuringBatch: true }); const r = await w.run('notify-casting', { titolo: 'Mock casting' });
  assert.equal(r.status, 200); assert.equal(w.calls.sends.length, 0);
});
