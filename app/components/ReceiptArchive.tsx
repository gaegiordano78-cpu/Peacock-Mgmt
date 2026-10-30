"use client";
import { useEffect, useRef, useState } from "react";
import { getReceipt, downloadSavedReceipt } from "../lib/receipt-archive.mjs";

const fields = "id,model_name,brand,receipt_number,receipt_date,gross,withholding,net,filename,created_at";
const pageSize = 50;
const button = { padding: "12px 16px", borderRadius: 12, border: "1px solid #ddd", background: "#fff", color: "#111", cursor: "pointer", font: "inherit" };
const input = { width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 10, font: "inherit", boxSizing: "border-box" as const, minWidth: 0 };
const money = (n: number) => Number(n).toLocaleString("it-IT", { style: "currency", currency: "EUR" });

export default function ReceiptArchive({ client, onBack }: { client: any; onBack: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const downloadLock = useRef(false);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(""); setRows([]);
    const timer = setTimeout(async () => {
      try {
        if (from && to && from > to) throw new Error("La data iniziale deve precedere quella finale.");
        let query = client.from("receipt_archive").select(fields, { count: "exact" }).order("created_at", { ascending: false }).order("id");
        const term = search.replace(/[^\p{L}\p{N}\s.'’_-]/gu, " ").trim().replace(/[%_]/g, " ");
        if (term) query = query.or(`model_name.ilike.%${term}%,brand.ilike.%${term}%`);
        if (from) query = query.gte("receipt_date", from);
        if (to) query = query.lte("receipt_date", to);
        const result = await query.range(page * pageSize, (page + 1) * pageSize - 1);
        if (result.error) throw new Error("Archivio non disponibile. Riprova.");
        if (active) { setRows(result.data || []); setCount(result.count || 0); }
      } catch (e: any) { if (active) setError(e.message || "Archivio non disponibile."); }
      finally { if (active) setLoading(false); }
    }, 200);
    return () => { active = false; clearTimeout(timer); };
  }, [client, search, from, to, page, refresh]);
  const download = async (id: string) => {
    if (downloadLock.current) return;
    downloadLock.current = true; setBusy(id); setError("");
    try { downloadSavedReceipt(await getReceipt(client, id)); }
    catch (e: any) { setError(e.message); }
    finally { downloadLock.current = false; setBusy(""); }
  };
  return <section style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "'Helvetica Neue', sans-serif" }}>
    <button style={button} onClick={onBack}>← Indietro</button>
    <h1 style={{ fontSize: 24 }}>Archivio ritenute</h1>
    <p style={{ color: "#666", lineHeight: 1.5 }}>Qui trovi i PDF salvati dall’app. Le ritenute generate prima dell’attivazione dell’archivio non sono incluse.</p>
    <label style={{ display: "block", marginBottom: 12 }}>Cerca modello o brand
      <input style={input} value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Nome o brand" />
    </label>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      <label>Data ritenuta dal<input aria-label="Data ritenuta dal" style={input} type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(0); }} /></label>
      <label>Al<input aria-label="Data ritenuta al" style={input} type="date" value={to} onChange={e => { setTo(e.target.value); setPage(0); }} /></label>
    </div>
    <button style={button} onClick={() => setRefresh(r => r + 1)}>Aggiorna</button>
    {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
    {loading ? <p role="status">Caricamento…</p> : !error && <p>{count === 0 ? "Nessuna ritenuta trovata." : `${count} ritenute trovate`}</p>}
    {rows.map(r => <article key={r.id} style={{ background: "white", border: "1px solid #ddd", borderRadius: 14, padding: 16, margin: "12px 0" }}>
      <strong>{r.model_name}{r.brand ? ` per ${r.brand}` : ""}</strong>
      <p style={{ color: "#555", fontSize: 14 }}>Ritenuta del {r.receipt_date.split("-").reverse().join("/")} · N° {r.receipt_number || "non indicato"}<br />
        Salvata il {new Date(r.created_at).toLocaleString("it-IT", { timeZone: "Europe/Rome" })}</p>
      <p style={{ fontSize: 14 }}>Lordo {money(r.gross)} · Ritenuta {money(r.withholding)} · Netto {money(r.net)}</p>
      <button style={button} disabled={!!busy} onClick={() => download(r.id)}>{busy === r.id ? "Download…" : "Scarica PDF"}</button>
    </article>)}
    {!loading && count > pageSize && <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <button style={button} disabled={!page} onClick={() => setPage(p => p - 1)}>Precedenti</button>
      <span>{page + 1} / {Math.ceil(count / pageSize)}</span>
      <button style={button} disabled={(page + 1) * pageSize >= count} onClick={() => setPage(p => p + 1)}>Successive</button>
    </div>}
  </section>;
}
