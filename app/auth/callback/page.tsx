// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xtpafxourildjnofeulr.supabase.co";
const SUPABASE_KEY = "sb_publishable_u9bT7JY0grFwVFrRnLxkhw_fVI84jIC";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LOGO = "https://peacockmodels.com/wp-content/uploads/2025/04/logo-peacock.svg";

export default function AuthCallback() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase inserisce il token nell'hash dell'URL
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Processa il token dall'URL
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
  }, []);

  const handleSetPassword = async () => {
    if (!password) { setError("Inserisci una password"); return; }
    if (password.length < 6) { setError("Password minimo 6 caratteri"); return; }
    if (password !== confirm) { setError("Le password non coincidono"); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => { window.location.href = "/"; }, 2000);
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#F7F3EE", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <img src={LOGO} alt="Peacock" style={{ height: 56, objectFit: "contain" }} />
      </div>

      {done ? (
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 20, padding: "28px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#16A34A" }}>Password creata!</div>
          <div style={{ fontSize: 13, color: "#9C948A", marginTop: 8 }}>Accesso in corso...</div>
        </div>
      ) : (
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "28px 24px", border: "1px solid #F0EAE0" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1C1714", marginBottom: 6 }}>Crea la tua password</div>
          <div style={{ fontSize: 13, color: "#9C948A", marginBottom: 24 }}>Benvenuto su Peacock Mgmt — scegli una password per accedere.</div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#DC2626" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9C948A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimo 6 caratteri"
              style={{ width: "100%", background: "#FAFAF8", border: "1.5px solid #EAE4DC", borderRadius: 12, color: "#1C1714", fontSize: 16, padding: "12px 14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#9C948A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Conferma password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Ripeti la password"
              style={{ width: "100%", background: "#FAFAF8", border: "1.5px solid #EAE4DC", borderRadius: 12, color: "#1C1714", fontSize: 16, padding: "12px 14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
          </div>

          <button onClick={handleSetPassword} disabled={loading}
            style={{ width: "100%", padding: "15px", background: loading ? "#E5E0D8" : "#1C1714", border: "none", borderRadius: 16, color: "#FFF", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Salvataggio..." : "Accedi a Peacock"}
          </button>
        </div>
      )}
    </div>
  );
}
