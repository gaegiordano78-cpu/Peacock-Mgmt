import { NextRequest, NextResponse } from 'next/server';
import { fetchRoster, fetchTalent } from '../../lib/talent-source.mjs';
import { presentationHtml } from '../../lib/talent-presentations.mjs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')?.trim().toLowerCase();
  if(request.nextUrl.searchParams.get('roster') !== '1' && (!slug || !/^[a-z0-9-]{1,60}$/.test(slug))) return NextResponse.json({error:'Profilo non valido.'},{status:400});
  try {
    const data = request.nextUrl.searchParams.get('roster') === '1' ? {talents:await fetchRoster()} : await fetchTalent(slug);
    if(request.nextUrl.searchParams.get('format')==='html' && slug && !('talents' in data)) return new NextResponse(presentationHtml([data]),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; img-src https://peacockmodels.com https://www.peacockmodels.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"}});
    return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});
  } catch(e) {
    return NextResponse.json({error:e instanceof Error?e.message:'Impossibile recuperare i dati ufficiali Peacock.'},{status:502,headers:{'Cache-Control':'no-store'}});
  }
}
