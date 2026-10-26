import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.2";

export const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" },
});

export async function checked(query: any) {
  const result = await query;
  if (result.error) throw new RequestError("Operazione non completata. Riprova o verifica il profilo.", 502);
  return result.data;
}

export async function requireAdmin(req: Request) {
  const token = req.headers.get("Authorization")?.match(/^Bearer\s+([^\s]+)$/i)?.[1];
  if (!token || token === "undefined" || token === "null") throw new RequestError("Accedi nuovamente per continuare.", 401);
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new RequestError("Servizio non disponibile.", 503);
  const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) throw new RequestError("Sessione non valida: accedi nuovamente.", 401);
  const profile = await checked(admin.from("profiles").select("ruolo").eq("id", data.user.id).maybeSingle());
  if (profile?.ruolo !== "admin") throw new RequestError("Operazione riservata agli amministratori.", 403);
  return { admin, caller: data.user };
}

export function errorReply(error: unknown) {
  if (error instanceof RequestError) return reply({ error: error.message }, error.status);
  if (error instanceof SyntaxError) return reply({ error: "Richiesta non valida." }, 400);
  console.error(JSON.stringify({ event: "peacock_admin_operation_failed", kind: error instanceof Error ? error.name : "Unknown" }));
  return reply({ error: "Operazione non completata. Verifica lo stato prima di riprovare." }, 500);
}
