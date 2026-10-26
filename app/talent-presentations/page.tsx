"use client";
import { useState } from "react";

type Talent = { slug: string; name: string; profile: string; images: string[]; warning?: string | null };
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));
const validImage = (url: string) => { try { const u = new URL(url); return u.protocol === "https:" && ["peacockmodels.com", "www.peacockmodels.com"].includes(u.hostname); } catch { return false; } };
function template(talents: Talent[]) {
  const single = talents.length === 1;
  const heading = single ? "INTRODUCING: " + talents[0].name.toUpperCase() : "NUOVI VOLTI, NUOVE STORIE.";
  const rows = talents.map(t => {
    const image = t.images.find(validImage);
    return `<tr><td style="padding:0 0 36px;text-align:center">${image ? `<a href="${escapeHtml(t.profile)}"><img src="${escapeHtml(image)}" width="520" alt="${escapeHtml(t.name)}" style="width:100%;max-width:520px;display:block;object-fit:cover"></a>` : ""}<h2 style="font-family:Georgia,serif;font-weight:400;font-size:28px;margin:22px 0 8px">${escapeHtml(t.name)}</h2><a href="${escapeHtml(t.profile)}" style="color:#111;text-decoration:underline;font-size:12px;letter-spacing:2px">SCOPRI IL PROFILO</a></td></tr>`;
  }).join("");
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#eeeae4;color:#161616"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eeeae4"><tr><td align="center" style="padding:32px 12px"><table role="presentation" cellpadding="0" cellspacing="0" width="560" style="width:100%;max-width:560px;background:#faf9f6"><tr><td align="center" style="padding:40px 20px 26px"><div style="font-family:Georgia,serif;font-size:32px;letter-spacing:3px">PEACOCK</div><div style="font:10px Arial,sans-serif;letter-spacing:4px;margin-top:8px">MODELS MANAGEMENT</div><div style="border-top:1px solid #bbb;margin:28px 0"></div><h1 style="font:normal 30px Georgia,serif;line-height:1.15;margin:0">${escapeHtml(heading)}</h1><p style="font:14px/1.6 Arial,sans-serif;margin:16px 0 0">Talenti per campagne moda, editoriali e produzioni.</p></td></tr><tr><td style="padding:0 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr><tr><td align="center" style="border-top:1px solid #ddd;padding:24px 16px 36px;font:11px Arial,sans-serif;letter-spacing:1px">PEACOCK MODELS MGMT · BARI<br><a style="color:#111" href="https://peacockmodels.com">peacockmodels.com</a> · Per info e booking: <a href="mailto:hello@peacockmodels.com" style="color:#111">hello@peacockmodels.com</a></td></tr></table></td></tr></table></body></html>`;
}
export default function TalentPresentations() {
  const [slug, setSlug] = useState("yile");
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function add() {
    const s = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]{1,60}$/.test(s)) { setError("Inserisci lo slug del profilo, ad esempio yile."); return; }
    if (talents.some(t => t.slug === s)) { setError("Questo talento è già presente."); return; }
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/talent-presentations?slug=" + encodeURIComponent(s), { cache: "no-store" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Profilo non disponibile");
      setTalents(old => [...old, { ...data, slug: s }]);
      setSlug("");
    } catch (e) { setError(e instanceof Error ? e.message : "Errore"); }
    finally { setLoading(false); }
  }
  function exportHtml() {
    if (talents.some(t => !t.images.some(validImage))) { setError("Non è possibile esportare: mancano immagini originali di uno o più talenti."); return; }
    const html = template(talents);
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "peacock-talent-presentation.html"; a.click(); URL.revokeObjectURL(url);
  }
  return <main style={{ maxWidth: 920, margin: "auto", padding: "42px 20px", fontFamily: "Arial,sans-serif", color: "#191919" }}>
    <a href="/" style={{ color: "#555", fontSize: 13 }}>← Peacock MGMT</a>
    <h1 style={{ fontFamily: "Georgia,serif", fontSize: 36, fontWeight: 400 }}>Talent Presentations</h1>
    <p>Prepara una presentazione usando le immagini pubblicate sul sito Peacock. Nessuna email viene inviata.</p>
    <div style={{ display: "flex", gap: 10, margin: "24px 0" }}>
      <input aria-label="Slug del modello" value={slug} onChange={e => setSlug(e.target.value)} placeholder="yile" style={{ flex: 1, padding: 13, border: "1px solid #bbb" }}/>
      <button onClick={add} disabled={loading} style={{ background: "#191919", color: "white", padding: "12px 18px", border: 0 }}>{loading ? "Caricamento…" : "Aggiungi talento"}</button>
    </div>
    {error && <p role="alert" style={{ color: "#a22" }}>{error}</p>}
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {talents.map(t => <div key={t.slug} style={{ border: "1px solid #ddd", padding: 12, width: 190 }}>
        {t.images[0] && <img src={t.images[0]} alt={t.name} style={{ width: "100%", height: 180, objectFit: "cover" }}/>}
        <strong style={{ display: "block", marginTop: 10 }}>{t.name}</strong>
        <a href={t.profile} target="_blank" rel="noopener noreferrer">Profilo ufficiale</a>
        {t.warning && <p style={{ color: "#a22", fontSize: 12 }}>{t.warning}</p>}
        <button onClick={() => setTalents(old => old.filter(x => x.slug !== t.slug))} style={{ display: "block", marginTop: 12 }}>Rimuovi</button>
      </div>)}
    </div>
    {talents.length > 0 && <>
      <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 400 }}>Anteprima email</h2>
      <iframe title="Anteprima presentazione" srcDoc={template(talents)} sandbox="" style={{ width: "100%", height: 650, border: "1px solid #ddd", background: "white" }}/>
      <button onClick={exportHtml} disabled={talents.some(t => !t.images.some(validImage))} style={{ background: "#191919", color: "#fff", border: 0, padding: "14px 24px", marginTop: 20, opacity: talents.some(t => !t.images.some(validImage)) ? .45 : 1 }}>Scarica HTML email</button>
      <p style={{ fontSize: 12, color: "#666" }}>Invio manuale a cura di Gae. Verificare le fotografie prima dell'utilizzo.</p>
    </>}
  </main>;
}
