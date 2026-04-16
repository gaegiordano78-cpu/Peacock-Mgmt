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
      // Nasconde lo splash del RootLayout
      if (typeof window !== "undefined" && (window as any).__hideSplash) {
        (window as any).__hideSplash();
      }

      // Caso 1: link di reset/invite col formato ?token_hash=...&type=recovery
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

      // Caso 2: link vecchio formato (hash #access_token=...)
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
    if (password.length < 8) { setError("La
