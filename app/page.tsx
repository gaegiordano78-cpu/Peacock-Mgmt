// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://xtpafxourildjnofeulr.supabase.co";
const SUPABASE_KEY = "sb_publishable_u9bT7JY0grFwVFrRnLxkhw_fVI84jIC";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const LOGO = "https://peacockmodels.com/wp-content/uploads/2025/04/logo-peacock.svg";
const LOGO_SPLASH = "/logo-peacock.png";
// ── DATI ────────────────────────────────────────────────────────────────────
const initialModelle = [
  { id: "m1", nome: "Abir Aouidet", tipo: "Advance", scadenza: "", polas: "" },
  { id: "m2", nome: "Alessandro Mincuzzi", tipo: "Start", scadenza: "", polas: "" },
  { id: "m3", nome: "Alessia Kuli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m4", nome: "Alice Leccese", tipo: "Start", scadenza: "", polas: "" },
  { id: "m5", nome: "Alice Penza", tipo: "Start", scadenza: "", polas: "" },
  { id: "m6", nome: "Amedeo D\'Amicis", tipo: "Start", scadenza: "", polas: "" },
  { id: "m7", nome: "Andres Chen", tipo: "Start", scadenza: "", polas: "" },
  { id: "m8", nome: "Angela Tesoro", tipo: "Start", scadenza: "", polas: "" },
  { id: "m9", nome: "Angelica Facchini", tipo: "Start", scadenza: "", polas: "" },
  { id: "m10", nome: "Angelica", tipo: "Start", scadenza: "", polas: "" },
  { id: "m11", nome: "Anji", tipo: "Start", scadenza: "", polas: "" },
  { id: "m12", nome: "Aramee", tipo: "Start", scadenza: "", polas: "" },
  { id: "m13", nome: "Arianna Pozzi", tipo: "Start", scadenza: "", polas: "" },
  { id: "m14", nome: "Aziz", tipo: "Start", scadenza: "", polas: "" },
  { id: "m15", nome: "Bakary Manneh", tipo: "Start", scadenza: "", polas: "" },
  { id: "m16", nome: "Bernardo Coletta", tipo: "Advance", scadenza: "", polas: "" },
  { id: "m17", nome: "Brian Barbosa", tipo: "Start", scadenza: "", polas: "" },
  { id: "m18", nome: "Camilla Procopio", tipo: "Start", scadenza: "", polas: "" },
  { id: "m19", nome: "Claudia Cassano", tipo: "Start", scadenza: "", polas: "" },
  { id: "m20", nome: "Claudio Battista", tipo: "Start", scadenza: "", polas: "" },
  { id: "m21", nome: "Colette Ventura", tipo: "Start", scadenza: "", polas: "" },
  { id: "m22", nome: "Baldassarre Antonio Lucarelli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m23", nome: "Linda", tipo: "Start", scadenza: "", polas: "" },
  { id: "m24", nome: "Regjane Iyeyemi", tipo: "Start", scadenza: "", polas: "" },
  { id: "m25", nome: "Gloire Di Gioia", tipo: "Start", scadenza: "", polas: "" },
  { id: "m26", nome: "Michele De Pinto", tipo: "Start", scadenza: "", polas: "" },
  { id: "m27", nome: "Dalila Varallo", tipo: "Advance", scadenza: "", polas: "" },
  { id: "m28", nome: "Dani Leone", tipo: "Start", scadenza: "", polas: "" },
  { id: "m29", nome: "Daniele Corsa", tipo: "Start", scadenza: "", polas: "" },
  { id: "m30", nome: "Danilo Mele", tipo: "Start", scadenza: "", polas: "" },
  { id: "m31", nome: "Davide Poliseno", tipo: "Start", scadenza: "", polas: "" },
  { id: "m32", nome: "Destini Osaro", tipo: "Start", scadenza: "", polas: "" },
  { id: "m33", nome: "Edoardo Sonzogni", tipo: "Start", scadenza: "", polas: "" },
  { id: "m34", nome: "Elisa Ferrenti", tipo: "Start", scadenza: "", polas: "" },
  { id: "m35", nome: "Emily", tipo: "Start", scadenza: "", polas: "" },
  { id: "m36", nome: "Emma", tipo: "Start", scadenza: "", polas: "" },
  { id: "m37", nome: "Emmanuel", tipo: "Start", scadenza: "", polas: "" },
  { id: "m38", nome: "Fabrizia Da Lima", tipo: "Start", scadenza: "", polas: "" },
  { id: "m39", nome: "Fabrizio Tagarielli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m40", nome: "Federica Muggeo", tipo: "Advance", scadenza: "", polas: "" },
  { id: "m41", nome: "Federica Semeraro", tipo: "Start", scadenza: "", polas: "" },
  { id: "m42", nome: "Flavio", tipo: "Start", scadenza: "", polas: "" },
  { id: "m43", nome: "Francesca Coppa", tipo: "Start", scadenza: "", polas: "" },
  { id: "m44", nome: "Francesco D\'Onghia", tipo: "Start", scadenza: "", polas: "" },
  { id: "m45", nome: "Gabriele Lagattolla", tipo: "Start", scadenza: "", polas: "" },
  { id: "m46", nome: "Giacomo Cascella", tipo: "Start", scadenza: "", polas: "" },
  { id: "m47", nome: "Giuseppe Bavaro", tipo: "Start", scadenza: "", polas: "" },
  { id: "m48", nome: "Hessein", tipo: "Start", scadenza: "", polas: "" },
  { id: "m49", nome: "Hoara Rizzi", tipo: "Start", scadenza: "", polas: "" },
  { id: "m50", nome: "Ilaria Pedone", tipo: "Start", scadenza: "", polas: "" },
  { id: "m51", nome: "Irene Meo", tipo: "Start", scadenza: "", polas: "" },
  { id: "m52", nome: "Isabella Lapenna", tipo: "Start", scadenza: "", polas: "" },
  { id: "m53", nome: "Ivan Lo Buono", tipo: "Start", scadenza: "", polas: "" },
  { id: "m54", nome: "Jonathan Mancini", tipo: "Start", scadenza: "", polas: "" },
  { id: "m55", nome: "Laura Manginelli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m56", nome: "Letizia Giannoccaro", tipo: "Advance", scadenza: "", polas: "" },
  { id: "m57", nome: "Lorenza Loizzo", tipo: "Start", scadenza: "", polas: "" },
  { id: "m58", nome: "Luca Labianca", tipo: "Start", scadenza: "", polas: "" },
  { id: "m59", nome: "Lucia Falcicchio", tipo: "Start", scadenza: "", polas: "" },
  { id: "m60", nome: "Luciana Cornacchia", tipo: "Start", scadenza: "", polas: "" },
  { id: "m61", nome: "Ludovica Attanasi", tipo: "Start", scadenza: "", polas: "" },
  { id: "m62", nome: "Marco Attanasio", tipo: "Start", scadenza: "", polas: "" },
  { id: "m63", nome: "Marco Vinci", tipo: "Start", scadenza: "", polas: "" },
  { id: "m64", nome: "Maria Luce La Torre", tipo: "Start", scadenza: "", polas: "" },
  { id: "m65", nome: "Mariangela Frascati", tipo: "Start", scadenza: "", polas: "" },
  { id: "m66", nome: "Marianna Felicetti", tipo: "Advance", scadenza: "", polas: "" },
  { id: "m67", nome: "Matteo Marasciulo", tipo: "Top", scadenza: "", polas: "" },
  { id: "m68", nome: "Mauro Racanati", tipo: "Start", scadenza: "", polas: "" },
  { id: "m69", nome: "Mia Montanaro", tipo: "Start", scadenza: "", polas: "" },
  { id: "m70", nome: "Michele Garofalo", tipo: "Start", scadenza: "", polas: "" },
  { id: "m71", nome: "Miriam Colamonaco", tipo: "Start", scadenza: "", polas: "" },
  { id: "m72", nome: "Miriana", tipo: "Start", scadenza: "", polas: "" },
  { id: "m73", nome: "Mirko Cardinale", tipo: "Start", scadenza: "", polas: "" },
  { id: "m74", nome: "Morgana Balzarotti", tipo: "Start", scadenza: "", polas: "" },
  { id: "m75", nome: "Nicole Le Grottaglie", tipo: "Start", scadenza: "", polas: "" },
  { id: "m76", nome: "Nicoletta Pentrelli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m77", nome: "Nicolo Provino", tipo: "Start", scadenza: "", polas: "" },
  { id: "m78", nome: "Noemi Vallarelli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m79", nome: "Nunzio Patella", tipo: "Start", scadenza: "", polas: "" },
  { id: "m80", nome: "Paola Porreca", tipo: "Start", scadenza: "", polas: "" },
  { id: "m81", nome: "Rachele Rivoli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m82", nome: "Rosalinda Pestrichella", tipo: "Start", scadenza: "", polas: "" },
  { id: "m83", nome: "Rosangela", tipo: "Start", scadenza: "", polas: "" },
  { id: "m84", nome: "Sahra Nashi", tipo: "Start", scadenza: "", polas: "" },
  { id: "m85", nome: "Salliou", tipo: "Start", scadenza: "", polas: "" },
  { id: "m86", nome: "Scarlett Olivia", tipo: "Start", scadenza: "", polas: "" },
  { id: "m87", nome: "Serena Penelope", tipo: "Start", scadenza: "", polas: "" },
  { id: "m88", nome: "Simona Lapenna", tipo: "Start", scadenza: "", polas: "" },
  { id: "m89", nome: "Simona Possidente", tipo: "Start", scadenza: "", polas: "" },
  { id: "m90", nome: "Sofia Roselli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m91", nome: "Tatiane Danila Contu", tipo: "Advance", scadenza: "", polas: "" },
  { id: "m92", nome: "Tetiana Shmulaieva", tipo: "Start", scadenza: "", polas: "" },
  { id: "m93", nome: "Valeria Ragone", tipo: "Start", scadenza: "", polas: "" },
  { id: "m94", nome: "Valerio Perrotta", tipo: "Start", scadenza: "", polas: "" },
  { id: "m95", nome: "Vanni Gramegna", tipo: "Start", scadenza: "", polas: "" },
  { id: "m96", nome: "Verdiana Coluccia", tipo: "Start", scadenza: "", polas: "" },
  { id: "m97", nome: "Veronica Mininni", tipo: "Start", scadenza: "", polas: "" },
  { id: "m98", nome: "Vincenzo Giordanelli", tipo: "Start", scadenza: "", polas: "" },
  { id: "m99", nome: "Viviana", tipo: "Start", scadenza: "", polas: "" },
  { id: "m100", nome: "Claudia Lo Cascio", tipo: "Start", scadenza: "", polas: "" },
  { id: "m101", nome: "Donato De Lucia", tipo: "Start", scadenza: "", polas: "" }
];
const initialJobs = [
  { id: 1, titolo: "Editorial Summer", cliente: "Modo Magazine",   modella: "Sofia Amendolara", data_shooting: "2026-04-12", luogo: "Studio Bari, Via Sparano 14", fatturato: 320, netto_model: 200, rimborso: 0,  stato_job: "confermato", stato_pagamento: "da pagare", data_pagamento_cliente: "", note: "" },
  { id: 2, titolo: "Lookbook SS26",    cliente: "Oriana Studio",   modella: "Giulia Ferrante",  data_shooting: "2026-04-20", luogo: "Lecce, masseria zona Sud",  fatturato: 450, netto_model: 280, rimborso: 40, stato_job: "in attesa",  stato_pagamento: "da pagare", data_pagamento_cliente: "", note: "Conferma entro 5 apr" },
  { id: 3, titolo: "Campagna Social",  cliente: "Masseria Priori", modella: "Sofia Amendolara", data_shooting: "2026-03-05", luogo: "Fasano (BR)",               fatturato: 280, netto_model: 180, rimborso: 0,  stato_job: "completato", stato_pagamento: "pagato",    data_pagamento_cliente: "2026-03-20", note: "" },
  { id: 4, titolo: "TVC Spot",         cliente: "Brand XYZ",       modella: "Chiara Monti",     data_shooting: "2026-04-10", luogo: "Bari",                      fatturato: 600, netto_model: 400, rimborso: 80, stato_job: "completato", stato_pagamento: "da pagare", data_pagamento_cliente: "", note: "" },
];
// Nuova logica: netto_model inserito manualmente; lordo/ritenuta derivati per ritenuta PDF.
const calcLordo           = j => (Number(j.netto_model) || 0) / 0.8;
const calcRitenuta        = j => calcLordo(j) * 0.2;
const calcNetto           = j => Number(j.netto_model) || 0;
const calcDaPagareModel   = j => (Number(j.netto_model) || 0) + (Number(j.rimborso) || 0);
const calcGuadagnoPeacock = j => (Number(j.fatturato) || 0) - (Number(j.netto_model) || 0) - (Number(j.rimborso) || 0);
const fmt     = n => n === 0 ? "—" : `€${Number(n).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = d => { if (!d) return "—"; const [y, m, g] = d.split("-"); return `${g}/${m}/${y}`; };
// Contratto helpers
const CONTRATTO_COLORS = { Start: { color: "#7C3AED", bg: "#F5F3FF" }, Advance: { color: "#D97706", bg: "#FFFBEB" }, Top: { color: "#000000", bg: "#FEF2F2" } };
const contrattoScadenzaAlert = (scadenza) => {
  if (!scadenza) return null;
  const [g, m, a] = scadenza.split("/");
  const diff = (new Date(`${a}-${m}-${g}`).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "scaduto";
  if (diff <= 30) return "in scadenza";
  return null;
};
const PAG_COLOR = { pagato: "#4a8a4a", "da pagare": "#888888", "in attesa": "#C9A96E" };
const PAG_BG    = { pagato: "#F5F5F5", "da pagare": "#F5F5F5", "in attesa": "#F5F5F5" };
const JOB_COLOR = { confermato: "#000000", "in attesa": "#000000", completato: "#767676", interno: "#000000" };
const JOB_BG    = { confermato: "#F5F5F5", "in attesa": "#F5F5F5", completato: "#F5F5F5", interno: "#F5F5F5" };
const emptyJob = { id: null, titolo: "", cliente: "", modella: initialModelle[0].nome, data_shooting: "", call_time: "", luogo: "", fatturato: 0, netto_model: 0, rimborso: 0, contatto_referente: "", stato_job: "confermato", stato_pagamento: "da pagare", data_pagamento_cliente: "", note: "" };
const emptyModella = { id: null, nome: "", contratto_tipo: "Start", contratto_scadenza: "", polas: "", foto_profilo: "", cf: "", data_nascita: "", luogo_nascita: "", indirizzo: "", citta: "", cap: "", banca: "", intestato_a: "", iban: "" };
const emptyCasting = { id: null, genere: "donna", data: "", brand: "", tipologia: "", caratteristiche: "" };
// ── GOOGLE CALENDAR ──────────────────────────────────────────────────────────
function apriCalendar(job, tipo) {
  const dataBase = job.data_shooting;
  if (!dataBase) { alert("Data shooting mancante"); return; }
  const toGcalDate = (iso, time) => iso.replace(/-/g, "") + "T" + time.replace(/:/g, "") + "00";
  let title, details, start, end;
  if (tipo === "shooting") {
    title   = "📷 Shooting: " + job.titolo;
    details = "Cliente: " + job.cliente + " | Modella: " + job.modella + " | Luogo: " + job.luogo;
    start   = toGcalDate(dataBase, "09:00");
    end     = toGcalDate(dataBase, "18:00");
  } else if (tipo === "promemoria") {
    const d = new Date(dataBase); d.setDate(d.getDate() - 1);
    const gp = d.toISOString().split("T")[0];
    title   = "💬 WA → " + job.modella.split(" ")[0] + " — " + job.titolo;
    details = "Domani shooting con " + job.cliente + " — " + job.luogo;
    start   = toGcalDate(gp, "19:00");
    end     = toGcalDate(gp, "19:15");
  } else {
    const oggi = new Date().toISOString().split("T")[0];
    title   = "💸 Paga " + job.modella.split(" ")[0];
    details = "Job: " + job.titolo;
    start   = toGcalDate(oggi, "10:00");
    end     = toGcalDate(oggi, "10:30");
  }
  const url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
    + "&text=" + encodeURIComponent(title)
    + "&details=" + encodeURIComponent(details)
    + "&dates=" + start + "/" + end
    + "&ctz=Europe/Rome";
  window.open(url, "_blank");
}
// ── GENERATORE CONTRATTO ─────────────────────────────────────────────────────
function generaContratto(job, modella) {
  const oggi = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const netto = calcNetto(job);
  const rimb = job.rimborso > 0 ? ` + spese trasporto €${job.rimborso.toFixed(2)}` : "";
  const dataJob = fmtDate(job.data_shooting);
  return `CONTRATTO DI INCARICO PER MODELLO/A
