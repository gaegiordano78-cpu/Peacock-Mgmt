import test from 'node:test';
import assert from 'node:assert/strict';
import {talentMailProxy} from '../app/lib/talent-mail-proxy.mjs';

test('anonymous app requests never reach Nina',async()=>{
 let calls=0;const result=await talentMailProxy('GET','',undefined,async()=>{calls++;});assert.equal(result.status,401);assert.equal(calls,0);
});
test('the current user token is forwarded only to the fixed Nina endpoint for read-only connection checks',async()=>{
 const result=await talentMailProxy('GET','Bearer test-session',undefined,async(url,options)=>{assert.equal(url,'https://nina-peacock-agent.vercel.app/api/talent-preview-test');assert.equal(options.headers.Authorization,'Bearer test-session');assert.equal(options.method,'GET');assert.equal(options.body,undefined);assert.equal(options.redirect,'error');return Response.json({ok:true,amministratore:true});});assert.equal(result.status,200);
});
test('confirmed preview and identity are preserved; token and failures are never printed or retried',async()=>{
 const body={slugs:['yile'],conferma:true,html_sha256:'a'.repeat(64),oggetto:'PROVA oggi'};let calls=0;
 const result=await talentMailProxy('POST','Bearer test-session',body,async(url,options)=>{calls++;assert.deepEqual(JSON.parse(options.body),body);return Response.json({error:'Accesso riservato agli amministratori.'},{status:403});});assert.equal(calls,1);assert.equal(result.status,403);
 const failed=await talentMailProxy('POST','Bearer test-session',body,async()=>{throw Error('Bearer test-session');});assert.equal(failed.status,503);assert.ok(!JSON.stringify(failed).includes('test-session'));
});
