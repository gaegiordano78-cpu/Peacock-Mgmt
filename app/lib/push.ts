// @ts-nocheck
// Notifiche push lato browser (model).
export const VAPID_PUBLIC = "BMXNr75XVbV4I5Kr4G6TSVD-1hfCfOyEGR5kRhgp0k5OWUzILbErOLL2O9u_JLIPGYda86dy8KYaFdRG0oB_AeA";

export const pushSupported = () =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

// iPhone: le notifiche funzionano solo se l'app è aggiunta alla schermata Home
export const isIOS = () => typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
export const isStandalone = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || (navigator as any).standalone === true);

function b64ToUint8(b64: string) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

export async function pushStatus(): Promise<"on" | "off" | "denied" | "unsupported"> {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = reg && (await reg.pushManager.getSubscription());
  return sub ? "on" : "off";
}

export async function enablePush(supabase) {
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Notifiche non autorizzate");
  let sub = await reg.pushManager.getSubscription();
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(VAPID_PUBLIC) });
  const j = sub.toJSON();
  const { error } = await supabase.from("push_subs").upsert({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth });
  if (error) throw error;
}

// Admin: invia la notifica a tutti i model iscritti
export async function sendPushToModels(supabase, payload: { title: string; body: string; url?: string }) {
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const res = await fetch("/api/push", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return res.json();
}
