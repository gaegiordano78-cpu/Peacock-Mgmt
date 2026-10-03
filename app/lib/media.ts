// @ts-nocheck
// Utility media: compressione immagini lato browser + zip senza dipendenze.

export const MAX_VIDEO_MB = 50;

export const isVideoFile = (file: File) =>
  (file.type || "").startsWith("video/") || /\.(mp4|mov|m4v|webm)$/i.test(file.name || "");

// Ridimensiona a lato lungo `maxSide` e ricomprime in JPEG.
// Se il browser non riesce a decodificare (es. RAW .cr3) lancia un errore leggibile.
export async function compressImage(file: Blob, maxSide = 2000, quality = 0.82): Promise<Blob> {
  let bitmap: any = null;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" } as any);
  } catch {
    bitmap = await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Formato non supportato: carica una foto JPG o PNG")); };
      img.src = url;
    });
  }
  const w = bitmap.width, h = bitmap.height;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  const cw = Math.round(w * scale), ch = Math.round(h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(bitmap, 0, 0, cw, ch);
  if (bitmap.close) bitmap.close();
  const out: Blob = await new Promise((res, rej) => canvas.toBlob(b => (b ? res(b) : rej(new Error("Compressione fallita"))), "image/jpeg", quality));
  // Se l'originale era già più leggero, tieni l'originale
  return out.size < file.size ? out : file;
}

// ── ZIP (metodo STORE, nessuna compressione: le foto sono già compresse) ──
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function makeZip(files: { name: string; data: Uint8Array }[]): Blob {
  const enc = new TextEncoder();
  const parts: BlobPart[] = [];
  const central: BlobPart[] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
    lh.setUint16(8, 0, true); lh.setUint32(14, crc, true); lh.setUint32(18, size, true); lh.setUint32(22, size, true);
    lh.setUint16(26, name.length, true);
    parts.push(lh.buffer, name, f.data);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, size, true); ch.setUint32(24, size, true);
    ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
    central.push(ch.buffer, name);
    offset += 30 + name.length + size;
  }
  const centralSize = central.reduce((s: number, p: any) => s + (p.byteLength ?? p.length), 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end.buffer], { type: "application/zip" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export const POLA_SLOTS = [
  { slot: "pola_primo_piano", label: "Primo piano" },
  { slot: "pola_mezzo_busto", label: "Mezzo busto" },
  { slot: "pola_figura_intera", label: "Figura intera" },
  { slot: "pola_profilo_sx", label: "Profilo SX" },
  { slot: "pola_profilo_dx", label: "Profilo DX" },
  { slot: "pola_mani", label: "Mani" },
];
export const VIDEO_SLOTS = [
  { slot: "video_1", label: "Presentazione" },
  { slot: "video_2", label: "Camminata" },
  { slot: "video_3", label: "Libero" },
];
export const MISURE = [
  { key: "altezza", label: "Altezza", ph: "cm" },
  { key: "petto", label: "Petto", ph: "cm" },
  { key: "vita", label: "Vita", ph: "cm" },
  { key: "fianchi", label: "Fianchi", ph: "cm" },
  { key: "taglia", label: "Taglia", ph: "IT" },
  { key: "scarpe", label: "Scarpe", ph: "EU" },
  { key: "occhi", label: "Occhi", ph: "" },
  { key: "capelli", label: "Capelli", ph: "" },
];

// Riconverte un video nel browser: 720p, MP4 (H.264) se supportato. Dura quanto il video.
// Se il browser non supporta la registrazione, restituisce null (si carica l'originale).
export async function compressVideo(file: File, onProgress?: (p: number) => void): Promise<{ blob: Blob; ext: string; type: string } | null> {
  if (typeof MediaRecorder === "undefined") return null;
  const types = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"];
  const mime = types.find(t => { try { return MediaRecorder.isTypeSupported(t); } catch { return false; } });
  if (!mime) return null;
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url; video.playsInline = true; video.muted = false; video.preload = "auto";
  (video as any).setAttribute("playsinline", "");
  try {
    await new Promise<void>((res, rej) => { video.onloadedmetadata = () => res(); video.onerror = () => rej(new Error("video")); });
    const w0 = video.videoWidth, h0 = video.videoHeight;
    if (!w0 || !h0 || !isFinite(video.duration)) return null;
    const scale = Math.min(1, 720 / Math.min(w0, h0));
    const w = Math.round(w0 * scale / 2) * 2, h = Math.round(h0 * scale / 2) * 2;
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    const stream = (canvas as any).captureStream(30) as MediaStream;
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        const ac = new AC(); const src = ac.createMediaElementSource(video); const dest = ac.createMediaStreamDestination();
        src.connect(dest);
        dest.stream.getAudioTracks().forEach((t: MediaStreamTrack) => stream.addTrack(t));
      }
    } catch {}
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 2_500_000, audioBitsPerSecond: 96_000 });
    const chunks: Blob[] = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise<void>(res => { rec.onstop = () => res(); });
    let raf = 0;
    const draw = () => { ctx.drawImage(video, 0, 0, w, h); onProgress && onProgress(Math.min(1, video.currentTime / video.duration)); raf = requestAnimationFrame(draw); };
    rec.start(1000);
    await video.play();
    draw();
    await new Promise<void>(res => { video.onended = () => res(); });
    cancelAnimationFrame(raf);
    rec.stop(); await done;
    const type = mime.split(";")[0];
    const blob = new Blob(chunks, { type });
    if (!blob.size || blob.size >= file.size) return null;
    return { blob, ext: type === "video/mp4" ? "mp4" : "webm", type };
  } catch { return null; }
  finally { URL.revokeObjectURL(url); video.src = ""; }
}
