import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { connect, type TLSSocket } from 'node:tls';
import { fetchTalent } from '../../../lib/talent-source.mjs';
import { presentationHtml } from '../../../lib/talent-presentations.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const FROM = 'hello@peacockmodels.com';
const TO = 'info@gaetanogiordano.com';
const SUPABASE_URL = 'https://xtpafxourildjnofeulr.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_u9bT7JY0grFwVFrRnLxkhw_fVI84jIC';

function smtpConfig() {
  const host = process.env.PEACOCK_SMTP_HOST?.trim();
  const port = Number(process.env.PEACOCK_SMTP_PORT || '465');
  const user = process.env.PEACOCK_SMTP_USER?.trim();
  const password = process.env.PEACOCK_SMTP_PASSWORD;
  if (!host || !user || !password || user.toLowerCase() !== FROM || port !== 465 || !/^[a-z0-9.-]+$/i.test(host)) return null;
  return { host, port, user, password };
}
async function requireAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (!/^Bearer\s+\S+$/.test(auth)) return false;
  const token = auth.replace(/^Bearer\s+/i,'');
  const sb = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return false;
  const { data, error: roleError } = await sb.from('profiles').select('ruolo').eq('id', user.id).single();
  return !roleError && data?.ruolo === 'admin';
}
function encodeHeader(value: string) {
  return '=?UTF-8?B?' + Buffer.from(value, 'utf8').toString('base64') + '?=';
}
async function smtpSend(config: NonNullable<ReturnType<typeof smtpConfig>>, subject: string, html: string) {
  await new Promise<void>((resolve, reject) => {
    const socket: TLSSocket = connect({ host: config.host, port: config.port, servername: config.host, rejectUnauthorized: true });
    let buffer = '';
    let finished = false;
    let waiter: ((code: number, message: string) => void) | null = null;
    const queue: { code: number; message: string }[] = [];
    const finish = (error?: Error) => {
      if (finished) return; finished = true;
      socket.destroy(); error ? reject(error) : resolve();
    };
    socket.setTimeout(14000, () => finish(new Error('Timeout della connessione SMTP')));
    socket.on('error', () => finish(new Error('Connessione SMTP non disponibile')));
    socket.on('close', () => { if (!finished) finish(new Error('Connessione SMTP interrotta')); });
    socket.on('data', chunk => {
      buffer += chunk.toString('utf8');
      while (buffer.includes('\r\n')) {
        const end = buffer.indexOf('\r\n');
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        const match = line.match(/^(\d{3})([ -])(.*)$/);
        if (match && match[2] === ' ') {
          const reply = { code: Number(match[1]), message: match[3] };
          if (waiter) { const next = waiter; waiter = null; next(reply.code, reply.message); }
          else queue.push(reply);
        }
      }
    });
    const response = () => new Promise<{code:number;message:string}>((res, rej) => {
      if (finished) return rej(new Error('Connessione SMTP chiusa'));
      if (queue.length) return res(queue.shift()!);
      waiter = (code, message) => res({code,message});
    });
    const step = async (command: string | null, expected: number) => {
      if (command !== null) socket.write(command + '\r\n');
      const reply = await response();
      if (reply.code !== expected) throw new Error('Server SMTP ha rifiutato la richiesta (' + reply.code + ')');
    };
    void (async () => {
      try {
        await step(null, 220);
        await step('EHLO peacockmodels.com', 250);
        await step('AUTH LOGIN', 334);
        await step(Buffer.from(config.user).toString('base64'), 334);
        await step(Buffer.from(config.password).toString('base64'), 235);
        await step('MAIL FROM:<' + FROM + '>', 250);
        await step('RCPT TO:<' + TO + '>', 250);
        await step('DATA', 354);
        const boundary = 'peacock-talent-preview';
        const text = 'Presentazione Peacock Models. Per visualizzare il profilo apri https://peacockmodels.com/';
        const mail = [
          'From: Peacock Models MGMT <' + FROM + '>',
          'To: <' + TO + '>',
          'Subject: ' + encodeHeader(subject),
          'MIME-Version: 1.0',
          'Content-Type: multipart/alternative; boundary="' + boundary + '"',
          'Date: ' + new Date().toUTCString(),
          '',
          '--' + boundary,
          'Content-Type: text/plain; charset=UTF-8',
          'Content-Transfer-Encoding: base64',
          '',
          Buffer.from(text).toString('base64'),
          '--' + boundary,
          'Content-Type: text/html; charset=UTF-8',
          'Content-Transfer-Encoding: base64',
          '',
          Buffer.from(html).toString('base64'),
          '--' + boundary + '--',
          ''
        ].join('\r\n');
        socket.write(mail + '\r\n.\r\n');
        const reply = await response();
        if (reply.code !== 250) throw new Error('Il server SMTP non ha accettato la mail (' + reply.code + ')');
        finish();
      } catch (e) { finish(e instanceof Error ? e : new Error('Errore SMTP')); }
    })();
  });
}
export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return NextResponse.json({ error:'Accesso riservato agli amministratori.' }, { status: 403 });
  let payload: any;
  try { payload = await request.json(); } catch { return NextResponse.json({ error:'Richiesta non valida.' }, { status:400 }); }
  if (payload?.conferma !== true || payload?.destinatario !== TO || !Array.isArray(payload?.slugs) || payload.slugs.length < 1 || payload.slugs.length > 20 || payload.slugs.some((s:unknown) => typeof s !== 'string' || !/^[a-z0-9-]{1,60}$/.test(s)) || new Set(payload.slugs).size !== payload.slugs.length)
    return NextResponse.json({ error:'Conferma esplicita e destinatario di prova obbligatori.' }, { status:400 });
  const config = smtpConfig();
  if (!config) return NextResponse.json({ error:'Invio disabilitato: SMTP Peacock non configurato su Vercel.' }, { status:503 });
  try {
    const talents = await Promise.all(payload.slugs.map((slug: string) => fetchTalent(slug)));
    const html = presentationHtml(talents);
    const subject = talents.length === 1 ? 'PROVA — INTRODUCING ' + talents[0].name.toUpperCase() + ' — Peacock Models' : 'PROVA — NUOVI VOLTI, NUOVE STORIE. — Peacock Models';
    await smtpSend(config, subject, html);
    return NextResponse.json({ ok:true, destinatario: TO, mittente: FROM, oggetto: subject }, { headers: { 'Cache-Control':'no-store' } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Invio non riuscito.' }, { status:502,headers:{'Cache-Control':'no-store'} });
  }
}
