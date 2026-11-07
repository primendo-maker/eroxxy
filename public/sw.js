// Eroxxy Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { body: event.data.text() }; }
  const title = data.title || "🔥 Eroxxy";
  const options = {
    body: data.body || "Toque pra ver",
    icon: "/manifest-icon.svg",
    badge: "/manifest-icon.svg",
    data: { url: data.url || "/chat" },
    vibrate: [80, 40, 80],
    tag: "eroxxy-msg",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/chat";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const c of wins) {
        if ("focus" in c) { c.navigate(url); return c.focus(); }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
