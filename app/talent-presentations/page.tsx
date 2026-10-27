'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PEACOCK_LOGO, presentationHtml } from '../lib/talent-presentations.mjs';
import styles from './presentations.module.css';
const authClient = createClient('https://xtpafxourildjnofeulr.supabase.co','sb_publishable_u9bT7JY0grFwVFrRnLxkhw_fVI84jIC');
type RosterTalent = {slug:string; name:string; profile:string};
type Talent = RosterTalent & {cover:string; width:number; height:number; cardCover?:string; cardWidth?:number; cardHeight?:number};
async function decodedImage(src:string) {
  const image = new Image();
  image.referrerPolicy = 'no-referrer';
  image.src = src;
  await Promise.race([image.decode(),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('La fotografia non si carica. Riprova.')),12000))]);
  if(!image.naturalWidth || !image.naturalHeight) throw new Error('La fotografia non può essere visualizzata.');
}
export default function TalentPresentations() {
  const [roster,setRoster] = useState<RosterTalent[]>([]);
  const [talents,setTalents] = useState<Talent[]>([]);
  const [query,setQuery] = useState('');
  const [loading,setLoading] = useState('yile');
  const [rosterLoading,setRosterLoading] = useState(true);
  const [error,setError] = useState('');
  const [rosterError,setRosterError] = useState('');
  const [view,setView] = useState<'desktop'|'mobile'>('desktop');
  const [exporting,setExporting] = useState(false);
  const [sendingTest,setSendingTest] = useState(false);
  const [mailCheck,setMailCheck] = useState<'idle'|'checking'|'ready'|'error'>('idle');
  const [mailError,setMailError] = useState('');
  const [adminAuth,setAdminAuth] = useState<'checking'|'signed_out'|'admin'|'not_admin'>('checking');
  const [authEmail,setAuthEmail] = useState('');
  const [authPassword,setAuthPassword] = useState('');
  const [authBusy,setAuthBusy] = useState(false);
  const [authError,setAuthError] = useState('');
  const [status,setStatus] = useState('');
  const [previewValid,setPreviewValid] = useState(true);
  async function checkMailConnection(token:string) {
    setMailCheck('checking');setMailError('');
    try{const r=await fetch('/api/talent-presentations/send-test',{headers:{Authorization:'Bearer '+token},cache:'no-store'});const data=await r.json();if(!r.ok)throw new Error(data.error||'Collegamento Nina non disponibile.');setMailCheck('ready');}
    catch(e){setMailCheck('error');setMailError(e instanceof Error?e.message:'Collegamento Nina non disponibile.');}
  }
  async function checkAdmin() {
    const {data:{session}}=await authClient.auth.getSession();
    if(!session?.user){setAdminAuth('signed_out');setMailCheck('idle');return;}
    const {data,error:roleError}=await authClient.from('profiles').select('ruolo').eq('id',session.user.id).single();
    const isAdmin=!roleError&&data?.ruolo==='admin';
    setAdminAuth(isAdmin?'admin':'not_admin');
    if(isAdmin)await checkMailConnection(session.access_token);else setMailCheck('idle');
  }
  async function signInAdmin(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthBusy(true);setAuthError('');
    const {data,error:loginError}=await authClient.auth.signInWithPassword({email:authEmail.trim(),password:authPassword});
    setAuthPassword('');
    if(loginError||!data.user) {
      setAuthError('Accesso non riuscito: controlla le credenziali Peacock.');
      setAdminAuth('signed_out');
    } else {
      const {data:profile,error:roleError}=await authClient.from('profiles').select('ruolo').eq('id',data.user.id).single();
      if(roleError||profile?.ruolo!=='admin') {
        await authClient.auth.signOut();
        setAdminAuth('signed_out');
        setAuthError('L’account non ha i permessi di amministratore.');
      } else {setAdminAuth('admin');if(data.session?.access_token)await checkMailConnection(data.session.access_token);}
    }
    setAuthBusy(false);
  }
  async function signOutAdmin() {
    await authClient.auth.signOut();
    setAdminAuth('signed_out');setMailCheck('idle');setMailError('');
  }
  async function loadTalent(slug:string):Promise<Talent> {
    const r = await fetch('/api/talent-presentations?slug='+encodeURIComponent(slug),{cache:'no-store'});
    const data = await r.json();
    if(!r.ok)throw new Error(data.error || 'Profilo non disponibile.');
    await Promise.all([decodedImage(data.cover),decodedImage(PEACOCK_LOGO),...(data.cardCover?[decodedImage(data.cardCover)]:[])]);
    return data;
  }
  useEffect(()=>{
    (window as any).__hideSplash?.();
    void checkAdmin();
    const {data:{subscription}}=authClient.auth.onAuthStateChange(()=>{void checkAdmin();});
    let active=true;
    fetch('/api/talent-presentations?roster=1',{cache:'no-store'}).then(async r=>{
      const d=await r.json();if(!r.ok)throw new Error(d.error||'Roster non disponibile.');
      if(active)setRoster(d.talents);
    }).catch(e=>{if(active)setRosterError(e.message);}).finally(()=>{if(active)setRosterLoading(false);});
    loadTalent('yile').then(t=>{if(active)setTalents([t]);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading('');});
    return ()=>{active=false;subscription.unsubscribe();};
  },[]);
  async function toggle(t:RosterTalent) {
    setError('');setStatus('');
    if(talents.some(x=>x.slug===t.slug)){setTalents(old=>old.filter(x=>x.slug!==t.slug));return;}
    if(talents.length>=20){setError('Puoi presentare al massimo 20 talenti per email.');return;}
    setLoading(t.slug);
    try {const data=await loadTalent(t.slug);setTalents(old=>old.some(x=>x.slug===data.slug)?old:[...old,data]);setPreviewValid(true);}
    catch(e){setError(e instanceof Error?e.message:'Fotografia non disponibile.');}
    finally{setLoading('');}
  }
  async function sendTest() {
    if(!talents.length || !previewValid || sendingTest || !!loading)return;
    if(adminAuth!=='admin'){setAuthError('Accedi come amministratore per inviare una prova.');return;}
    if(mailCheck!=='ready'){setError('Verifica prima il collegamento email Nina.');return;}
    const recipient = 'info@gaetanogiordano.com';
    const sender = 'hello@peacockmodels.com';
    const subject=(talents.length===1?'PROVA — INTRODUCING '+talents[0].name.toUpperCase():'PROVA — NUOVI VOLTI, NUOVE STORIE.')+' — '+new Intl.DateTimeFormat('it-IT',{timeZone:'Europe/Rome',dateStyle:'short',timeStyle:'medium'}).format(new Date());
    if(!window.confirm('INVIO REALE DI UNA EMAIL DI PROVA\n\nDa: '+sender+'\nA: '+recipient+'\nOggetto: '+subject+'\n\nConfermi l’invio?'))return;
    setSendingTest(true);setError('');setStatus('');
    try {
      await Promise.all([decodedImage(PEACOCK_LOGO),...talents.map(t=>decodedImage(talents.length>1?(t.cardCover||t.cover):t.cover))]);
      const {data:{session}}=await authClient.auth.getSession();
      if(!session?.access_token)throw new Error('Accedi come amministratore Peacock per inviare la prova.');
      const htmlBytes=new TextEncoder().encode(presentationHtml(talents));
      const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',htmlBytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
      const r=await fetch('/api/talent-presentations/send-test',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
        body:JSON.stringify({slugs:talents.map(t=>t.slug),destinatario:recipient,oggetto:subject,html_sha256:hash,conferma:true})
      });
      const data=await r.json();
      if(!r.ok)throw new Error(data.error||'Impossibile inviare la prova.');
      setStatus('Prova accettata dal servizio email Nina. Controlla '+recipient+' e la cartella Spam.');
    }catch(e){setError(e instanceof Error?e.message:'Invio della prova non riuscito.');}
    finally{setSendingTest(false);}
  }
  async function exportHtml() {
    if(!talents.length || !previewValid)return;
    setExporting(true);setError('');setStatus('');
    try {
      await Promise.all([decodedImage(PEACOCK_LOGO),...talents.map(t=>decodedImage(talents.length>1?(t.cardCover||t.cover):t.cover))]);
      const url=URL.createObjectURL(new Blob([presentationHtml(talents)],{type:'text/html;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download=talents.length===1?`peacock-introducing-${talents[0].slug}.html`:'peacock-nuovi-volti.html';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      setStatus('HTML scaricato. L’invio resta a cura di Gae.');
    } catch(e){setPreviewValid(false);setError(e instanceof Error?e.message:'Immagine non disponibile: esportazione bloccata.');}
    finally{setExporting(false);}
  }
  const filtered=roster.filter(t=>(t.name+' '+t.slug).toLocaleLowerCase('it').includes(query.toLocaleLowerCase('it')));
  let html='', layoutError='';
  if(talents.length&&previewValid){try{html=presentationHtml(talents);}catch(e){layoutError=e instanceof Error?e.message:'Copertine uniformi non disponibili.';}}
  const frameHeight=talents.length===1?Math.ceil(700+(view==='mobile'?343:512)*talents[0].height/talents[0].width):view==='mobile'?500+talents.reduce((sum,t)=>sum+343*t.height/t.width+80,0):500+talents.reduce((sum,t,i)=>i%2===0?sum+248*Math.max(t.height/t.width,talents[i+1]?talents[i+1].height/talents[i+1].width:0)+80:sum,0);
  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.back}>← Peacock MGMT</a><span className={styles.label}>PRESENTAZIONI TALENTI</span><h1>Talent Presentations</h1><p>Seleziona i talenti e prepara la tua presentazione editoriale.</p></header>
    <div className={styles.workspace}>
      <section className={styles.panel} aria-label="Selezione talenti">
        <div className={styles.sectionHead}><h2>Roster Peacock</h2><span>{roster.length || '—'} talenti</span></div>
        <label htmlFor="talent-search" className={styles.srOnly}>Cerca un talento</label>
        <input id="talent-search" className={styles.search} placeholder="Cerca per nome" value={query} onChange={e=>setQuery(e.target.value)}/>
        {rosterLoading&&<p role="status" className={styles.muted}>Caricamento roster…</p>}
        {rosterError&&<div role="alert" className={styles.error}>{rosterError} <button onClick={()=>window.location.reload()}>Riprova</button></div>}
        <div className={styles.roster}>
          {filtered.map(t=><label key={t.slug} className={styles.rosterRow}>
            <input type="checkbox" checked={talents.some(x=>x.slug===t.slug)} disabled={!!loading||exporting} onChange={()=>toggle(t)}/>
            <span>{t.name}</span>{loading===t.slug&&<span className={styles.muted}>Caricamento…</span>}
          </label>)}
          {!rosterLoading&&!rosterError&&!filtered.length&&<p className={styles.muted}>Nessun talento trovato.</p>}
        </div>
        <div className={styles.sectionHead}><h2>Selezione</h2><span>{talents.length}/20</span></div>
        {talents.map((t,index)=><div key={t.slug} className={styles.selected}>
          <img src={t.cover} alt={t.name} onError={()=>{setPreviewValid(false);setError(`La fotografia di ${t.name} non è visibile. Riprova a selezionare il talento.`);}}/>
          <div><strong>{t.name}</strong><a href={t.profile} target="_blank" rel="noreferrer">Scheda ufficiale ↗</a></div>
          <div className={styles.orderButtons}>
            <button aria-label={`Sposta ${t.name} in alto`} disabled={index===0||!!loading||exporting} onClick={()=>setTalents(old=>{const next=[...old];[next[index-1],next[index]]=[next[index],next[index-1]];return next;})}>↑</button>
            <button aria-label={`Rimuovi ${t.name}`} disabled={!!loading||exporting} onClick={()=>{setTalents(old=>old.filter(x=>x.slug!==t.slug));setPreviewValid(true);setError('');}}>×</button>
          </div>
        </div>)}
        {!talents.length&&!loading&&<p className={styles.muted}>Seleziona almeno un talento dal roster.</p>}
        {(error||layoutError)&&<p role="alert" className={styles.error}>{error||layoutError}</p>}
        {loading==='yile'&&<p role="status" className={styles.muted}>Recupero della copertina ufficiale di Yile…</p>}
        <button className={styles.export} onClick={exportHtml} disabled={!talents.length||!previewValid||!!loading||exporting||sendingTest}>{exporting?'Verifica immagini…':'Scarica HTML email'}</button>
        <div style={{border:'1px solid #ddd',padding:15,marginTop:16}}>
          <strong style={{fontSize:13}}>Accesso per email di prova</strong>
          {adminAuth==='checking'&&<p className={styles.muted}>Verifica sessione amministratore…</p>}
          {adminAuth==='admin'&&<div style={{marginTop:10}}><p className={styles.muted}>Sessione amministratore attiva.</p>{mailCheck==='checking'&&<p className={styles.muted}>Verifica collegamento email Nina…</p>}{mailCheck==='ready'&&<p className={styles.muted}>Collegamento email Nina pronto.</p>}{mailCheck==='error'&&<><p role="alert" className={styles.error}>{mailError}</p><button type="button" onClick={()=>void checkAdmin()}>Riprova collegamento</button></>}<button type="button" onClick={signOutAdmin} style={{border:0,background:'none',textDecoration:'underline',padding:0,cursor:'pointer'}}>Esci</button></div>}
          {(adminAuth==='signed_out'||adminAuth==='not_admin')&&<form onSubmit={signInAdmin} style={{display:'grid',gap:9,marginTop:12}}>
            <p className={styles.note}>Nelle anteprime Vercel devi accedere separatamente con l'account amministratore dell'app Peacock.</p>
            <label htmlFor="preview-admin-email" style={{fontSize:12}}>Email amministratore</label>
            <input id="preview-admin-email" type="email" autoComplete="username" required value={authEmail} onChange={e=>setAuthEmail(e.target.value)} style={{width:'100%',padding:10,border:'1px solid #bbb'}}/>
            <label htmlFor="preview-admin-password" style={{fontSize:12}}>Password Peacock</label>
            <input id="preview-admin-password" type="password" autoComplete="current-password" required value={authPassword} onChange={e=>setAuthPassword(e.target.value)} style={{width:'100%',padding:10,border:'1px solid #bbb'}}/>
            <button type="submit" disabled={authBusy} style={{padding:11,background:'#171717',color:'#fff',border:0}}>{authBusy?'Accesso in corso…':'Accedi come amministratore'}</button>
          </form>}
          {authError&&<p role="alert" className={styles.error}>{authError}</p>}
        </div>
        <button className={styles.export} onClick={sendTest} disabled={adminAuth!=='admin'||mailCheck!=='ready'||!talents.length||!previewValid||!!loading||exporting||sendingTest||!!layoutError} style={{background:'#fff',color:'#171717',border:'1px solid #171717',marginTop:10,opacity:adminAuth==='admin'?1:.55}}>{sendingTest?'Invio prova in corso…':'Invia email di prova'}</button>
        <p className={styles.note}>Mittente fisso: hello@peacockmodels.com<br/>Destinatario prova: info@gaetanogiordano.com<br/>L’invio richiede una conferma e l’accesso amministratore.</p>
        {status&&<p role="status" className={styles.muted}>{status}</p>}
        <p className={styles.note}>Una copertina originale per talento, dal sito Peacock.<br/>L’invio avviene solo con il pulsante e la tua conferma.</p>
      </section>
      <section className={styles.preview} aria-label="Anteprima newsletter">
        <div className={styles.previewHead}><h2>Anteprima email</h2><div className={styles.tabs} role="group" aria-label="Formato anteprima"><button aria-pressed={view==='desktop'} onClick={()=>setView('desktop')}>Desktop</button><button aria-pressed={view==='mobile'} onClick={()=>setView('mobile')}>Mobile</button></div></div>
        <div className={styles.previewStage}>
          {html?<iframe title="Anteprima presentazione" srcDoc={html} sandbox="allow-popups allow-popups-to-escape-sandbox" className={view==='mobile'?styles.mobileFrame:styles.desktopFrame} style={{height:Math.ceil(frameHeight)}}/>:<div className={styles.empty}>{loading?'Preparazione dell’anteprima…':previewValid?'Seleziona un talento per visualizzare la presentazione.':'Anteprima non disponibile: controlla le fotografie.'}</div>}
        </div>
      </section>
    </div>
  </main>;
}

