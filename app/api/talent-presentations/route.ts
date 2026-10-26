import { NextRequest, NextResponse } from "next/server";

const HOST = "peacockmodels.com";
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#038;/g, "&").replace(/&quot;/g, '"');
function normalize(src: string, base: string): string | null {
  try {
    const url = new URL(decode(src), base);
    if (url.protocol !== "https:" || !([HOST, "www." + HOST].includes(url.hostname))) return null;
    if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url.pathname + url.search)) return null;
    return url.toString();
  } catch { return null; }
}
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")?.trim().toLowerCase();
  if (!slug || !/^[a-z0-9-]{1,60}$/.test(slug)) return NextResponse.json({ error: "Slug non valido" }, { status: 400 });
  const profile = `https://peacockmodels.com/modello/${slug}/`;
  try {
    const response = await fetch(profile, { headers: { "User-Agent": "PeacockTalentPresentations/1.0" }, cache: "no-store", signal: AbortSignal.timeout(9000) });
    if (!response.ok) return NextResponse.json({ error: "Profilo non raggiungibile" }, { status: 502 });
    const html = await response.text();
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.split(/[|–-]/)[0]?.trim() || slug;
    const images = new Set<string>();
    const candidates = [
      ...[...html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)/gi)].map(m => m[1]),
      ...[...html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/gi)].map(m => m[1]),
      ...[...html.matchAll(/<(?:img|source)\b[^>]+(?:data-src|data-lazy-src|src|srcset)=["']([^"']+)/gi)].map(m => m[1].split(",")[0].trim().split(/\s+/)[0]),
    ];
    for (const item of candidates) {
      const url = normalize(item, profile);
      if (url && !/logo|icon|avatar|placeholder|favicon/i.test(url)) images.add(url);
    }
    return NextResponse.json({ name: title, profile, images: [...images].slice(0, 24), warning: images.size ? null : "Immagini non estraibili automaticamente: verificare la scheda sul sito." }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Impossibile recuperare il profilo in questo momento" }, { status: 502 });
  }
}
