import { NextRequest, NextResponse } from 'next/server';
import { talentMailProxy } from '../../../lib/talent-mail-proxy.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const result=await talentMailProxy('GET',request.headers.get('authorization'),undefined);
  return NextResponse.json(result.body,{status:result.status,headers:{'Cache-Control':'no-store'}});
}

export async function POST(request: NextRequest) {
  let payload;
  try{payload=await request.json();}catch{return NextResponse.json({error:'Richiesta non valida.'},{status:400});}
  const result=await talentMailProxy('POST',request.headers.get('authorization'),payload);
  return NextResponse.json(result.body,{status:result.status,headers:{'Cache-Control':'no-store'}});
}
