const saveCasting = async () => {
    if (!formCasting.brand || !formCasting.tipologia) { showToast("Inserisci brand e tipologia", true); return; }
    const { id, ...castingData } = formCasting;
    if (!castingData.data) castingData.data = null;
    if (id) {
      const { error } = await supabase.from("castings").update(castingData).eq("id", id);
      if (error) { showToast(error.message, true); return; }
      setCastings(prev => prev.map(c => c.id === id ? { ...c, ...castingData } : c));
      showToast("Casting salvato ✓"); setView("castings");
    } else {
      const { data, error } = await supabase.from("castings").insert(castingData).select().single();
      if (error) { showToast(error.message, true); return; }
      if (data) setCastings(prev => [data, ...prev]);
      showToast("Casting salvato ✓"); setView("castings");
      // Invia notifica email a tutti i model
      try {
        const res = await fetch("https://xtpafxourildjnofeulr.supabase.co/functions/v1/notify-casting", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            titolo: castingData.brand + " — " + castingData.tipologia,
            cliente: castingData.brand,
            data_shooting: castingData.data,
            luogo: "",
            compenso: "",
            descrizione: castingData.caratteristiche,
            casting_id: data?.id
          })
        });
        const json = await res.json();
        if (json.ok && json.sent > 0) {
          showToast(`Email inviate a ${json.sent} model ✓`);
        }
      } catch (e) {
        // Non bloccare il flusso se l'invio email fallisce
        console.error("Errore invio email casting:", e);
      }
    }
  };
