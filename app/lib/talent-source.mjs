import { officialUrl, PEACOCK_LOGO } from './talent-presentations.mjs';
const API = 'https://peacockmodels.com/wp-json/wp/v2/';
const plain = value => String(value || '').replace(/<[^>]*>/g,'').replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=> { const c=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n); return c>0&&c<=0x10ffff?String.fromCodePoint(c):''; }).replace(/&(amp|quot|apos|lt|gt|nbsp);/g,(_,n)=>({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '}[n])).trim();
async function request(url, fetcher, json = true) {
  const r = await fetcher(url,{headers:{'User-Agent':'PeacockTalentPresentations/2.0'},redirect:'error',cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!r.ok) throw new Error('Il sito Peacock non è raggiungibile. Riprova tra poco.');
  if(json && !(r.headers.get('content-type')||'').includes('application/json')) throw new Error('Il sito Peacock non ha restituito dati validi.');
  return r;
}
export async function fetchRoster(fetcher = fetch) {
  const result = [];
  for(let page=1,total=1;page<=total;page++) {
    const r=await request(`${API}modello?per_page=100&page=${page}&_fields=id,slug,title,link,featured_media`,fetcher);
    total=Number(r.headers.get('x-wp-totalpages')||1);
    if(!Number.isInteger(total)||total<1||total>10)throw new Error('Il roster non è disponibile integralmente. Riprova.');
    const rows=await r.json();
    if(!Array.isArray(rows))throw new Error('Il roster Peacock non è valido.');
    for(const t of rows)if(/^[a-z0-9-]{1,60}$/.test(t.slug)&&officialUrl(t.link)&&plain(t.title?.rendered))result.push({slug:t.slug,name:plain(t.title.rendered),profile:t.link});
  }
  return [...new Map(result.map(t=>[t.slug,t])).values()].sort((a,b)=>a.name.localeCompare(b.name,'it'));
}
export async function verifyImage(url, fetcher = fetch) {
  if(!officialUrl(url,'image'))throw new Error('Fotografia ufficiale non disponibile in un formato email compatibile (JPEG o PNG).');
  const r=await request(url,fetcher,false);
  const mime=(r.headers.get('content-type')||'').split(';')[0].toLowerCase();
  if(!['image/jpeg','image/png'].includes(mime)||Number(r.headers.get('content-length')||0)>10000000)throw new Error('La fotografia non è utilizzabile nell’email.');
  if(!r.body)throw new Error('Immagine vuota.');
  const reader=r.body.getReader();let size=0;const chunks=[];
  try {for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>10000000)throw new Error('Immagine troppo grande.');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
  const data=new Uint8Array(size);let offset=0;for(const c of chunks){data.set(c,offset);offset+=c.length;}
  const jpeg=data[0]===255&&data[1]===216&&data[2]===255&&data[size-2]===255&&data[size-1]===217;
  const png=[137,80,78,71,13,10,26,10].every((v,i)=>data[i]===v)&&size>=24;
  if(size<100||!(mime==='image/jpeg'?jpeg:png))throw new Error('Il file immagine è vuoto o danneggiato.');
  return true;
}
export async function fetchTalent(slug, fetcher = fetch) {
  if(!/^[a-z0-9-]{1,60}$/.test(slug||''))throw new Error('Profilo non valido.');
  const r=await request(`${API}modello?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,link,featured_media`,fetcher);
  const rows=await r.json();
  const t=Array.isArray(rows)&&rows.find(x=>x.slug===slug);
  if(!t||!plain(t.title?.rendered)||!officialUrl(t.link))throw new Error('Talento non trovato nel roster pubblico Peacock.');
  if(!Number.isInteger(t.featured_media)||t.featured_media<=0)throw new Error(`La copertina ufficiale di ${plain(t.title?.rendered)||slug} non è disponibile.`);
  const media=await (await request(`${API}media/${t.featured_media}?_fields=source_url,media_details,mime_type`,fetcher)).json();
  const {width,height}=media.media_details||{};
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<200||height<200)throw new Error('La copertina ufficiale non ha dimensioni valide.');
  await Promise.all([verifyImage(media.source_url,fetcher),verifyImage(PEACOCK_LOGO,fetcher)]);
  return {slug,name:plain(t.title?.rendered),profile:t.link,cover:media.source_url,width,height,logo:PEACOCK_LOGO};
}
