import { requireAdmin, errorReply } from "../_shared/admin.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Metodo non consentito." }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const { admin: supabase } = await requireAdmin(req);
    const { titolo, cliente, data_shooting, luogo, compenso, descrizione, casting_id } = await req.json();

    const { data: profiles, error: profErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("ruolo", "model");

    if (profErr) throw profErr;
    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: 0, note: "Nessun model trovato" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: activeModels, error: modelsError } = await supabase.from("modelle").select("user_id");
    if (modelsError) throw modelsError;
    const activeIds = new Set((activeModels || []).map(m => m.user_id).filter(Boolean));
    const emails: { email: string; userId: string }[] = [];
    for (const p of profiles) {
      if (!activeIds.has(p.id)) continue;
      const { data: userData } = await supabase.auth.admin.getUserById(p.id);
      if (userData?.user?.email) emails.push({ email: userData.user.email, userId: p.id });
    }

    if (emails.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: 0, note: "Nessuna email trovata" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appUrl = "https://peacock-mgmt-ezeq.vercel.app";
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #111;">
        <div style="text-align: center; margin-bottom: 32px;">
          <img src="https://peacockmodels.com/wp-content/uploads/2025/04/logo-peacock.svg" alt="Peacock" style="height: 48px;" />
        </div>
        <h1 style="font-size: 22px; font-weight: 500; margin: 0 0 8px;">Nuovo Casting</h1>
        <h2 style="font-size: 18px; font-weight: 400; color: #555; margin: 0 0 24px;">${titolo}</h2>
        
        <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          ${cliente ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Cliente:</strong> ${cliente}</p>` : ""}
          ${data_shooting ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Data shooting:</strong> ${data_shooting}</p>` : ""}
          ${luogo ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Luogo:</strong> ${luogo}</p>` : ""}
          ${compenso ? `<p style="margin: 0 0 8px; font-size: 14px;"><strong>Compenso:</strong> ${compenso}</p>` : ""}
        </div>

        ${descrizione ? `<p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px;">${descrizione}</p>` : ""}

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 14px;">Candidati ora</a>
        </div>

        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
          Peacock Models Management · peacockmodels.com
        </p>
      </div>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY non configurata");

    const results: any[] = [];
    for (const { email, userId } of emails) {
      // Recheck immediately before sending: the profile may have been deleted during this batch.
      const { data: currentModels, error: currentError } = await supabase.from("modelle").select("id").eq("user_id", userId);
      if (currentError) throw currentError;
      const { data: currentProfile, error: profileError } = await supabase.from("profiles").select("id").eq("id", userId).eq("ruolo", "model").maybeSingle();
      if (profileError) throw profileError;
      if (!currentModels?.length || !currentProfile) continue;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Peacock Models <casting@peacockmodels.com>",
          to: email,
          subject: `Nuovo casting: ${titolo}`,
          html: emailHtml,
        }),
      });
      const result = await res.json();
      results.push({ email, ok: res.ok, result });
    }

    return new Response(JSON.stringify({ ok: true, sent: results.filter(r => r.ok).length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return errorReply(error);
  }
});

