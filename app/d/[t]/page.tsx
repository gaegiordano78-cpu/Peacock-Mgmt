// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xtpafxourildjnofeulr.supabase.co",
  "sb_publishable_u9bT7JY0grFwVFrRnLxkhw_fVI84jIC"
);

const POLAS = [
  ["pola_primo_piano", "Close-up"],
  ["pola_mezzo_busto", "Half body"],
  ["pola_figura_intera", "Full length"],
  ["pola_profilo_sx", "Profile L"],
  ["pola_profilo_dx", "Profile R"],
  ["pola_mani", "Hands"],
];
const MISURE = [
  ["altezza", "Height"], ["petto", "Chest"], ["vita", "Waist"], ["fianchi", "Hips"],
  ["taglia", "Size"], ["scarpe", "Shoes"], ["occhi", "Eyes"], ["capelli", "Hair"],
];

const css = `
  .dg { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; background: #FFF; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  .dg-wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
  .dg-head { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 22px; border-bottom: 1px solid #111; }
  .dg-head img { height: 34px; }
  .dg-kicker { font-size: 11px; letter-spacing: .18em; text-transform: uppercase; }
  .dg-index { display: flex; flex-wrap: wrap; gap: 6px 18px; padding: 16px 0 0; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; }
  .dg-index a { color: #111; text-decoration: none; border-bottom: 1px solid transparent; }
  .dg-index a:hover { border-color: #111; }
  .dg-model { padding: 44px 0 40px; border-bottom: 1px solid #E6E6E6; scroll-margin-top: 10px; }
  .dg-name { font-size: clamp(30px, 5vw, 54px); font-weight: 700; letter-spacing: -.03em; line-height: 1; margin: 0 0 14px; text-transform: uppercase; }
  .dg-mis { display: flex; flex-wrap: wrap; gap: 4px 20px; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: #111; margin-bottom: 26px; }
  .dg-mis span b { font-weight: 400; color: #8A8A8A; margin-right: 6px; }
  .dg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 980px; }
  .dg-cell { background: #F2F2F2; aspect-ratio: 3/4; overflow: hidden; cursor: zoom-in; position: relative; }
  .dg-cell img, .dg-cell video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .dg-cap { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: #8A8A8A; margin-top: 6px; }
  .dg-vids { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; max-width: 980px; }
  .dg-vids .dg-cell { aspect-ratio: 9/16; cursor: default; background: #000; }
  .dg-vids video { object-fit: contain; }
  .dg-foot { padding: 34px 0 50px; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .dg-foot a { color: #111; }
  .dg-empty { padding: 120px 0; text-align: center; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: #8A8A8A; }
  .dg-lb { position: fixed; inset: 0; background: rgba(255,255,255,.97); z-index: 100; display: flex; align-items: center; justify-content: center; cursor: zoom-out; padding: 20px; }
  .dg-lb img { max-width: 100%; max-height: 100%; object-fit: contain; }
  @media (max-width: 760px) {
    .dg-grid { grid-template-columns: repeat(2, 1fr); }
    .dg-vids { grid-template-columns: repeat(2, 1fr); }
    .dg-model { padding: 32px 0 30px; }
  }
`;

export default function Digitals({ params }) {
  const [models, setModels] = useState(null);
  const [zoom, setZoom] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.__hideSplash) window.__hideSplash();
    const tokens = decodeURIComponent(params.t || "").split(/[,.\s]+/).filter(Boolean).slice(0, 40);
    supabase.rpc("get_digitals", { p_tokens: tokens }).then(({ data }) => setModels(Array.isArray(data) ? data : []));
  }, [params.t]);

  const multi = models && models.length > 1;

  return (
    <div className="dg">
      <style>{css}</style>
      <div className="dg-wrap">
        <header className="dg-head">
          <img src="/logo-peacock.png" alt="Peacock Models" />
          <div className="dg-kicker">Digitals{multi ? ` · ${models.length} talents` : ""}</div>
        </header>
        {multi && (
          <nav className="dg-index">
            {models.map(m => <a key={m.token} href={`#${m.token}`}>{m.nome}</a>)}
          </nav>
        )}
        {models === null && <div className="dg-empty">Loading</div>}
        {models && models.length === 0 && <div className="dg-empty">Link not available</div>}
        {models && models.map(m => {
          const mis = MISURE.filter(([k]) => m[k]);
          const pol = POLAS.filter(([k]) => m[k]);
          const vids = ["video_1", "video_2", "video_3"].filter(k => m[k]);
          return (
            <section className="dg-model" id={m.token} key={m.token}>
              <h1 className="dg-name">{m.nome}</h1>
              {mis.length > 0 && (
                <div className="dg-mis">
                  {mis.map(([k, l]) => <span key={k}><b>{l}</b>{m[k]}</span>)}
                </div>
              )}
              {pol.length > 0 && (
                <div className="dg-grid">
                  {pol.map(([k, l]) => (
                    <div key={k}>
                      <div className="dg-cell" onClick={() => setZoom(m[k])}>
                        <img src={m[k]} alt={`${m.nome} — ${l}`} loading="lazy" />
                      </div>
                      <div className="dg-cap">{l}</div>
                    </div>
                  ))}
                </div>
              )}
              {vids.length > 0 && (
                <div className="dg-vids">
                  {vids.map(k => (
                    <div className="dg-cell" key={k}>
                      <video src={m[k]} controls playsInline preload="metadata" />
                    </div>
                  ))}
                </div>
              )}
              {pol.length === 0 && vids.length === 0 && <div className="dg-cap">Digitals coming soon</div>}
            </section>
          );
        })}
        <footer className="dg-foot">
          <span>Peacock Models MGMT — Bari, Italy</span>
          <a href="mailto:casting@peacockmodels.com">casting@peacockmodels.com</a>
        </footer>
      </div>
      {zoom && <div className="dg-lb" onClick={() => setZoom("")}><img src={zoom} alt="" /></div>}
    </div>
  );
}
