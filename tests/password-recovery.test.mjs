import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readAuthReturn, openPasswordRecovery } from '../app/lib/password-recovery.mjs';
const session = { user: { id: 'model-test' } };
function mockAuth() {
 const calls=[]; const auth={};
 for (const name of ['setSession','exchangeCodeForSession','verifyOtp']) auth[name]=async args=>{calls.push([name,args]);return {data:{session},error:null};};
 auth.getUser=async()=>{calls.push(['getUser']);return {data:{user:session.user},error:null};};
 return {auth,calls};
}
test('normal login URL never activates password recovery',()=>assert.equal(readAuthReturn('https://example.test/'),null));
test('captures recovery fragment and callback query before SDK initialization',()=>{
 assert.deepEqual(readAuthReturn('https://example.test/#type=recovery&access_token=test&refresh_token=refresh'),{type:'recovery',access_token:'test',refresh_token:'refresh'});
 assert.deepEqual(readAuthReturn('https://example.test/auth/callback?code=test'),{code:'test'});
});
test('expired link without type is handled, not sent to login',async()=>{
 const params=readAuthReturn('https://example.test/#error=access_denied&error_code=otp_expired&error_description=expired');
 const {auth,calls}=mockAuth();await assert.rejects(openPasswordRecovery(auth,params),/invalid_link/);assert.equal(calls.length,0);
});
test('valid implicit recovery validates the session and server user',async()=>{
 const {auth,calls}=mockAuth();assert.equal(await openPasswordRecovery(auth,{type:'recovery',access_token:'access',refresh_token:'refresh'}),'model-test');
 assert.deepEqual(calls,[['setSession',{access_token:'access',refresh_token:'refresh'}],['getUser']]);
});
test('PKCE callback code is exchanged, never discarded',async()=>{
 const {auth,calls}=mockAuth();await openPasswordRecovery(auth,{code:'test-code'});assert.deepEqual(calls[0],['exchangeCodeForSession','test-code']);
});
test('hashed recovery and invitation links verify the one-time token',async()=>{
 for(const type of ['recovery','invite']) {const {auth,calls}=mockAuth();await openPasswordRecovery(auth,{type,token_hash:'test-hash'});assert.deepEqual(calls[0],['verifyOtp',{token_hash:'test-hash',type}]);}
});
test('incomplete links never reuse an existing session',async()=>{
 for(const params of [{type:'recovery'},{access_token:'only-access'},{type:'email',token_hash:'hash'}]) {const {auth,calls}=mockAuth();await assert.rejects(openPasswordRecovery(auth,params));assert.equal(calls.length,0);}
});
test('rejected session, missing session, or rejected server user cannot open password form',async()=>{
 for(const result of [{error:{message:'expired'},data:{session:null}},{error:null,data:{session:null}}]) {const {auth}=mockAuth();auth.setSession=async()=>result;await assert.rejects(openPasswordRecovery(auth,{access_token:'a',refresh_token:'r'}));}
 const {auth}=mockAuth();auth.getUser=async()=>({error:{message:'invalid'},data:{user:null}});await assert.rejects(openPasswordRecovery(auth,{access_token:'a',refresh_token:'r'}));
});
