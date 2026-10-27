const ENDPOINT = 'https://nina-peacock-agent.vercel.app/api/talent-preview-test';

export async function talentMailProxy(method, authorization, body, fetcher = fetch) {
  if(typeof authorization!=='string'||!/^Bearer\s+\S+$/i.test(authorization))return {status:401,body:{error:'Accedi come amministratore Peacock.'}};
  try {
    const response=await fetcher(ENDPOINT,{
      method,headers:{Authorization:authorization,'Content-Type':'application/json'},
      ...(method==='POST'?{body:JSON.stringify(body)}:{}),
      cache:'no-store',redirect:'error',signal:AbortSignal.timeout(55000)
    });
    const data=await response.json();
    return {status:response.status,body:data};
  } catch {
    return {status:503,body:{error:'Collegamento email Nina temporaneamente non disponibile. Nessun reinvio automatico.'}};
  }
}
