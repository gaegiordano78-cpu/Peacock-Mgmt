"use client";
import { useEffect, useRef, useState } from "react";
import { openPasswordRecovery } from "../lib/password-recovery.mjs";

const control = { width: "100%", boxSizing: "border-box" as const, padding: 14, border: "1px solid #ddd", borderRadius: 12, font: "inherit", margin: "6px 0 18px" };
const button = { ...control, background: "#1c1714", color: "white", cursor: "pointer", marginBottom: 8 };
export default function PasswordRecovery({ client, params }: { client: any; params: any }) {
  const [state, setState] = useState("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const verifiedUser = useRef("");
  const attempt = useRef<Promise<string> | null>(null);
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    (window as any).__hideSplash?.();
    // Drop credentials from the address bar before loading anything else.
    window.history.replaceState(window.history.state, "", window.location.pathname);
    attempt.current ||= openPasswordRecovery(client.auth, params);
    attempt.current.then(id => { if (active) { verifiedUser.current = id; setState("ready"); } })
      .catch(() => { if (active) setState("invalid"); });
    return () => { active = false; };
  }, [client, params]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (lock.current || state !== "ready") return;
    if (password.length < 8) { setError("Scegli una password di almeno 8 caratteri."); return; }
    if (password !== confirmation) { setError("Le due password non coincidono."); return; }
    lock.current = true; setBusy(true); setError("");
    try {
      const current = await client.auth.getUser();
      if (current.error || current.data?.user?.id !== verifiedUser.current) { setState("invalid"); return; }
      const result = await client.auth.updateUser({ password });
      if (result.error) {
        const code = result.error.code;
        if (code === "same_password") setError("Scegli una password diversa da quella precedente.");
        else if (code === "weak_password") setError("Scegli una password più robusta, con lettere, numeri e simboli.");
        else setError("Password non salvata. Riprova; se il problema continua richiedi un nuovo link.");
        return;
      }
      setPassword(""); setConfirmation(""); setState("done");
    } catch { setError("Connessione interrotta. Riprova."); }
    finally { lock.current = false; setBusy(false); }
  };
  const resend = async (event: React.FormEvent) => {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const result = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: window.location.origin });
      if (result.error) setError("Invio non riuscito. Attendi un minuto e riprova.");
      else setSent(true);
    } catch { setError("Connessione interrotta. Riprova."); }
    finally { lock.current = false; setBusy(false); }
  };
  return <main style={{ maxWidth: 430, margin: "0 auto", padding: "48px 24px", fontFamily: "Arial, sans-serif", color: "#222" }}>
    <img src="/logo-peacock.png" alt="Peacock" style={{ display: "block", width: 180, margin: "0 auto 32px" }} />
    <h1 style={{ fontSize: 25 }}>{state === "done" ? "Password aggiornata" : "Imposta una nuova password"}</h1>
    {state === "checking" && <p role="status">Verifica del link in corso…</p>}
    {state === "ready" && <form onSubmit={save}>
      <p>Il link è valido. Scegli la password che userai per accedere a Peacock.</p>
      <label>Nuova password<input style={control} type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} /></label>
      <label>Conferma nuova password<input style={control} type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label>
      <button style={button} disabled={busy}>{busy ? "Salvataggio…" : "Salva nuova password"}</button>
    </form>}
    {state === "invalid" && <>
      <p role="alert">Questo link è scaduto, è già stato utilizzato oppure non è completo. Richiedi un nuovo link qui sotto e apri solo l’ultima email ricevuta.</p>
      {sent ? <p role="status">Richiesta inviata. Controlla la posta e lo spam. Nell’email premi “Reset Password”: non viene inviata una password temporanea.</p> : <form onSubmit={resend}>
        <label>Email<input style={control} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <button style={button} disabled={busy}>{busy ? "Invio…" : "Invia nuovo link"}</button>
      </form>}
    </>}
    {state === "done" && <><p>La nuova password è stata salvata. Puoi entrare nell’app.</p><button style={button} onClick={() => window.location.replace("/")}>Entra in Peacock</button></>}
    {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
  </main>;
}
