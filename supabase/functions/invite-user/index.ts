import { checked, cors, errorReply, reply, RequestError, requireAdmin } from "../_shared/admin.ts";

const APP_URL = "https://peacock-mgmt-ezeq.vercel.app";
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Metodo non consentito." }, 405);
  try {
    const { admin, caller } = await requireAdmin(req);
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const nome = typeof body.nome === "string" ? body.nome.trim() : "";
    if (!EMAIL.test(email) || email.length > 254 || !nome || nome.length > 200) throw new RequestError("Inserisci nome ed email validi.");
    const modelId = typeof body.modella_id === "string" ? body.modella_id.trim() : "";
    let lookup = admin.from("modelle").select("id,nome,user_id,email");
    lookup = modelId ? lookup.eq("id", modelId) : lookup.eq("nome", body.nome);
    const models = await checked(lookup.limit(2));
    if (!models?.length) throw new RequestError("Scheda modello non trovata: creala prima di inviare l’invito.", 404);
    if (models.length !== 1) throw new RequestError("Più schede corrispondono al nome: verifica il profilo.", 409);
    const model = models[0];
    let existing: any = null;
    for (let page = 1; ; page++) {
      const users = await checked(admin.auth.admin.listUsers({ page, perPage: 1000 }));
      existing = users.users.find((u: any) => u.email?.toLowerCase() === email);
      if (existing || users.users.length < 1000) break;
    }
    if (model.user_id && model.user_id !== existing?.id) throw new RequestError("La scheda è già collegata a un altro account. Verifica il collegamento.", 409);
    if (existing) {
      const profile = await checked(admin.from("profiles").select("ruolo").eq("id", existing.id).maybeSingle());
      if (existing.id === caller.id || (profile?.ruolo && profile.ruolo !== "model")) throw new RequestError("Questo account non può essere usato per un profilo modello.", 409);
      const otherModels = await checked(admin.from("modelle").select("id").eq("user_id", existing.id).neq("id", model.id).limit(1));
      if (otherModels?.length) throw new RequestError("L’account è già collegato a un’altra scheda. Verifica il profilo.", 409);
    }
    let userId = existing?.id;
    if (!existing) {
      const invitation = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: APP_URL, data: { nome: model.nome } });
      if (invitation.error || !invitation.data?.user?.id) throw new RequestError("Invito non completato. Controlla lo stato dell’account prima di riprovare.", 502);
      userId = invitation.data.user.id;
    }
    // Never reset passwords, confirm emails administratively, or downgrade an admin.
    const profile = await checked(admin.from("profiles").select("ruolo").eq("id", userId).maybeSingle());
    if (profile?.ruolo && profile.ruolo !== "model") throw new RequestError("Account non compatibile con un profilo modello.", 409);
    if (!profile) await checked(admin.from("profiles").insert({ id: userId, nome: model.nome, ruolo: "model" }));
    let update = admin.from("modelle").update({ user_id: userId, email }).eq("id", model.id);
    update = model.user_id ? update.eq("user_id", model.user_id) : update.is("user_id", null);
    const linked = await checked(update.select("id"));
    if (linked?.length !== 1) throw new RequestError("Il profilo è cambiato durante l’invito. Verifica il collegamento prima di riprovare.", 409);
    if (existing) {
      // The owner chooses a password through a one-time recovery link; no password is changed here.
      const recovery = await admin.auth.resetPasswordForEmail(email, { redirectTo: APP_URL });
      if (recovery.error) throw new RequestError("Profilo collegato, ma email di accesso non inviata. Usa Recupera password o riprova più tardi.", 502);
    }
    return reply({ ok: true, email, existing_user: Boolean(existing), access_link_sent: true });
  } catch (error) { return errorReply(error); }
});
