import { supa } from "./supabase";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - base64.length % 4) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const existing = await navigator.serviceWorker.getRegistration("/sw.js");
    if (existing) return existing;
    return await navigator.serviceWorker.register("/sw.js");
  } catch (e) { return null; }
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  const reg = await registerSW();
  if (!reg) return null;
  return await reg.pushManager.getSubscription();
}

export async function enablePush(): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined") return { ok: false, error: "SSR" };
  if (!("Notification" in window)) return { ok: false, error: "Browser sem Notification API" };
  if (!VAPID_PUBLIC) return { ok: false, error: "VAPID key não configurada" };

  const perm = await Notification.requestPermission();
  if (perm !== "granted") return { ok: false, error: "Permissão negada" };

  const reg = await registerSW();
  if (!reg) return { ok: false, error: "Service Worker falhou" };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
    });
  }

  // Envia subscription pro backend
  const { data: { session } } = await supa.auth.getSession();
  if (!session) return { ok: false, error: "Não logado" };

  const sKey = sub.getKey("p256dh");
  const aKey = sub.getKey("auth");
  const body = {
    endpoint: sub.endpoint,
    p256dh: sKey ? btoa(String.fromCharCode(...new Uint8Array(sKey))) : "",
    auth_key: aKey ? btoa(String.fromCharCode(...new Uint8Array(aKey))) : "",
    user_agent: navigator.userAgent,
  };

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { ok: false, error: (await res.json().catch(() => ({}))).error || "fail" };
  return { ok: true };
}

export async function notifyPartner(toUserId: string, title: string, body: string, url = "/chat") {
  const { data: { session } } = await supa.auth.getSession();
  if (!session) return;
  try {
    await fetch("/api/push/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ to_user_id: toUserId, title, body, url }),
    });
  } catch {}
}
