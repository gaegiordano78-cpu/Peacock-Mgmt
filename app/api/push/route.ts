// @ts-nocheck
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://xtpafxourildjnofeulr.supabase.co";
const SUPABASE_KEY = "sb_publishable_u9bT7JY0grFwVFrRnLxkhw_fVI84jIC";
const VAPID_PUBLIC = "BMXNr75XVbV4I5Kr4G6TSVD-1hfCfOyEGR5kRhgp0k5OWUzILbErOLL2O9u_JLIPGYda86dy8KYaFdRG0oB_AeA";

export async function POST(req: Request) {
  try {
    const priv = process.env.VAPID_PRIVATE_KEY;
    if (!priv) return Response.json({ error: "VAPID_PRIVATE_KEY mancante" }, { status: 500 });
    webpush.setVapidDetails("mailto:casting@peacockmodels.com", VAPID_PUBLIC, priv);

    const auth = req.headers.get("authorization") || "";
    // Client con il login di chi chiama: la RPC risponde solo agli admin
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { global: { headers: { Authorization: auth } } });
    const { data: subs, error } = await sb.rpc("get_push_subs_models");
    if (error) return Response.json({ error: error.message }, { status: 403 });

    const { title, body, url } = await req.json();
    const payload = JSON.stringify({ title: String(title || "Peacock").slice(0, 80), body: String(body || "").slice(0, 200), url: url || "/" });
    const results = await Promise.allSettled(
      (subs || []).map(s => webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 86400 }))
    );
    const sent = results.filter(r => r.status === "fulfilled").length;
    return Response.json({ ok: true, sent, total: (subs || []).length });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