Tra:
L\'Agenzia Peacock Models Mgmt, con sede in Bari, in via Giacomo Matteotti, 16, rappresentata dal Sig. Gaetano Giordano
e
Il/La Sig./Sig.ra ${modella.nome}, nato/a il ${modella.data_nascita} a ${modella.luogo_nascita}, C.F. ${modella.cf}, residente in ${modella.indirizzo}, (di seguito "Modello/a"),
SI CONVIENE E SI STIPULA QUANTO SEGUE:
Art. 1 – Oggetto del contratto
Il/La Modello/a si impegna a prestare la propria immagine e collaborazione per il lavoro di shooting fotografico per il cliente ${job.cliente} presso ${job.luogo}, previsto per il giorno ${dataJob}, per conto dell\'Agenzia.
Art. 2 – Compenso
Il compenso pattuito per la prestazione è pari a €${netto.toFixed(2)} netti${rimb}, che verrà corrisposto tramite bonifico bancario a pagamento ricevuto dal cliente.
Art. 3 – Diritti di utilizzo delle immagini
Il/La Modello/a autorizza l\'uso delle proprie immagini e riprese realizzate durante il lavoro per finalità editoriali, pubblicitarie, promozionali e commerciali, su qualsiasi supporto e territorio, da parte dell\'Agenzia e/o del Cliente finale.
Art. 4 – Obblighi del/della Modello/a
Il/La Modello/a si impegna a:
- presentarsi puntualmente al lavoro;
- mantenere un comportamento professionale;
- rispettare le indicazioni fornite;
- non divulgare informazioni riservate.
Art. 5 – Obblighi dell\'Agenzia
L\'Agenzia si impegna a:
- fornire tutte le informazioni necessarie;
- garantire un ambiente di lavoro sicuro e rispettoso;
- tutelare i diritti d\'immagine del Modello/a.
Art. 6 – Recesso
Ciascuna parte può recedere con almeno 3 giorni di preavviso, salvo cause di forza maggiore.
Art. 7 – Trattamento dei dati personali
Ai sensi del GDPR, le parti autorizzano il trattamento dei dati per finalità contrattuali.
──────────────────────────────────────
LIBERATORIA PER L\'USO DELL\'IMMAGINE
Io sottoscritta ${modella.nome}, nato/a il ${modella.data_nascita} a ${modella.luogo_nascita}, C.F. ${modella.cf}, residente in ${modella.indirizzo},
AUTORIZZO
L\'Agenzia Peacock Models Mgmt ad utilizzare le immagini fotografiche, video o altri materiali audiovisivi che mi ritraggono, realizzati in occasione del lavoro indicato nel presente contratto.
L\'uso potrà includere: social media e siti web.
Dichiaro di non avere nulla a pretendere oltre al compenso pattuito nel contratto di incarico.
Luogo e data: Bari, ${oggi}
Firma Modello/a: _______________________________
Firma Agenzia: _______________________________`;
}
// ── GENERATORE RITENUTA ─────────────────────────────────────────────────────
function generaRitenuta(job, modella, numRitenuta, descrizione, dataInizio, dataFine) {
  const oggi = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const lordo = calcLordo(job);
  const ritenuta = calcRitenuta(job);
  const netto = calcNetto(job);
  return `MODULO DI RITENUTA D'ACCONTO                                    Ritenuta n° ${numRitenuta}
