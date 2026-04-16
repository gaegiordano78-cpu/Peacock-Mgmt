// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xtpafxourildjnofeulr.supabase.co";
const SUPABASE_KEY = "sb_publishable_u9bT7JY0grFwVFrRnLxkhw_fVI84jIC";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOGO = "https://peacockmodels.com/wp-content/uploads/2025/04/logo-peacock.svg";

export default function AuthCallbackPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.__hideSplash) {
        window.__hideSplash();
      }

      const urlParams = new URLSearchParams(window.location.search);
      const tokenHash = urlParams.get("token_hash");
      const type = urlParams.get("type");

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type,
        });
        if (error) {
          setError("Link non valido o scaduto. Chiedi un nuovo invito.");
          setChecking(false);
          return;
        }
        setReady(true);
        setChecking(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setReady(true);
      } else {
        setError("Link non valido o scaduto. Chiedi un nuovo invito.");
      }
      setChecking(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (password.length < 8) { setError("La password deve avere almeno 8 caratteri"); return; }
    if (password !== confirm) { setError("Le password non coincidono"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => { window.location.href = "/"; }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 400, width: "100%", background: "#fff", padding: 40, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <img src={LOGO} alt="Peacock" style={{ height: 40, display: "block", margin: "0 auto 30px" }} />
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, textAlign: "center" }}>Imposta la tua password</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 24, textAlign: "center", lineHeight: 1.5 }}>
          Scegli una password per accedere all'area riservata di Peacock Models.
        </p>

        {success ? (
          <div style={{ padding: 16, background: "#f0f9f0", color: "#2d6a2d", borderRadius: 6, fontSize: 13, textAlign: "center" }}>
            Password impostata ✓<br/>Reindirizzamento in corso…
          </div>
        ) : checking ? (
          <div style={{ padding: 16, color: "#666", borderRadius: 6, fontSize: 13, textAlign: "center" }}>
            Verifica in corso…
          </div>
        ) : !ready ? (
          <div style={{ padding: 16, background: "#fef2f2", color: "#991b1b", borderRadius: 6, fontSize: 13, textAlign: "center" }}>
            {error}
          </div>
        ) : (
          <>
            <input
              type="password"
              placeholder="Nuova password (min. 8 caratteri)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6, marginBottom: 12, boxSizing: "border-box" }}
            />
            <input
              type="password"
              placeholder="Conferma password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 6, marginBottom: 16, boxSizing: "border-box" }}
            />
            {error && <div style={{ fontSize: 12, color: "#c00", marginBottom: 12 }}>{error}</div>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", padding: "12px", fontSize: 14, background: "#000", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Salvataggio…" : "Imposta password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