Dati del prestatore (lavoratore):
Nome e Cognome:    ${modella.nome}
Codice Fiscale:    ${modella.cf || "_______________"}
Indirizzo:         ${modella.indirizzo || "_______________"}
Città:             ${modella.citta || "_______________"}    Cap: ${modella.cap || "_____"}
Telefono:          ${modella.telefono || "_______________"}
Email:             ${modella.email || "_______________"}
Dati del committente (azienda / privato):
Ragione Sociale / Nome e Cognome: Peacock Mgmt di Gaetano Giordano
Indirizzo: Via Giacomo Matteotti Cap: 70121 Bari (Ba)
Partita IVA: IT 07164570728
Oggetto della prestazione:
Descrizione:             ${descrizione || "Model"}
Data della prestazione:  ${dataInizio}${dataFine ? " al " + dataFine : ""}
Compenso e ritenuta:
Compenso lordo pattuito:                    ${lordo.toFixed(2)}€
Ritenuta d'acconto (20% su compenso lordo): ${ritenuta.toFixed(2)}€
Compenso netto da corrispondere:            ${netto.toFixed(2)}€
Coordinate Bancarie del prestatore:
Banca:        ${modella.banca || "_______________"}
Account holder:  ${modella.intestato_a || modella.nome}
IBAN:         ${modella.iban || "_______________"}
Dichiarazione del prestatore per redditi d'importo non superiore a 5.000€:
Ai sensi della Legge 335/1995 e dell'art. 44, comma 2, della Legge 24 Novembre 2003 N.326 di conversione del Decreto Legge 269/2003:
Il sottoscritto dichiara che ha fino ad ora percepito, nel corso del periodo d'imposta ${new Date().getFullYear()}, redditi d'importo non superiore ad € 5.000,00 per attività di lavoro autonomo occasionale, a fronte di un unico o di una pluralità di rapporti, (di cui all'art.67 – precedente art.81 – comma 1, lettera l DPR, 917/1986) e pertanto invita codesta amministrazione a tenere conto di tale informazione agli effetti della trattenuta contributiva INPS.
Si impegna a comunicare l'eventuale superamento del limite di € 5.000,00 al fine di permettere l'applicazione della ritenuta e di consentire all'Ente il versamento degli importi dovuti.
In difetto si dichiara disponibile a sostenere integralmente i relativi costi in misura intera sollevando codesta Società da oneri e responsabilità per l'omesso involontario versamento alla gestione separata INPS.
Data: ${oggi}                    Firma del prestatore: _______________________________`;
}
// ── GENERATORE RITENUTA HTML (per PDF) ──────────────────────────────────────
function generaRitenutaHTML(job, modella, numRitenuta, descrizione, dataInizio, dataFine) {
  const oggi = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  const lordo = calcLordo(job);
  const ritenuta = calcRitenuta(job);
  const netto = calcNetto(job);
  const anno = new Date().getFullYear();
  const esc = (s) => String(s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ritenuta d'acconto - ${esc(modella.nome)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, "Times New Roman", serif; font-size: 13px; color: #000; padding: 36px 48px; line-height: 1.55; }
    .head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
    .head h1 { font-size: 18px; letter-spacing: 0.02em; font-weight: 700; }
    .head .num { font-size: 13px; text-align: right; }
    .head .num strong { font-size: 16px; display: block; margin-top: 2px; }
    h2 { font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; margin: 18px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #999; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
    td { padding: 4px 0; vertical-align: top; font-size: 13px; }
    td.lbl { width: 42%; color: #555; }
    td.val { width: 58%; color: #000; }
    .compensi td { padding: 8px 12px; border-bottom: 1px solid #ddd; font-size: 14px; }
    .compensi tr:last-child td { border-bottom: none; border-top: 2px solid #000; font-weight: 700; }
    .compensi td.importo { text-align: right; font-weight: 700; }
    .dich { margin-top: 22px; padding: 14px; background: #f7f7f7; font-size: 12px; line-height: 1.55; text-align: justify; }
    .dich p { margin-bottom: 8px; }
    .firma { margin-top: 24px; display: flex; justify-content: space-between; font-size: 13px; }
    .firma .linea { border-bottom: 1px solid #000; min-width: 260px; display: inline-block; margin-left: 8px; padding-bottom: 2px; }
    @media print {
      body { padding: 20px 28px; }
      @page { margin: 1cm; size: A4; }
    }
  </style></head><body>
    <div class="head">
      <h1>RITENUTA D'ACCONTO</h1>
      <div class="num"><span>Ritenuta n°</span><strong>${esc(numRitenuta)}</strong></div>
    </div>

    <h2>Prestatore</h2>
    <table>
      <tr><td class="lbl">Nome e Cognome</td><td class="val"><strong>${esc(modella.nome)}</strong></td></tr>
      <tr><td class="lbl">Codice Fiscale</td><td class="val">${esc(modella.cf || "_______________")}</td></tr>
      <tr><td class="lbl">Indirizzo</td><td class="val">${esc(modella.indirizzo || "_______________")}</td></tr>
      <tr><td class="lbl">Città / CAP</td><td class="val">${esc(modella.citta || "_______________")} — ${esc(modella.cap || "_____")}</td></tr>
      <tr><td class="lbl">Telefono</td><td class="val">${esc(modella.telefono || "_______________")}</td></tr>
      <tr><td class="lbl">Email</td><td class="val">${esc(modella.email || "_______________")}</td></tr>
    </table>

    <h2>Committente</h2>
    <table>
      <tr><td class="lbl">Ragione Sociale</td><td class="val">Peacock Mgmt di Gaetano Giordano</td></tr>
      <tr><td class="lbl">Indirizzo</td><td class="val">Via Giacomo Matteotti, 70121 Bari (BA)</td></tr>
      <tr><td class="lbl">Partita IVA</td><td class="val">IT 07164570728</td></tr>
    </table>

    <h2>Oggetto della prestazione</h2>
    <table>
      <tr><td class="lbl">Descrizione</td><td class="val">${esc(descrizione || "Model")}</td></tr>
      <tr><td class="lbl">Data prestazione</td><td class="val">${esc(dataInizio)}${dataFine ? " al " + esc(dataFine) : ""}</td></tr>
    </table>

    <h2>Compenso</h2>
    <table class="compensi">
      <tr><td>Compenso lordo pattuito</td><td class="importo">${lordo.toFixed(2)} €</td></tr>
      <tr><td>Ritenuta d'acconto (20% su compenso lordo)</td><td class="importo">${ritenuta.toFixed(2)} €</td></tr>
      <tr><td>Compenso netto da corrispondere</td><td class="importo">${netto.toFixed(2)} €</td></tr>
    </table>

    <h2>Coordinate bancarie</h2>
    <table>
      <tr><td class="lbl">Banca</td><td class="val">${esc(modella.banca || "_______________")}</td></tr>
      <tr><td class="lbl">Intestatario</td><td class="val">${esc(modella.intestato_a || modella.nome)}</td></tr>
      <tr><td class="lbl">IBAN</td><td class="val"><strong>${esc(modella.iban || "_______________")}</strong></td></tr>
    </table>

    <div class="dich">
      <p><strong>Dichiarazione del prestatore per redditi d'importo non superiore a 5.000€</strong></p>
      <p>Ai sensi della Legge 335/1995 e dell'art. 44, comma 2, della Legge 24 Novembre 2003 N.326 di conversione del Decreto Legge 269/2003:</p>
      <p>Il sottoscritto dichiara che ha fino ad ora percepito, nel corso del periodo d'imposta ${anno}, redditi d'importo non superiore ad € 5.000,00 per attività di lavoro autonomo occasionale, a fronte di un unico o di una pluralità di rapporti, (di cui all'art.67 – precedente art.81 – comma 1, lettera l DPR, 917/1986) e pertanto invita codesta amministrazione a tenere conto di tale informazione agli effetti della trattenuta contributiva INPS.</p>
      <p>Si impegna a comunicare l'eventuale superamento del limite di € 5.000,00 al fine di permettere l'applicazione della ritenuta e di consentire all'Ente il versamento degli importi dovuti. In difetto si dichiara disponibile a sostenere integralmente i relativi costi in misura intera sollevando codesta Società da oneri e responsabilità per l'omesso involontario versamento alla gestione separata INPS.</p>
    </div>

    <div class="firma">
      <div>Data: <strong>${oggi}</strong></div>
      <div>Firma del prestatore <span class="linea"></span></div>
    </div>
  </body></html>`;
}
// ── GENERATORE CALL SHEET ────────────────────────────────────────────────────
function generaCallSheet(job) {
  const dataIT = (() => {
    if (!job.data_shooting) return "";
    const [y, m, g] = job.data_shooting.split("-");
    return `${g}/${m}/${y}`;
  })();
  const netto = Number(job.netto_model) || 0;
  const rimb  = Number(job.rimborso) || 0;
  const feeStr = netto > 0
    ? (rimb > 0
      ? `${netto} euro netti + rimborso spese ${rimb} euro (gestito tramite agenzia)`
      : `${netto} euro netti (gestiti tramite agenzia)`)
    : "";
  return `📸 CALL SHEET — MODELS

PRODUZIONE: ${job.cliente || ""}
TIPO SHOOT: ${job.titolo || ""}
DATA: ${dataIT}
CALL TIME: ${job.call_time || ""}
FEE: ${feeStr}
⸻
📍 LOCATION ${job.luogo || ""}
⸻
👗 STYLING & PREP • Capelli puliti (no prodotti pesanti) • Unghie naturali • Mani e piedi curati • Pelle curata (evitare segni evidenti di elastici o abiti stretti) • No abbronzature recenti o segni di costume • Mantenere il look coerente con la propria scheda (foto recenti) • Portare underwear neutro (nude/nero) • No trucco (se previsto MUA in loco)
⸻
📱 COMPORTAMENTO SUL SET • Durante lo shooting manteniamo il focus sul lavoro, evitando l'uso del telefono • Il telefono può essere utilizzato durante le pause • Eventuali stories/post solo dopo approvazione del brand • Tag: @peacockmodelsmgmt • Attitudine collaborativa e reattiva alle indicazioni del team • Per questioni economiche, fare riferimento esclusivamente all'agenzia
⸻
📞 CONTATTI ${job.contatto_referente || ""}
⸻
⚠️ NOTE • Si raccomanda puntualità • Indicare eventuali allergie o intolleranze • Per eventuali rimborsi (benzina/treno) è necessario conservare copia dello scontrino o del biglietto • Seguire le indicazioni del team creativo

Buon lavoro ✨`;
}
// ── UI COMPONENTS ────────────────────────────────────────────────────────────
const Badge = ({ label, color, bg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color, background: bg, border: `1px solid ${color}22` }}>{label}</span>
);
const Chip = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 100, fontSize: 17, fontWeight: active ? 600 : 400, cursor: "pointer", border: active ? "1.5px solid #1C1714" : "1.5px solid #E5E0D8", background: active ? "#1C1714" : "transparent", color: active ? "#FFF" : "#6B6560", fontFamily: "inherit", transition: "all 0.15s" }}>{children}</button>
);
const Divider = () => <div style={{ height: 1, background: "#F5EFE8", margin: "0" }} />;
const InfoRow = ({ label, val }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0" }}>
    <span style={{ fontSize: 16, color: "#767676", flexShrink: 0, marginRight: 12 }}>{label}</span>
    <span style={{ fontSize: 16, color: "#000000", textAlign: "right", wordBreak: "break-all" }}>{val || "—"}</span>
  </div>
);
const CalcRow = ({ label, val, bold, big }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
    <span style={{ fontSize: bold ? 13 : 12, fontWeight: bold ? 600 : 400, color: bold ? "#1C1714" : "#9C948A" }}>{label}</span>
    <span style={{ fontSize: big ? 20 : bold ? 13 : 12, fontWeight: big ? 800 : bold ? 600 : 400, color: "#000000", letterSpacing: big ? "-0.03em" : "0" }}>{val}</span>
  </div>
);
const Section = ({ title, children, action }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#767676", textTransform: "uppercase" }}>{title}</div>
      {action}
    </div>
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "0.5px solid #EBEBEB", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      {children}
    </div>
  </div>
);
const PaddedSection = ({ title, children, action }) => (
  <Section title={title} action={action}>
    <div style={{ padding: "4px 16px 8px" }}>{children}</div>
  </Section>
);
const Field = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "inherit" }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""}
      style={{ width: "100%", background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 12, color: "#000000", fontSize: 17, padding: "13px 15px", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
  </div>
);
const SelectField = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "inherit" }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 12, color: "#000000", fontSize: 16, padding: "10px 14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none", appearance: "none" }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);
const CalBtn = ({ icon, label, sub, onClick, loading }) => (
  <button onClick={onClick} disabled={loading}
    style={{ width: "100%", marginBottom: 8, padding: "12px 14px", background: loading ? "#F5F0EA" : "#FAFAF8", border: "0.5px solid #EBEBEB", borderRadius: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "inherit" }}>
    <span style={{ fontSize: 20 }}>{loading ? "⏳" : icon}</span>
    <div style={{ textAlign: "left", flex: 1 }}>
      <div style={{ fontSize: 17, fontWeight: 500, color: "#000000" }}>{label}</div>
      <div style={{ fontSize: 10, color: "#767676", marginTop: 1 }}>{sub}</div>
    </div>
    <span style={{ fontSize: 16, color: "#C4A882", fontWeight: 300 }}>+</span>
  </button>
);
const PrimaryBtn = ({ children, onClick, color = "#1C1714", disabled }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ width: "100%", marginTop: 8, padding: "15px", background: disabled ? "#E5E0D8" : color, border: "none", borderRadius: 16, color: "#FFF", fontSize: 16, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "0.01em" }}>
    {children}
  </button>
);
const GhostBtn = ({ children, onClick }) => (
  <button onClick={onClick}
    style={{ width: "100%", marginTop: 8, padding: "12px", background: "transparent", border: "0.5px solid #EBEBEB", borderRadius: 14, color: "#767676", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
    {children}
  </button>
);
const IMG_MEN   = "https://peacockmodels.com/wp-content/uploads/2026/03/gemini-image-2-non-cambiare-il-modello-metti-soltanto-sfondo-bianco-ottico-con-retroilluminazio-0-4.jpg";
const IMG_WOMEN = "https://peacockmodels.com/wp-content/uploads/2026/03/gemini-image-2-metti-sfondo-bianco-con-retroilluminazione-delicata-1-4.jpg";
// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]         = useState(null);
  const [userRuolo, setUserRuolo] = useState(null);
  const [loginEmail, setLoginEmail]     = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError]     = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [newPassword, setNewPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteEmail, setInviteEmail]   = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [splash, setSplash]     = useState(true);
  const [jobs, setJobs]         = useState([]);
  const [modelle, setModelle]   = useState<any[]>([]);
  const [view, setView]         = useState("lista"); // lista | dettaglio | nuovo_job | calcolatrice | modelle | scheda_modella | nuova_modella | contratto
  const [selectedJob, setSelectedJob]     = useState(null);
  const [selectedModella, setSelectedModella] = useState(null);
  const [formJob, setFormJob]   = useState(emptyJob);
  const [formMod, setFormMod]   = useState(emptyModella);
  const [filtroStato, setFiltroStato] = useState("tutti");
  const [cercaModella, setCercaModella] = useState("");
  const [toast, setToast]       = useState("");
  const [toastErr, setToastErr] = useState(false);
  const [loading, setLoading]   = useState("");
  const [contrattoCopied, setContrattoCopied] = useState(false);
  const [myModella, setMyModella] = useState(null);
  const [ritenutaCopied, setRitenutaCopied] = useState(false);
  const [numRitenuta, setNumRitenuta] = useState("1");
  const [descRitenuta, setDescRitenuta] = useState("Model");
  const [dataInizioRitenuta, setDataInizioRitenuta] = useState("");
  const [dataFineRitenuta, setDataFineRitenuta] = useState("");
  const [castings, setCastings] = useState<any[]>([]);
  const [candidature, setCandidature] = useState<any[]>([]);
  const [formCasting, setFormCasting] = useState(emptyCasting);
  const [selectedCasting, setSelectedCasting] = useState<any>(null);
  const [modelView, setModelView] = useState("home"); // "home" | "profilo" | "job_dettaglio" | "ritenuta_model"
  const [formMyProfile, setFormMyProfile] = useState<any>({});
  const [polaUploading, setPolaUploading] = useState("");
  const [modelSelectedJob, setModelSelectedJob] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.__hideSplash) {
      setTimeout(() => { window.__hideSplash(); setSplash(false); }, 2200);
    } else {
      setTimeout(() => setSplash(false), 2200);
    }
    // Detect invite/recovery tokens in URL hash
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.includes("type=invite") || hash.includes("type=recovery")) {
        setNeedsPassword(true);
      }
    }
    const loadData = async () => {
      const { data: jobsData } = await supabase.from("jobs").select("*").order("data_shooting", { ascending: false });
      if (jobsData) setJobs(jobsData);
      const { data: modelleData } = await supabase.from("modelle").select("*").order("nome");
      if (modelleData && modelleData.length > 0) setModelle(modelleData);
      else setModelle(initialModelle);
      const { data: castingsData } = await supabase.from("castings").select("*").order("created_at", { ascending: false });
      if (castingsData) setCastings(castingsData);
      const { data: candidatureData } = await supabase.from("candidature").select("*");
      if (candidatureData) setCandidature(candidatureData);
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase.from("profiles").select("ruolo").eq("id", session.user.id).single()
          .then(({ data }) => { 
            if (data) {
              setUserRuolo(data.ruolo);
              loadData();
              if (data.ruolo === "model") {
                supabase.from("modelle").select("*").eq("user_id", session.user.id).single()
                  .then(({ data: mod }) => { if (mod) setMyModella(mod); });
              }
            }
          });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY" || _event === "INITIAL_SESSION") {
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hash.includes("type=invite") || hash.includes("type=recovery") || _event === "PASSWORD_RECOVERY") {
          setNeedsPassword(true);
        }
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from("profiles").select("ruolo").eq("id", session.user.id).single()
          .then(({ data }) => { 
            if (data) {
              setUserRuolo(data.ruolo);
              loadData();
              if (data.ruolo === "model") {
                supabase.from("modelle").select("*").eq("user_id", session.user.id).single()
                  .then(({ data: mod }) => { if (mod) setMyModella(mod); });
              }
            }
          });
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const doLogin = async () => {
    setLoginError("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail.trim().toLowerCase(), password: loginPassword });
    if (error) setLoginError("Email o password errati");
    setLoginLoading(false);
  };
  const doSetPassword = async () => {
    if (!newPassword || newPassword.length < 6) { setLoginError("La password deve avere almeno 6 caratteri"); return; }
    if (newPassword !== confirmPassword) { setLoginError("Le password non coincidono"); return; }
    setLoginLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setLoginError(error.message); setLoginLoading(false); return; }
    setNeedsPassword(false);
    setNewPassword("");
    setConfirmPassword("");
    if (typeof window !== "undefined") window.location.hash = "";
    showToast("Password impostata ✓");
    setLoginLoading(false);
  };
  const doLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRuolo(null);
    setSplash(true);
  };
  const doInvite = async (nomeModella) => {
    if (!inviteEmail) { showToast("Inserisci un'email", true); return; }
    setInviteLoading(true);
    try {
      const res = await fetch("https://xtpafxourildjnofeulr.supabase.co/functions/v1/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ email: inviteEmail, nome: nomeModella })
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      showToast("Invito inviato a " + inviteEmail + " ✓");
      setInviteEmail("");
    } catch (e) {
      showToast("Errore: " + e.message, true);
    }
    setInviteLoading(false);
  };
  const showToast = (msg, err = false) => { setToast(msg); setToastErr(err); setTimeout(() => setToast(""), 3000); };
  // Job helpers
  const saveJob = async () => {
    if (!formJob.titolo || !formJob.cliente) { showToast("Inserisci titolo e cliente", true); return; }
    const { id, ...jobData } = formJob;
    // Converti stringhe vuote in null per i campi date
    if (!jobData.data_shooting) jobData.data_shooting = null;
    if (!jobData.data_pagamento_cliente) jobData.data_pagamento_cliente = null;
    const isExisting = id && typeof id === "number" && jobs.find(j => j.id === id);
    if (isExisting) {
      await supabase.from("jobs").update(jobData).eq("id", id);
      setJobs(prev => prev.map(j => j.id === id ? { ...jobData, id } : j));
    } else {
      const { data, error } = await supabase.from("jobs").insert(jobData).select().single();
      if (data) {
        setJobs(prev => [...prev, data]);
      } else {
        showToast(error?.message || "Errore salvataggio", true);
        return;
      }
    }
    showToast("Job salvato ✓"); setView("lista");
  };
  const deleteJob = async id => {
    await supabase.from("jobs").delete().eq("id", id);
    setJobs(prev => prev.filter(j => j.id !== id));
    showToast("Job eliminato"); setView("lista");
  };
  const deleteMod = async id => {
    const mod = modelle.find(m => m.id === id);
    if (!mod) return;
    try {
      const res = await fetch("https://xtpafxourildjnofeulr.supabase.co/functions/v1/delete-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ nome: mod.nome, modella_id: id })
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setModelle(prev => prev.filter(m => m.id !== id));
      setJobs(prev => prev.filter(j => j.modella !== mod.nome));
      showToast("Profile deleted \u2713"); setView("modelle");
    } catch (e) {
      showToast("Errore: " + e.message, true);
    }
  };
  // Casting helpers
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
      showToast("Casting salvato · invio email..."); setView("castings");
      // Notifica email ai model (fire-and-forget)
      try {
        const res = await fetch("https://xtpafxourildjnofeulr.supabase.co/functions/v1/notify-casting", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            titolo: castingData.tipologia,
            cliente: castingData.brand,
            data_shooting: castingData.data ? fmtDate(castingData.data) : "",
            luogo: "",
            compenso: "",
            descrizione: castingData.caratteristiche || "",
            casting_id: data?.id
          })
        });
        const json = await res.json();
        if (json.error) showToast("Casting ok · errore email: " + json.error, true);
        else showToast(`Casting salvato · ${json.sent || 0} email inviate ✓`);
      } catch (e) {
        showToast("Casting ok · errore email: " + e.message, true);
      }
    }
  };
  const deleteCasting = async id => {
    await supabase.from("castings").delete().eq("id", id);
    setCastings(prev => prev.filter(c => c.id !== id));
    setCandidature(prev => prev.filter(c => c.casting_id !== id));
    showToast("Casting eliminato"); setView("castings");
  };
  const candidati = async (castingId) => {
    if (!myModella) return;
    const { data, error } = await supabase.from("candidature").insert({ casting_id: castingId, modella_id: myModella.id }).select().single();
    if (error) { showToast(error.message, true); return; }
    if (data) setCandidature(prev => [...prev, data]);
    showToast("Candidatura inviata ✓");
  };
  const scandidati = async (castingId) => {
    if (!myModella) return;
    const { error } = await supabase.from("candidature").delete().eq("casting_id", castingId).eq("modella_id", myModella.id);
    if (error) { showToast(error.message, true); return; }
    setCandidature(prev => prev.filter(c => !(c.casting_id === castingId && c.modella_id === myModella.id)));
    showToast("Candidatura rimossa");
  };
  // Profilo personale del model (self-service)
  const saveMyProfile = async () => {
    const { error } = await supabase.rpc("update_my_profile", {
      p_telefono:      formMyProfile.telefono      || "",
      p_email:         formMyProfile.email         || "",
      p_link_sito:     formMyProfile.link_sito     || "",
      p_cf:            (formMyProfile.cf || "").toUpperCase(),
      p_indirizzo:     formMyProfile.indirizzo     || "",
      p_citta:         formMyProfile.citta         || "",
      p_cap:           formMyProfile.cap           || "",
      p_iban:          formMyProfile.iban          || "",
    });
    if (error) { showToast(error.message, true); return; }
    setMyModella((prev: any) => ({
      ...(prev || {}),
      telefono:      formMyProfile.telefono      || "",
      email:         formMyProfile.email         || "",
      link_sito:     formMyProfile.link_sito     || "",
      cf:            (formMyProfile.cf || "").toUpperCase(),
      indirizzo:     formMyProfile.indirizzo     || "",
      citta:         formMyProfile.citta         || "",
      cap:           formMyProfile.cap           || "",
      iban:          formMyProfile.iban          || "",
    }));
    showToast("Profilo aggiornato ✓");
    setModelView("home");
  };
  // Upload singola pola
  const uploadPola = async (slot: string, file: File) => {
    if (!myModella || !user) return;
    setPolaUploading(slot);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${slot}_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("polas").upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) { showToast(upErr.message, true); setPolaUploading(""); return; }
      const { data: urlData } = supabase.storage.from("polas").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      const { error: rpcErr } = await supabase.rpc("update_my_pola", { p_slot: slot, p_url: publicUrl });
      if (rpcErr) { showToast(rpcErr.message, true); setPolaUploading(""); return; }
      setMyModella((prev: any) => ({ ...(prev || {}), [slot]: publicUrl }));
      showToast("Foto caricata ✓");
    } catch (e: any) {
      showToast(e.message || "Errore upload", true);
    }
    setPolaUploading("");
  };
  const marcaPagato = async id => {
    const oggi = new Date().toISOString().split("T")[0];
    await supabase.from("jobs").update({ stato_pagamento: "pagato", data_pagamento_cliente: oggi }).eq("id", id);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, stato_pagamento: "pagato", data_pagamento_cliente: oggi } : j));
    showToast("Pagamento registrato ✓");
  };
  const aggiungiCal = (job, tipo) => {
    apriCalendar(job, tipo);
  };
  // Modella helpers
  const saveModella = async () => {
    if (!formMod.nome) { showToast("Enter name", true); return; }
    const modData = { ...formMod };
    if (formMod.id && modelle.find(m => m.id === formMod.id)) {
      await supabase.from("modelle").update(modData).eq("id", formMod.id);
      setModelle((prev: any[]) => prev.map((m: any) => m.id === formMod.id ? modData : m));
    } else {
      const newId = `m${Date.now()}`;
      const newMod = { ...modData, id: newId };
      await supabase.from("modelle").insert(newMod);
      setModelle((prev: any[]) => [...prev, newMod]);
    }
    showToast("Profile saved ✓"); setView("modelle");
  };
  // Contratto
  const copiaContratto = (job) => {
    const mod = modelle.find(m => m.nome === job.modella);
    if (!mod || !mod.cf) { showToast("Completa prima la scheda anagrafica del model", true); return; }
    const testo = generaContratto(job, mod);
    navigator.clipboard.writeText(testo).then(() => { setContrattoCopied(true); setTimeout(() => setContrattoCopied(false), 3000); showToast("Contratto copiato ✓"); });
  };
  const jobFiltrati = jobs
    .filter(j => filtroStato === "tutti" || j.stato_pagamento === filtroStato)
    .sort((a, b) => new Date(b.data_shooting) - new Date(a.data_shooting));
  const totDaIncassare = jobs.filter(j => j.stato_pagamento === "da pagare").reduce((s, j) => s + j.fatturato, 0);
  const totDaPagare    = jobs.filter(j => j.stato_pagamento === "da pagare").reduce((s, j) => s + calcNetto(j), 0);
  const totPagato      = jobs.filter(j => j.stato_pagamento === "pagato").reduce((s, j) => s + calcNetto(j), 0);
  const nomiModelle = modelle.map(m => m.nome);
  // ── NAV ──────────────────────────────────────────────────────────────────
  const backView = () => {
    if (view === "dettaglio") return setView("lista");
    if (view === "nuovo_job") return setView("lista");
    if (view === "scheda_modella") return setView("modelle");
    if (view === "nuova_modella") return setView("modelle");
    if (view === "contratto") return setView("dettaglio");
    if (view === "ritenuta") return setView("dettaglio");
    if (view === "nuovo_casting") return setView("castings");
    if (view === "dettaglio_casting") return setView("castings");
    setView("lista");
  };
  const pageTitle = () => {
    if (view === "lista") return "";
    if (view === "dettaglio") return selectedJob?.titolo || "";
    if (view === "nuovo_job") return formJob.id && jobs.find(j => j.id === formJob.id) ? "Modifica Job" : "Nuovo Job";
    if (view === "calcolatrice") return "Calcolatrice";
    if (view === "modelle") return "Models";
    if (view === "scheda_modella") return selectedModella?.nome?.split(" ")[0] || "";
    if (view === "nuova_modella") return formMod.id && modelle.find(m => m.id === formMod.id) ? "Edit Profile" : "New Model";
    if (view === "contratto") return "Contratto";
    if (view === "ritenuta") return "Ritenuta d'acconto";
    if (view === "castings") return "Castings";
    if (view === "nuovo_casting") return formCasting.id ? "Modifica Casting" : "Nuovo Casting";
    if (view === "dettaglio_casting") return selectedCasting?.brand || "Casting";
    return "";
  };
  // ── IMPOSTA PASSWORD (dopo invito o reset) ─────────────────────────────
  if (needsPassword) return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: "17px", background: "#F5F5F5", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <img src={LOGO} alt="Peacock" style={{ height: 56, objectFit: "contain" }} />
      </div>
      <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "28px 24px", border: "0.5px solid #EBEBEB" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Benvenuto in Peacock</div>
        <div style={{ fontSize: 15, color: "#9C948A", marginBottom: 20, lineHeight: 1.5 }}>Imposta la tua password per accedere all'app.</div>
        {loginError && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 16, color: "#000000" }}>{loginError}</div>}
        <Field label="Nuova password" value={newPassword} onChange={setNewPassword} type="password" />
        <Field label="Conferma password" value={confirmPassword} onChange={setConfirmPassword} type="password" />
        <PrimaryBtn onClick={doSetPassword} disabled={loginLoading}>{loginLoading ? "Salvataggio..." : "Imposta password"}</PrimaryBtn>
      </div>
    </div>
  );
  // ── LOGIN ────────────────────────────────────────────────────────────────
  if (!user) return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: "17px", background: "#F5F5F5", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <img src={LOGO} alt="Peacock" style={{ height: 56, objectFit: "contain" }} />
      </div>
      <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "28px 24px", border: "0.5px solid #EBEBEB" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Accedi</div>
        {loginError && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 16, color: "#000000" }}>{loginError}</div>}
        <Field label="Email" value={loginEmail} onChange={v => setLoginEmail(v.trim().toLowerCase())} type="text" />
        <Field label="Password" value={loginPassword} onChange={setLoginPassword} type="password" />
        <PrimaryBtn onClick={doLogin} disabled={loginLoading}>{loginLoading ? "Accesso..." : "Entra"}</PrimaryBtn>
      </div>
    </div>
  );
  // ── VISTA MODELLA ────────────────────────────────────────────────────────
  if (user && userRuolo === "model") {
    // Sub-view: profilo personale
    if (modelView === "profilo") {
      return (
        <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#F5F5F5", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          {toast && (
            <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toastErr ? "#DC2626" : "#1C1714", color: "#FFF", padding: "10px 20px", borderRadius: 100, fontSize: 16, fontWeight: 500, zIndex: 100, boxShadow: "0 4px 24px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
              {toast}
            </div>
          )}
          <div style={{ background: "#FFFFFF", borderBottom: "0.5px solid #EBEBEB", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src="/p-logo.png" alt="P" style={{ height: 48, objectFit: "contain" }} />
            <button onClick={() => setModelView("home")} style={{ padding: "8px 16px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>← Indietro</button>
          </div>
          <div style={{ padding: "20px 16px 40px", flex: 1, overflowY: "auto" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#000", marginBottom: 4 }}>Il mio profilo</div>
            <div style={{ fontSize: 17, color: "#767676", marginBottom: 20 }}>Aggiorna i tuoi dati personali</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Contatti</div>
            <Field label="Telefono" value={formMyProfile.telefono || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, telefono: v }))} placeholder="+39..." />
            <Field label="Email" value={formMyProfile.email || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, email: v }))} />
            <Field label="Link sito / portfolio" value={formMyProfile.link_sito || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, link_sito: v }))} placeholder="https://..." />
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Dati personali</div>
            <Field label="Codice Fiscale" value={formMyProfile.cf || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, cf: v.toUpperCase() }))} />
            <Field label="Indirizzo" value={formMyProfile.indirizzo || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, indirizzo: v }))} placeholder="Via..." />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
              <Field label="Città" value={formMyProfile.citta || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, citta: v }))} placeholder="Bari" />
              <Field label="CAP" value={formMyProfile.cap || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, cap: v }))} placeholder="70121" />
            </div>
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Coordinate bancarie</div>
            <Field label="IBAN" value={formMyProfile.iban || ""} onChange={v => setFormMyProfile((f: any) => ({ ...f, iban: v.toUpperCase() }))} placeholder="IT..." />
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Polas</div>
            <div style={{ fontSize: 14, color: "#9C948A", marginBottom: 14, lineHeight: 1.4 }}>Carica 4 foto su sfondo neutro, senza filtri e senza trucco.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { slot: "pola_primo_piano", label: "Primo piano" },
                { slot: "pola_profilo_sx", label: "Profilo sinistro" },
                { slot: "pola_profilo_dx", label: "Profilo destro" },
                { slot: "pola_figura_intera", label: "Figura intera" },
              ].map(({ slot, label }) => {
                const url = myModella?.[slot];
                const isLoading = polaUploading === slot;
                return (
                  <div key={slot} style={{ position: "relative" }}>
                    <label style={{ display: "block", cursor: isLoading ? "wait" : "pointer" }}>
                      <input type="file" accept="image/*" style={{ display: "none" }} disabled={isLoading}
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadPola(slot, f); e.target.value = ""; }} />
                      <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 14, overflow: "hidden", background: "#EBEBEB", border: "0.5px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        {url ? (
                          <img src={url} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ textAlign: "center", color: "#9C948A" }}>
                            <div style={{ fontSize: 28, marginBottom: 4 }}>{isLoading ? "⏳" : "📷"}</div>
                            <div style={{ fontSize: 11 }}>{isLoading ? "Caricamento..." : "Tappa per caricare"}</div>
                          </div>
                        )}
                        {isLoading && url && (
                          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⏳</div>
                        )}
                      </div>
                    </label>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#767676", textAlign: "center", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  </div>
                );
              })}
            </div>
            <PrimaryBtn onClick={saveMyProfile}>Salva</PrimaryBtn>
            <div style={{ marginTop: 14, fontSize: 14, color: "#9C948A", textAlign: "center", lineHeight: 1.5 }}>
              Per modificare nome, contratto o altri dati<br />contatta l'agenzia.
            </div>
            <div style={{ height: 28 }} />
            <ChangePasswordSection showToast={showToast} />
          </div>
        </div>
      );
    }
    const myJobs = jobs.filter(j => j.modella === myModella?.nome).sort((a, b) => new Date(b.data_shooting).getTime() - new Date(a.data_shooting).getTime());
    const totNetto = myJobs.reduce((s, j) => s + calcNetto(j), 0);
    const totPagato = myJobs.filter(j => j.stato_pagamento === "pagato").reduce((s, j) => s + calcNetto(j), 0);
    // Sub-view: dettaglio job del model
    if (modelView === "job_dettaglio" && modelSelectedJob) {
      const job = jobs.find(j => j.id === modelSelectedJob.id) || modelSelectedJob;
      return (
        <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#F5F5F5", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          {toast && (
            <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toastErr ? "#DC2626" : "#1C1714", color: "#FFF", padding: "10px 20px", borderRadius: 100, fontSize: 16, fontWeight: 500, zIndex: 100, boxShadow: "0 4px 24px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
              {toast}
            </div>
          )}
          <div style={{ background: "#FFFFFF", borderBottom: "0.5px solid #EBEBEB", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src="/p-logo.png" alt="P" style={{ height: 48, objectFit: "contain" }} />
            <button onClick={() => setModelView("home")} style={{ padding: "8px 16px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>← Indietro</button>
          </div>
          <div style={{ padding: "20px 16px 40px", flex: 1, overflowY: "auto" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#000", marginBottom: 16 }}>{job.titolo}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <Badge label={job.stato_job} color={JOB_COLOR[job.stato_job]} bg={JOB_BG[job.stato_job]} />
              <Badge label={job.stato_pagamento} color={PAG_COLOR[job.stato_pagamento]} bg={PAG_BG[job.stato_pagamento]} />
            </div>
            <PaddedSection title="Dettagli">
              <InfoRow label="Cliente" val={job.cliente} />
              <Divider />
              <InfoRow label="Data shooting" val={fmtDate(job.data_shooting)} />
              <Divider />
              <InfoRow label="Luogo" val={job.luogo} />
            </PaddedSection>
            <PaddedSection title="Compenso">
              {job.rimborso > 0 && (
                <>
                  <CalcRow label="Rimborso spese" val={fmt(job.rimborso)} />
                  <div style={{ height: 8 }} />
                </>
              )}
              <div style={{ background: "#F5F5F5", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 600, color: "#000000" }}>Netto</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#000000", letterSpacing: "-0.03em" }}>{fmt(calcDaPagareModel(job))}</span>
              </div>
              {job.stato_pagamento === "pagato" && (
                <div style={{ marginTop: 10, padding: "13px", background: "#F0FDF4", border: "1.5px solid #16A34A33", borderRadius: 14, color: "#767676", fontSize: 17, fontWeight: 600, textAlign: "center" }}>
                  ✓ Pagamento completato · {fmtDate(job.data_pagamento_cliente)}
                </div>
              )}
            </PaddedSection>
            {myModella && (
              <Section title="Ritenuta d'acconto">
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 16, color: "#767676", lineHeight: 1.5, marginBottom: 14 }}>
                    Genera la ritenuta d'acconto per questo job con i tuoi dati precompilati.
                  </div>
                  <button onClick={() => { setNumRitenuta("1"); setDescRitenuta("Model"); setDataInizioRitenuta(fmtDate(job.data_shooting)); setDataFineRitenuta(""); setModelView("ritenuta_model"); }}
                    style={{ width: "100%", padding: "13px", background: "#000000", border: "none", borderRadius: 14, color: "#FFF", fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    🧾 Genera ritenuta
                  </button>
                </div>
              </Section>
            )}
          </div>
        </div>
      );
    }
    // Sub-view: ritenuta model
    if (modelView === "ritenuta_model" && modelSelectedJob && myModella) {
      const job = jobs.find(j => j.id === modelSelectedJob.id) || modelSelectedJob;
      const testo = generaRitenuta(job, myModella, numRitenuta, descRitenuta, dataInizioRitenuta, dataFineRitenuta);
      const stampaPDFModel = () => {
        const win = window.open("", "_blank");
        if (!win) { showToast("Abilita i popup per stampare", true); return; }
        win.document.write(generaRitenutaHTML(job, myModella, numRitenuta, descRitenuta, dataInizioRitenuta, dataFineRitenuta));
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 400);
      };
      return (
        <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#F5F5F5", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
          {toast && (
            <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toastErr ? "#DC2626" : "#1C1714", color: "#FFF", padding: "10px 20px", borderRadius: 100, fontSize: 16, fontWeight: 500, zIndex: 100, boxShadow: "0 4px 24px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
              {toast}
            </div>
          )}
          <div style={{ background: "#FFFFFF", borderBottom: "0.5px solid #EBEBEB", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src="/p-logo.png" alt="P" style={{ height: 48, objectFit: "contain" }} />
            <button onClick={() => setModelView("job_dettaglio")} style={{ padding: "8px 16px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>← Indietro</button>
          </div>
          <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 16 }}>Ritenuta d'acconto</div>
            <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "16px", marginBottom: 16, border: "1px solid #EAE4DC" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Compila</div>
              <Field label="N° ritenuta" value={numRitenuta} onChange={setNumRitenuta} type="text" />
              <Field label="Descrizione prestazione" value={descRitenuta} onChange={setDescRitenuta} placeholder="Model" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Data inizio" value={dataInizioRitenuta} onChange={setDataInizioRitenuta} placeholder="gg/mm/aaaa" />
                <Field label="Data fine" value={dataFineRitenuta} onChange={setDataFineRitenuta} placeholder="gg/mm/aaaa" />
              </div>
            </div>
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "0.5px solid #EBEBEB", padding: "20px 18px", fontSize: 15, color: "#000000", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              {testo}
            </div>
            <button onClick={stampaPDFModel}
              style={{ width: "100%", padding: "15px", background: "#1C1714", border: "none", borderRadius: 16, color: "#FFF", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>
              🖨️ Genera PDF
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(testo).then(() => { showToast("Ritenuta copiata ✓"); });
            }}
              style={{ width: "100%", padding: "13px", background: "transparent", border: "0.5px solid #EBEBEB", borderRadius: 16, color: "#767676", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
              📋 Copia testo
            </button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#F5F5F5", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#FFFFFF", borderBottom: "0.5px solid #EBEBEB", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src="/p-logo.png" alt="P" style={{ height: 48, objectFit: "contain" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => { setFormMyProfile(myModella || {}); setModelView("profilo"); }}
              style={{ padding: "8px 14px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
              Profilo
            </button>
            <button onClick={doLogout} style={{ padding: "8px 14px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>Esci</button>
          </div>
        </div>
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#000", marginBottom: 4 }}>{myModella?.nome || "Ciao"}</div>
          <div style={{ fontSize: 17, color: "#767676", marginBottom: 20 }}>Your jobs</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "14px", border: "0.5px solid #EBEBEB" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>{fmt(totNetto)}</div>
              <div style={{ fontSize: 10, color: "#767676", marginTop: 2, letterSpacing: "0.06em" }}>TOTALE NETTO</div>
            </div>
            <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "14px", border: "0.5px solid #EBEBEB" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>{fmt(totPagato)}</div>
              <div style={{ fontSize: 10, color: "#767676", marginTop: 2, letterSpacing: "0.06em" }}>PAGATO</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "0 16px 30px", display: "flex", flexDirection: "column", gap: 10 }}>
          {myJobs.length === 0 ? (
            <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px", textAlign: "center", border: "0.5px solid #EBEBEB" }}>
              <div style={{ fontSize: 17, color: "#767676" }}>No jobs yet</div>
            </div>
          ) : myJobs.map(j => (
            <div key={j.id} onClick={() => { setModelSelectedJob(j); setModelView("job_dettaglio"); }}
              style={{ background: "#FFFFFF", borderRadius: 16, padding: "16px", border: "0.5px solid #EBEBEB", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#000" }}>{j.titolo}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>{fmt(calcNetto(j))}</div>
              </div>
              <div style={{ fontSize: 16, color: "#767676", marginBottom: 8 }}>{j.cliente} · {fmtDate(j.data_shooting)}</div>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, border: "0.5px solid #EBEBEB", color: j.stato_pagamento === "pagato" ? "#16A34A" : "#767676", background: j.stato_pagamento === "pagato" ? "#F0FDF4" : "#F5F5F5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {j.stato_pagamento}
              </span>
            </div>
          ))}
          {castings.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", margin: "6px 4px 10px" }}>Casting aperti</div>
              {castings.map(c => {
                const giaCandidata = candidature.some(cand => cand.casting_id === c.id && cand.modella_id === myModella?.id);
                return (
                  <div key={c.id} style={{ background: "#FFFFFF", borderRadius: 16, padding: "16px", border: "0.5px solid #EBEBEB", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: "#000" }}>{c.brand}</div>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, border: "0.5px solid #EBEBEB", color: "#767676", background: "#F5F5F5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {c.genere}
                      </span>
                    </div>
                    <div style={{ fontSize: 16, color: "#767676", marginBottom: 4 }}>{c.tipologia}{c.data ? " · " + fmtDate(c.data) : ""}</div>
                    {c.caratteristiche && <div style={{ fontSize: 15, color: "#767676", marginBottom: 10, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>{c.caratteristiche}</div>}
                    {giaCandidata ? (
                      <button onClick={() => scandidati(c.id)} style={{ width: "100%", padding: "10px", borderRadius: 100, border: "0.5px solid #16A34A", background: "#F0FDF4", color: "#16A34A", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        ✓ Candidato — annulla
                      </button>
                    ) : (
                      <button onClick={() => candidati(c.id)} style={{ width: "100%", padding: "10px", borderRadius: 100, border: "none", background: "#000000", color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Candidati
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: 10, background: "#FFFFFF", borderRadius: 16, padding: "16px", border: "0.5px solid #EBEBEB" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Calcolatrice ritenuta</div>
            <CalcolatoreSemplice />
          </div>
        </div>
      </div>
    );
  }
  if (splash) return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", maxWidth: 430, margin: "0 auto" }} />
  );
  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", fontSize: "17px", background: "#F5F5F5", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toastErr ? "#DC2626" : "#1C1714", color: "#FFF", padding: "10px 20px", borderRadius: 100, fontSize: 16, fontWeight: 500, zIndex: 100, boxShadow: "0 4px 24px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}
      {/* HEADER */}
      <div style={{ background: "#FFFFFF", borderBottom: "0.5px solid #EBEBEB", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src="/p-logo.png" alt="P" style={{ height: 110, objectFit: "contain" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {view !== "lista" && view !== "modelle" && view !== "calcolatrice" && view !== "castings" && (
              <button onClick={backView} style={{ padding: "8px 16px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>← Indietro</button>
            )}
            {view === "castings" && (
              <>
                <button onClick={() => setView("lista")} style={{ padding: "8px 16px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>← Jobs</button>
                <button onClick={() => { setFormCasting({ ...emptyCasting, id: null }); setView("nuovo_casting"); }}
                  style={{ padding: "8px 18px", borderRadius: 100, border: "none", background: "#000000", color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  + Casting
                </button>
              </>
            )}
            {view === "lista" && (
              <>
                {userRuolo === "admin" && (
                  <button onClick={() => { setFormJob({ ...emptyJob, id: Date.now() }); setView("nuovo_job"); }}
                    style={{ padding: "8px 18px", borderRadius: 100, border: "none", background: "#000000", color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    + Job
                  </button>
                )}
                <button onClick={doLogout}
                  style={{ padding: "8px 14px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
                  Esci
                </button>
                <button onClick={() => setView("modelle")}
                  style={{ width: 36, height: 36, borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  👤
                </button>
                {userRuolo === "admin" && (
                  <button onClick={() => setView("castings")}
                    style={{ width: 36, height: 36, borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    📋
                  </button>
                )}
                <button onClick={() => setView("calcolatrice")}
                  style={{ width: 36, height: 36, borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  ÷
                </button>
              </>
            )}
            {view === "modelle" && (
              <>
                <button onClick={() => setView("lista")} style={{ padding: "8px 16px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>← Jobs</button>
                <button onClick={() => { setFormMod({ ...emptyModella, id: null }); setView("nuova_modella"); }}
                  style={{ padding: "8px 18px", borderRadius: 100, border: "none", background: "#000000", color: "#FFFFFF", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  + Model
                </button>
              </>
            )}
            {view === "calcolatrice" && (
              <button onClick={() => setView("lista")} style={{ padding: "8px 16px", borderRadius: 100, border: "0.5px solid #EBEBEB", background: "transparent", color: "#767676", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>← Jobs</button>
            )}
          </div>
        </div>
        {pageTitle() && (
          <div style={{ padding: "0 20px 14px" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#000000", letterSpacing: "-0.02em" }}>{pageTitle()}</div>
          </div>
        )}
      </div>
      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 30 }}>
        {/* ── LISTA ── */}
        {view === "lista" && (
          <div>
            {/* Stats */}
            <div style={{ background: "#FFFFFF", borderBottom: "0.5px solid #EBEBEB", display: "flex" }}>
              {[
                { label: "Da incassare", val: fmt(totDaIncassare), color: "#000000" },
                { label: "Da pagare",    val: fmt(totDaPagare),    color: "#C4A882" },
                { label: "Pagato YTD",   val: fmt(totPagato),      color: "#767676" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, padding: "16px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid #F0EAE0" : "none" }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: s.color, letterSpacing: "-0.01em" }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: "#767676", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Filtri */}
            <div style={{ padding: "12px 16px", display: "flex", gap: 6, overflowX: "auto", background: "#FFFFFF", borderBottom: "0.5px solid #EBEBEB" }}>
              {["tutti", "da pagare", "pagato", "in attesa"].map(f => (
                <Chip key={f} active={filtroStato === f} onClick={() => setFiltroStato(f)}>{f}</Chip>
              ))}
            </div>
            {/* Lista job */}
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {jobFiltrati.length === 0 && (
                <div style={{ textAlign: "center", color: "#767676", padding: "40px 0", fontSize: 16 }}>Nessun job trovato</div>
              )}
              {jobFiltrati.map(job => (
                <div key={job.id} onClick={() => { setSelectedJob(job); setView("dettaglio"); }}
                  style={{ background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 18, padding: "16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#000000", marginBottom: 3 }}>{job.titolo}</div>
                    <div style={{ fontSize: 16, color: "#767676", marginBottom: 8 }}>{job.cliente} · {job.modella.split(" ")[0]} · {fmtDate(job.data_shooting)}</div>
                    <Badge label={job.stato_pagamento} color={PAG_COLOR[job.stato_pagamento]} bg={PAG_BG[job.stato_pagamento]} />
                  </div>
                  <div style={{ textAlign: "right", marginLeft: 12, flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#000000", letterSpacing: "-0.02em" }}>{fmt(calcNetto(job))}</div>
                    <div style={{ fontSize: 10, color: "#767676", marginTop: 2 }}>netto</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ── DETTAGLIO JOB ── */}
        {view === "dettaglio" && selectedJob && (() => {
          const job = jobs.find(j => j.id === selectedJob.id) || selectedJob;
          const mod = modelle.find(m => m.nome === job.modella);
          const contrattoPronto = mod && mod.nome;
          return (
            <div style={{ padding: "20px 16px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <Badge label={job.stato_job} color={JOB_COLOR[job.stato_job]} bg={JOB_BG[job.stato_job]} />
                <Badge label={job.stato_pagamento} color={PAG_COLOR[job.stato_pagamento]} bg={PAG_BG[job.stato_pagamento]} />
              </div>
              <PaddedSection title="Dettagli">
                <InfoRow label="Cliente"       val={job.cliente} />
                <Divider />
                <InfoRow label="Model"       val={job.modella} />
                <Divider />
                <InfoRow label="Data shooting" val={fmtDate(job.data_shooting)} />
                <Divider />
                <InfoRow label="Luogo"         val={job.luogo} />
                {job.note && <><Divider /><InfoRow label="Note" val={job.note} /></>}
              </PaddedSection>
              <PaddedSection title="Pagamento">
<CalcRow label="Fatturato" val={fmt(job.fatturato)} />
                <Divider />
                <CalcRow label="Netto model" val={`– ${fmt(calcNetto(job))}`} />
                {job.rimborso > 0 && <><Divider /><CalcRow label="Rimborso spese" val={`– ${fmt(job.rimborso)}`} /></>}
                <Divider />
                <CalcRow label="Guadagno Peacock" val={fmt(calcGuadagnoPeacock(job))} />
                <div style={{ height: 8 }} />
                <div style={{ background: "#F5F5F5", borderRadius: 12, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: "#000000" }}>Netto da pagare al model</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#000000", letterSpacing: "-0.03em" }}>{fmt(calcDaPagareModel(job))}</span>
                </div>
                {job.stato_pagamento !== "pagato" ? (
                  <button onClick={() => { marcaPagato(job.id); setSelectedJob({ ...job, stato_pagamento: "pagato" }); }}
                    style={{ width: "100%", marginTop: 10, padding: "13px", background: "#16A34A", border: "none", borderRadius: 14, color: "#FFF", fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    ✓ Marca come pagato
                  </button>
                ) : (
                  <div style={{ marginTop: 10, padding: "13px", background: "#F0FDF4", border: "1.5px solid #16A34A33", borderRadius: 14, color: "#767676", fontSize: 17, fontWeight: 600, textAlign: "center" }}>
                    ✓ Pagamento completato · {fmtDate(job.data_pagamento_cliente)}
                  </div>
                )}
              </PaddedSection>
              {/* CALL SHEET */}
              <Section title="📸 Call Sheet">
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontSize: 16, color: "#767676", lineHeight: 1.5, marginBottom: 14 }}>
                    Genera il call sheet precompilato per <strong>{job.modella.split(" ")[0]}</strong> e copialo per incollarlo su WhatsApp.
                  </div>
                  <button onClick={() => {
                    const testo = generaCallSheet(job);
                    navigator.clipboard.writeText(testo).then(() => { showToast("Call sheet copiato ✓"); });
                  }}
                    style={{ width: "100%", padding: "13px", background: "#000000", border: "none", borderRadius: 14, color: "#FFF", fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    📋 Copia call sheet
                  </button>
                  <button onClick={() => { setView("ritenuta"); }}
                    style={{ width: "100%", marginTop: 8, padding: "13px", background: "#16A34A", border: "none", borderRadius: 14, color: "#FFF", fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    🧾 Genera ritenuta d'acconto
                  </button>
                </div>
              </Section>
              <Section title="📅 Calendario">
                <div style={{ padding: "8px 8px 4px" }}>
                  <CalBtn icon="📷" label="Giorno shooting" sub={`${fmtDate(job.data_shooting)} · tutto il giorno`} onClick={() => aggiungiCal(job, "shooting")} loading={loading === "shooting"} />
                </div>
              </Section>
              <GhostBtn onClick={() => { setFormJob(job); setView("nuovo_job"); }}>Modifica job</GhostBtn>
              <button onClick={() => { if (window.confirm("Eliminare questo job?")) deleteJob(job.id); }}
                style={{ width: "100%", marginTop: 8, padding: "12px", background: "transparent", border: "1.5px solid #FCA5A5", borderRadius: 14, color: "#000000", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
                Elimina job
              </button>
            </div>
          );
        })()}
        {/* ── CONTRATTO ── */}
        {view === "contratto" && selectedJob && (() => {
          const job = jobs.find(j => j.id === selectedJob.id) || selectedJob;
          const mod = modelle.find(m => m.nome === job.modella);
          if (!mod) return null;
          const testo = generaContratto(job, mod);
          return (
            <div style={{ padding: "16px" }}>
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "0.5px solid #EBEBEB", padding: "20px 18px", fontSize: 16, color: "#000000", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
                {testo}
              </div>
              <button onClick={() => copiaContratto(job)}
                style={{ width: "100%", padding: "15px", background: contrattoCopied ? "#16A34A" : "#1C1714", border: "none", borderRadius: 16, color: "#FFF", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {contrattoCopied ? "✓ Copiato!" : "📋 Copia testo contratto"}
              </button>
            </div>
          );
        })()}
        {/* ── RITENUTA D'ACCONTO ── */}
        {view === "ritenuta" && selectedJob && (() => {
          const job = jobs.find(j => j.id === selectedJob.id) || selectedJob;
          const mod = modelle.find(m => m.nome === job.modella);
          if (!mod) return <div style={{ padding: 16, color: "#000000" }}>Completa prima la scheda anagrafica del model.</div>;
          const testo = generaRitenuta(job, mod, numRitenuta, descRitenuta, dataInizioRitenuta, dataFineRitenuta);
          const stampaPDF = () => {
            const win = window.open("", "_blank");
            if (!win) { showToast("Abilita i popup per stampare", true); return; }
            win.document.write(generaRitenutaHTML(job, mod, numRitenuta, descRitenuta, dataInizioRitenuta, dataFineRitenuta));
            win.document.close();
            win.focus();
            setTimeout(() => { win.print(); }, 400);
          };
          return (
            <div style={{ padding: "16px" }}>
              <div style={{ background: "#FFFFFF", borderRadius: 14, padding: "16px", marginBottom: 16, border: "1px solid #EAE4DC" }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Compila</div>
                <Field label="N° ritenuta" value={numRitenuta} onChange={setNumRitenuta} type="text" />
                <Field label="Descrizione prestazione" value={descRitenuta} onChange={setDescRitenuta} placeholder="Model" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field label="Data inizio" value={dataInizioRitenuta} onChange={setDataInizioRitenuta} placeholder="gg/mm/aaaa" />
                  <Field label="Data fine" value={dataFineRitenuta} onChange={setDataFineRitenuta} placeholder="gg/mm/aaaa" />
                </div>
              </div>
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "0.5px solid #EBEBEB", padding: "20px 18px", fontSize: 15, color: "#000000", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 16 }}>
                {testo}
              </div>
              <button onClick={stampaPDF}
                style={{ width: "100%", padding: "15px", background: "#1C1714", border: "none", borderRadius: 16, color: "#FFF", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>
                🖨️ Genera PDF
              </button>
              <button onClick={() => {
                navigator.clipboard.writeText(testo).then(() => {
                  setRitenutaCopied(true);
                  setTimeout(() => setRitenutaCopied(false), 3000);
                  showToast("Ritenuta copiata ✓");
                });
              }}
                style={{ width: "100%", padding: "13px", background: "transparent", border: "0.5px solid #EBEBEB", borderRadius: 16, color: "#767676", fontSize: 16, cursor: "pointer", fontFamily: "inherit" }}>
                {ritenutaCopied ? "✓ Copiato!" : "📋 Copia testo"}
              </button>
            </div>
          );
        })()}
        {/* ── MODELLE ── */}
        {view === "modelle" && (
          <div style={{ padding: "16px" }}>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Search model..."
                value={cercaModella}
                onChange={e => setCercaModella(e.target.value)}
                style={{ width: "100%", background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 12, color: "#000000", fontSize: 16, padding: "10px 36px 10px 14px", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
              />
              {cercaModella && (
                <button onClick={() => setCercaModella("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#767676" }}>×</button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {modelle.filter(m => m.nome.toLowerCase().includes(cercaModella.toLowerCase())).map(mod => {
                const mj = jobs.filter(j => j.modella === mod.nome);
                const netto = mj.reduce((s, j) => s + calcNetto(j), 0);
                return (
                  <div key={mod.id} onClick={() => { setSelectedModella(mod); setView("scheda_modella"); }}
                    style={{ background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 18, padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EBEBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 18, color: "#767676" }}>{mod.nome.charAt(0)}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 600, color: "#000000", marginBottom: 2 }}>{mod.nome}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                      <span style={{ fontSize: 17, color: "#767676" }}>{mod.instagram} · {mj.length} job · {fmt(netto)}</span>
                      {mod.contratto_tipo && (() => { const cc = CONTRATTO_COLORS[mod.contratto_tipo] || CONTRATTO_COLORS.Start; return <span style={{ fontSize: 9, fontWeight: 700, color: cc.color, background: cc.bg, padding: "2px 7px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.06em" }}>{mod.contratto_tipo}</span>; })()}
                      {contrattoScadenzaAlert(mod.contratto_scadenza) && <span style={{ fontSize: 9, fontWeight: 600, color: contrattoScadenzaAlert(mod.contratto_scadenza) === "scaduto" ? "#DC2626" : "#D97706" }}>{contrattoScadenzaAlert(mod.contratto_scadenza) === "scaduto" ? "⚠️ scaduto" : "⏰ in scadenza"}</span>}
                    </div>
                    </div>
                    <span style={{ color: "#C4C0BA", fontSize: 16 }}>›</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* ── SCHEDA MODELLA ── */}
        {view === "scheda_modella" && selectedModella && (() => {
          const mod = modelle.find(m => m.id === selectedModella.id) || selectedModella;
          const mj = jobs.filter(j => j.modella === mod.nome).sort((a, b) => new Date(b.data_shooting) - new Date(a.data_shooting));
          const totNetto = mj.reduce((s, j) => s + calcNetto(j), 0);
          return (
            <div style={{ padding: "20px 16px" }}>
              {userRuolo === "admin" && !mod.user_id && (
                <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Invita all'app</div>
                  <Field label="Email model" value={inviteEmail} onChange={setInviteEmail} type="text" placeholder="email@esempio.com" />
                  <PrimaryBtn onClick={() => doInvite(mod.nome)} disabled={inviteLoading} color="#16A34A">
                    {inviteLoading ? "Invio..." : "Manda invito ✉️"}
                  </PrimaryBtn>
                </div>
              )}
              <PaddedSection title="Contatti"
                action={<button onClick={() => { setFormMod(mod); setView("nuova_modella"); }} style={{ fontSize: 17, color: "#C4A882", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Modifica</button>}>
                <InfoRow label="Telefono"   val={mod.telefono} />
                <Divider />
                <InfoRow label="Email"      val={mod.email} />
                <Divider />
                <InfoRow label="Sito"       val={mod.link_sito} />
                {mod.note && <><Divider /><InfoRow label="Note" val={mod.note} /></>}
              </PaddedSection>
              {/* POLAS */}
              <Section title="Polas">
                {(mod.pola_primo_piano || mod.pola_profilo_sx || mod.pola_profilo_dx || mod.pola_figura_intera) ? (
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { slot: "pola_primo_piano", label: "Primo piano" },
                        { slot: "pola_profilo_sx", label: "Profilo SX" },
                        { slot: "pola_profilo_dx", label: "Profilo DX" },
                        { slot: "pola_figura_intera", label: "Figura intera" },
                      ].map(({ slot, label }) => (
                        <div key={slot}>
                          <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 14, overflow: "hidden", background: "#F5F5F5", border: "0.5px solid #EBEBEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {mod[slot] ? (
                              <img src={mod[slot]} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <div style={{ fontSize: 12, color: "#C4C0BA", textAlign: "center" }}>—</div>
                            )}
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#767676", textAlign: "center", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "16px", fontSize: 16, color: "#767676" }}>Il model non ha ancora caricato le polas.</div>
                )}
              </Section>
              {/* CONTRATTO AGENZIA */}
              {(() => {
                const alert = contrattoScadenzaAlert(mod.contratto_scadenza);
                const tipo = mod.contratto_tipo || "Start";
                const cc = CONTRATTO_COLORS[tipo] || CONTRATTO_COLORS.Start;
                return (
                  <Section title="Agency contract"
                    action={<button onClick={() => { setFormMod(mod); setView("nuova_modella"); }} style={{ fontSize: 17, color: "#C4A882", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Modifica</button>}>
                    <div style={{ padding: "14px 16px" }}>
                      {mod.contratto_firma ? (
                        <>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 100, fontSize: 17, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: cc.color, background: cc.bg, border: `1px solid ${cc.color}33` }}>
                              {tipo}
                            </span>
                            {alert && (
                              <span style={{ fontSize: 17, fontWeight: 600, color: alert === "scaduto" ? "#DC2626" : "#D97706", background: alert === "scaduto" ? "#FEF2F2" : "#FFFBEB", padding: "3px 10px", borderRadius: 100 }}>
                                {alert === "scaduto" ? "⚠️ Scaduto" : "⏰ In scadenza"}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid #EBEBEB" }}>
                            <span style={{ fontSize: 16, color: "#767676" }}>Firmato il</span>
                            <span style={{ fontSize: 16, color: "#000000" }}>{mod.contratto_firma}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                            <span style={{ fontSize: 16, color: "#767676" }}>Scade il</span>
                            <span style={{ fontSize: 16, fontWeight: alert ? 600 : 400, color: alert === "scaduto" ? "#DC2626" : alert === "in scadenza" ? "#D97706" : "#1C1714" }}>{mod.contratto_scadenza}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: 16, color: "#767676" }}>Nessun contratto registrato.</div>
                      )}
                    </div>
                  </Section>
                );
              })()}
              <Section title={`Job (${mj.length}) · ${fmt(totNetto)} netto`}>
                <div>
                  {mj.map((job, i) => (
                    <div key={job.id}>
                      <div onClick={() => { setSelectedJob(job); setView("dettaglio"); }}
                        style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 500, color: "#000000", marginBottom: 2 }}>{job.titolo}</div>
                          <div style={{ fontSize: 17, color: "#767676" }}>{job.cliente} · {fmtDate(job.data_shooting)}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 17, fontWeight: 600, color: "#000000" }}>{fmt(calcNetto(job))}</div>
                          <Badge label={job.stato_pagamento} color={PAG_COLOR[job.stato_pagamento]} bg={PAG_BG[job.stato_pagamento]} />
                        </div>
                      </div>
                      {i < mj.length - 1 && <Divider />}
                    </div>
                  ))}
                  {mj.length === 0 && <div style={{ padding: "16px", fontSize: 16, color: "#767676" }}>No jobs yet</div>}
                </div>
              </Section>
            </div>
          );
        })()}
        {/* ── NUOVA / MODIFICA MODELLA ── */}
        {view === "nuova_modella" && (
          <div style={{ padding: "16px" }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Contatti</div>
            <Field label="Full name *" value={formMod.nome} onChange={v => setFormMod(f => ({ ...f, nome: v }))} />
            <Field label="Telefono"   value={formMod.telefono}   onChange={v => setFormMod(f => ({ ...f, telefono: v }))} />
            <Field label="Email"      value={formMod.email}      onChange={v => setFormMod(f => ({ ...f, email: v }))} />
            <Field label="Link sito"  value={formMod.link_sito}  onChange={v => setFormMod(f => ({ ...f, link_sito: v }))} />
            <Field label="Internal notes" value={formMod.note} onChange={v => setFormMod(f => ({ ...f, note: v }))} />
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Personal data (for tax)</div>
            <Field label="Codice Fiscale" value={formMod.cf} onChange={v => setFormMod(f => ({ ...f, cf: v.toUpperCase() }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Data di nascita" value={formMod.data_nascita} onChange={v => setFormMod(f => ({ ...f, data_nascita: v }))} placeholder="gg/mm/aaaa" />
              <Field label="Luogo nascita" value={formMod.luogo_nascita} onChange={v => setFormMod(f => ({ ...f, luogo_nascita: v }))} placeholder="Bari (BA)" />
            </div>
            <Field label="Indirizzo" value={formMod.indirizzo} onChange={v => setFormMod(f => ({ ...f, indirizzo: v }))} placeholder="Via..." />
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
              <Field label="Città" value={formMod.citta} onChange={v => setFormMod(f => ({ ...f, citta: v }))} placeholder="Bari" />
              <Field label="CAP" value={formMod.cap} onChange={v => setFormMod(f => ({ ...f, cap: v }))} placeholder="70121" />
            </div>
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Bank details</div>
            <Field label="Banca" value={formMod.banca} onChange={v => setFormMod(f => ({ ...f, banca: v }))} placeholder="UniCredit" />
            <Field label="Account holder" value={formMod.intestato_a} onChange={v => setFormMod(f => ({ ...f, intestato_a: v }))} />
            <Field label="IBAN" value={formMod.iban} onChange={v => setFormMod(f => ({ ...f, iban: v }))} placeholder="IT..." />
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Polas</div>
            <Field label="Drive folder link" value={formMod.link_polas} onChange={v => setFormMod(f => ({ ...f, link_polas: v }))} placeholder="https://drive.google.com/..." />
            <Field label="Last update" value={formMod.data_polas} onChange={v => setFormMod(f => ({ ...f, data_polas: v }))} placeholder="gg/mm/aaaa" />
            <div style={{ height: 8 }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Agency contract</div>
            <SelectField label="Type" value={formMod.contratto_tipo} onChange={v => setFormMod(f => ({ ...f, contratto_tipo: v }))} options={["Start", "Advance", "Top"]} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Sign date" value={formMod.contratto_firma} onChange={v => setFormMod(f => ({ ...f, contratto_firma: v }))} placeholder="gg/mm/aaaa" />
              <Field label="Expiry date" value={formMod.contratto_scadenza} onChange={v => setFormMod(f => ({ ...f, contratto_scadenza: v }))} placeholder="gg/mm/aaaa" />
            </div>
            <PrimaryBtn onClick={saveModella}>Save profile</PrimaryBtn>
            {formMod.id && modelle.find(m => m.id === formMod.id) && (
              <button onClick={() => { if (window.confirm("Eliminare la scheda di " + formMod.nome + "?")) { deleteMod(formMod.id); } }}
                style={{ width: "100%", marginTop: 8, padding: "13px", background: "transparent", border: "1.5px solid #FCA5A5", borderRadius: 16, color: "#000000", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
                Delete profile
              </button>
            )}
          </div>
        )}
        {/* ── NUOVO / MODIFICA JOB ── */}
        {view === "nuovo_job" && (
          <div style={{ padding: "16px" }}>
            <Field label="Titolo job *" value={formJob.titolo} onChange={v => setFormJob(f => ({ ...f, titolo: v }))} />
            <Field label="Cliente *"   value={formJob.cliente} onChange={v => setFormJob(f => ({ ...f, cliente: v }))} />
            <SelectField label="Model" value={formJob.modella} onChange={v => setFormJob(f => ({ ...f, modella: v }))} options={nomiModelle} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Data shooting" value={formJob.data_shooting} onChange={v => setFormJob(f => ({ ...f, data_shooting: v }))} type="date" />
              <Field label="Call time"     value={formJob.call_time}     onChange={v => setFormJob(f => ({ ...f, call_time: v }))} type="time" />
            </div>
            <Field label="Luogo"              value={formJob.luogo}              onChange={v => setFormJob(f => ({ ...f, luogo: v }))} placeholder="Indirizzo o link Google Maps" />
            <Field label="Contatto referente" value={formJob.contatto_referente} onChange={v => setFormJob(f => ({ ...f, contatto_referente: v }))} placeholder="Nome + telefono (es. Stefania 3394240321)" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Fatturato €"   value={formJob.fatturato}   onChange={v => setFormJob(f => ({ ...f, fatturato: Number(v) }))}   type="number" />
              <Field label="Netto model €" value={formJob.netto_model} onChange={v => setFormJob(f => ({ ...f, netto_model: Number(v) }))} type="number" />
            </div>
            <Field label="Rimborso €" value={formJob.rimborso} onChange={v => setFormJob(f => ({ ...f, rimborso: Number(v) }))} type="number" />
            {(formJob.fatturato > 0 || formJob.netto_model > 0) && (
              <div style={{ background: "#F5F5F5", borderRadius: 16, padding: "14px 16px", marginBottom: 14, border: "0.5px solid #EBEBEB" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Anteprima</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 16, color: "#767676" }}>Guadagno Peacock</span>
                  <span style={{ fontSize: 16, color: "#000000" }}>{fmt(calcGuadagnoPeacock(formJob))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: "#000000" }}>Netto al model</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#000000" }}>{fmt(calcDaPagareModel(formJob))}</span>
                </div>
              </div>
            )}
            <SelectField label="Stato job"       value={formJob.stato_job}       onChange={v => setFormJob(f => ({ ...f, stato_job: v }))}       options={["confermato", "in attesa", "completato", "interno"]} />
            <SelectField label="Stato pagamento" value={formJob.stato_pagamento} onChange={v => setFormJob(f => ({ ...f, stato_pagamento: v }))} options={["da pagare", "in attesa", "pagato"]} />
            <Field label="Note" value={formJob.note} onChange={v => setFormJob(f => ({ ...f, note: v }))} />
            <PrimaryBtn onClick={saveJob}>Salva Job</PrimaryBtn>
          </div>
        )}
        {/* ── LISTA CASTINGS (admin) ── */}
        {view === "castings" && (
          <div style={{ padding: "16px" }}>
            {castings.length === 0 ? (
              <div style={{ background: "#FFFFFF", borderRadius: 18, padding: "32px 20px", textAlign: "center", border: "0.5px solid #EBEBEB" }}>
                <div style={{ fontSize: 17, color: "#767676", marginBottom: 12 }}>Nessun casting ancora creato</div>
                <div style={{ fontSize: 15, color: "#9C948A", lineHeight: 1.5 }}>Crea un casting per raccogliere candidature dai model.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {castings.map(c => {
                  const nCand = candidature.filter(k => k.casting_id === c.id).length;
                  return (
                    <div key={c.id} onClick={() => { setSelectedCasting(c); setView("dettaglio_casting"); }}
                      style={{ background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 18, padding: "16px", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#000000" }}>{c.brand}</div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 100, border: "0.5px solid #EBEBEB", color: "#767676", background: "#F5F5F5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {c.genere}
                        </span>
                      </div>
                      <div style={{ fontSize: 16, color: "#767676", marginBottom: 8 }}>
                        {c.tipologia}{c.data ? " · " + fmtDate(c.data) : ""}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#000000" }}>{nCand}</span>
                        <span style={{ fontSize: 14, color: "#767676" }}>{nCand === 1 ? "candidatura" : "candidature"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* ── NUOVO / MODIFICA CASTING ── */}
        {view === "nuovo_casting" && (
          <div style={{ padding: "16px" }}>
            <SelectField label="Genere" value={formCasting.genere} onChange={v => setFormCasting(f => ({ ...f, genere: v }))} options={["donna", "uomo"]} />
            <Field label="Brand / Cliente *" value={formCasting.brand} onChange={v => setFormCasting(f => ({ ...f, brand: v }))} placeholder="es. Zara" />
            <Field label="Tipologia *" value={formCasting.tipologia} onChange={v => setFormCasting(f => ({ ...f, tipologia: v }))} placeholder="es. Lookbook SS26" />
            <Field label="Data shooting" value={formCasting.data} onChange={v => setFormCasting(f => ({ ...f, data: v }))} type="date" />
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "inherit" }}>Caratteristiche richieste</label>
              <textarea value={formCasting.caratteristiche} onChange={e => setFormCasting(f => ({ ...f, caratteristiche: e.target.value }))} placeholder="Altezza, età, tipologia, note aggiuntive..."
                style={{ width: "100%", minHeight: 110, background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 12, color: "#000000", fontSize: 17, padding: "13px 15px", fontFamily: "inherit", boxSizing: "border-box", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
            </div>
            <PrimaryBtn onClick={saveCasting}>Salva casting</PrimaryBtn>
            {formCasting.id && (
              <button onClick={() => { if (window.confirm("Eliminare questo casting? Verranno rimosse anche tutte le candidature.")) deleteCasting(formCasting.id); }}
                style={{ width: "100%", marginTop: 8, padding: "13px", background: "transparent", border: "1.5px solid #FCA5A5", borderRadius: 16, color: "#000000", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
                Elimina casting
              </button>
            )}
          </div>
        )}
        {/* ── DETTAGLIO CASTING ── */}
        {view === "dettaglio_casting" && selectedCasting && (() => {
          const cast = castings.find(c => c.id === selectedCasting.id) || selectedCasting;
          const candidati = candidature
            .filter(k => k.casting_id === cast.id)
            .map(k => ({ cand: k, mod: modelle.find(m => m.id === k.modella_id) }))
            .filter(x => x.mod);
          return (
            <div style={{ padding: "20px 16px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <Badge label={cast.genere} color="#000000" bg="#F5F5F5" />
                {cast.data && <Badge label={fmtDate(cast.data)} color="#767676" bg="#F5F5F5" />}
              </div>
              <PaddedSection title="Dettagli casting">
                <InfoRow label="Brand" val={cast.brand} />
                <Divider />
                <InfoRow label="Tipologia" val={cast.tipologia} />
                <Divider />
                <InfoRow label="Data shooting" val={fmtDate(cast.data)} />
                {cast.caratteristiche && (
                  <>
                    <Divider />
                    <div style={{ padding: "12px 0" }}>
                      <div style={{ fontSize: 16, color: "#767676", marginBottom: 6 }}>Caratteristiche</div>
                      <div style={{ fontSize: 16, color: "#000000", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{cast.caratteristiche}</div>
                    </div>
                  </>
                )}
              </PaddedSection>
              <Section title={`Candidature · ${candidati.length}`}>
                {candidati.length === 0 ? (
                  <div style={{ padding: "20px 16px", fontSize: 16, color: "#767676", textAlign: "center" }}>Nessuna candidatura ancora</div>
                ) : (
                  candidati.map(({ cand, mod }, i) => (
                    <div key={cand.id}>
                      <div onClick={() => { setSelectedModella(mod); setView("scheda_modella"); }}
                        style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#EBEBEB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                          {mod.foto_profilo ? (
                            <img src={mod.foto_profilo} alt={mod.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#767676" }}>{mod.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 600, color: "#000000" }}>{mod.nome}</div>
                          <div style={{ fontSize: 14, color: "#767676" }}>{mod.contratto_tipo || mod.tipo || "—"}</div>
                        </div>
                        <span style={{ fontSize: 16, color: "#C4A882" }}>›</span>
                      </div>
                      {i < candidati.length - 1 && <Divider />}
                    </div>
                  ))
                )}
              </Section>
              <GhostBtn onClick={() => { setFormCasting(cast); setView("nuovo_casting"); }}>Modifica casting</GhostBtn>
              <button onClick={() => { if (window.confirm("Eliminare questo casting? Verranno rimosse anche tutte le candidature.")) deleteCasting(cast.id); }}
                style={{ width: "100%", marginTop: 8, padding: "12px", background: "transparent", border: "1.5px solid #FCA5A5", borderRadius: 14, color: "#000000", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
                Elimina casting
              </button>
            </div>
          );
        })()}
        {/* ── CALCOLATRICE ── */}
        {view === "calcolatrice" && (
          <div style={{ padding: "20px 16px" }}>
            <p style={{ fontSize: 16, color: "#767676", marginBottom: 20, lineHeight: 1.5 }}>Calcolo rapido ritenuta e netto model.</p>
            <CalcolatoreSemplice />
          </div>
        )}
      </div>
    </div>
  );
}
function CalcolatoreSemplice() {
  const [tab, setTab] = useState("inversa"); // "inversa" | "diretta"
  // Calcolatrice inversa (dal netto)
  const [nettoDes, setNettoDes] = useState(0);
  const [rimborsoInv, setRimborsoInv] = useState(0);
  const lordoInv    = nettoDes > 0 ? nettoDes / 0.8 : 0;
  const ritenuta    = lordoInv * 0.2;
  const totaleInv   = lordoInv + rimborsoInv;
  // Calcolatrice diretta (dal fatturato): planning pre-job
  const [fatturato, setFatturato]     = useState(0);
  const [nettoModelD, setNettoModelD] = useState(0);
  const [rimborso, setRimborso]       = useState(0);
  const guadagnoPeacock = fatturato - nettoModelD - rimborso;
  const nettoDaPagare   = nettoModelD + rimborso;
  const Field2 = ({ label, value, onChange, placeholder = "" }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 17, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
      <input type="number" value={value || ""} placeholder={placeholder} onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", background: "#FFFFFF", border: "0.5px solid #EBEBEB", borderRadius: 12, color: "#000000", fontSize: 17, padding: "13px 15px", fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
    </div>
  );
  const Row = ({ l, v, bold, big }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid #EBEBEB" }}>
      <span style={{ fontSize: bold ? 13 : 12, fontWeight: bold ? 600 : 400, color: bold ? "#1C1714" : "#9C948A" }}>{l}</span>
      <span style={{ fontSize: big ? 20 : bold ? 13 : 12, fontWeight: big ? 800 : bold ? 600 : 400, color: "#000000" }}>{v}</span>
    </div>
  );
  return (
    <>
      {/* Tab switcher */}
      <div style={{ display: "flex", background: "#F0EAE0", borderRadius: 12, padding: 3, marginBottom: 20 }}>
        {[["inversa", "Dal netto"], ["diretta", "Dal fatturato"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: tab === k ? "#1C1714" : "transparent", color: tab === k ? "#FFF" : "#9C948A", fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {l}
          </button>
        ))}
      </div>
      {tab === "inversa" && (
        <>
          <Field2 label="Netto desiderato €" value={nettoDes} onChange={setNettoDes} placeholder="es. 400" />
          <Field2 label="Rimborso viaggio €" value={rimborsoInv} onChange={setRimborsoInv} placeholder="es. 50" />
          {nettoDes > 0 && (
            <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px", border: "0.5px solid #EBEBEB", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Risultato</div>
              <Row l="Lordo da dichiarare" v={`€${lordoInv.toFixed(2)}`} />
              <Row l="Ritenuta 20%" v={`– €${ritenuta.toFixed(2)}`} />
              {rimborsoInv > 0 && <Row l="Rimborso viaggio" v={`+ €${rimborsoInv.toFixed(2)}`} />}
              <div style={{ marginTop: 14, background: "#F5F5F5", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: rimborsoInv > 0 ? 8 : 0 }}>
                  <span style={{ fontSize: 17, fontWeight: 600, color: "#000000" }}>Netto in tasca</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#000000", letterSpacing: "-0.03em" }}>€{nettoDes.toFixed(2)}</span>
                </div>
                {rimborsoInv > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 16, color: "#767676" }}>+ rimborso viaggio</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#767676" }}>€{rimborsoInv.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, background: "#EFF6FF", borderRadius: 12, padding: "10px 14px", fontSize: 17, color: "#1D4ED8", lineHeight: 1.5 }}>
                💡 Comunica all'agenzia che vuoi <strong>€{lordoInv.toFixed(2)} lordi</strong> per ricevere €{nettoDes.toFixed(2)} netti
              </div>
            </div>
          )}
        </>
      )}
      {tab === "diretta" && (
        <>
          <Field2 label="Fatturato cliente €" value={fatturato}   onChange={setFatturato}   placeholder="es. 500" />
          <Field2 label="Netto model €"       value={nettoModelD} onChange={setNettoModelD} placeholder="es. 300" />
          <Field2 label="Rimborso spese €"    value={rimborso}    onChange={setRimborso}    placeholder="es. 50" />
          {fatturato > 0 && nettoModelD > 0 && (
            <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "20px", border: "0.5px solid #EBEBEB", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Risultato</div>
              {[
                { l: "Fatturato", v: `€${fatturato.toFixed(2)}` },
                { l: "Netto model", v: `– €${nettoModelD.toFixed(2)}` },
                ...(rimborso > 0 ? [{ l: "Rimborso", v: `– €${rimborso.toFixed(2)}` }] : []),
                { l: "Guadagno Peacock", v: `€${guadagnoPeacock.toFixed(2)}` },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid #EBEBEB" }}>
                  <span style={{ fontSize: 16, color: "#767676" }}>{r.l}</span>
                  <span style={{ fontSize: 16, color: "#767676" }}>{r.v}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, background: "#F5F5F5", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#000000" }}>Netto da pagare al model</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: "#000000", letterSpacing: "-0.04em" }}>€{nettoDaPagare.toFixed(2)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
function ChangePasswordSection({ showToast }) {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!pw1 || pw1.length < 6) { showToast("La password deve avere almeno 6 caratteri", true); return; }
    if (pw1 !== pw2) { showToast("Le password non coincidono", true); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setLoading(false);
    if (error) { showToast(error.message, true); return; }
    setPw1(""); setPw2("");
    showToast("Password aggiornata ✓");
  };
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "16px", border: "0.5px solid #EBEBEB" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#767676", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Cambia password</div>
      <div style={{ fontSize: 14, color: "#9C948A", marginBottom: 14, lineHeight: 1.4 }}>Se sei entrato con la password temporanea, cambiala subito con una tua personale.</div>
      <Field label="Nuova password" value={pw1} onChange={setPw1} type="password" />
      <Field label="Conferma password" value={pw2} onChange={setPw2} type="password" />
      <button onClick={submit} disabled={loading}
        style={{ width: "100%", padding: "13px", background: loading ? "#E5E0D8" : "#1C1714", border: "none", borderRadius: 14, color: "#FFF", fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
        {loading ? "Aggiornamento..." : "Aggiorna password"}
      </button>
    </div>
  );
}
