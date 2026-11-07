"use client";
import { useEffect, useState } from "react";
import { enablePush, getCurrentSubscription } from "@/data/push";

export function PushActivator() {
  const [status, setStatus] = useState<"unknown" | "off" | "on" | "denied">("unknown");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof window === "undefined") return;
      if (!("Notification" in window)) { setStatus("denied"); return; }
      if (Notification.permission === "denied") { setStatus("denied"); return; }
      const sub = await getCurrentSubscription();
      setStatus(sub ? "on" : "off");
    })();
  }, []);

  if (status === "on" || status === "unknown") return null;

  async function handle() {
    setLoading(true);
    const r = await enablePush();
    setLoading(false);
    if (r.ok) setStatus("on");
    else alert(r.error || "Erro");
  }

  if (status === "denied") {
    return (
      <div className="bg-surface border border-cream/10 rounded-2xl p-4 mb-4 text-xs text-mist/70">
        🔕 Notificações bloqueadas. Ative nas configurações do navegador pra receber as provocações dela mesmo com o app fechado.
      </div>
    );
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="w-full bg-surface border border-[color:var(--neon-pink)]/40 rounded-2xl p-4 mb-4 flex items-center gap-3 active:scale-[0.99] transition disabled:opacity-50"
    >
      <span className="w-10 h-10 rounded-full bg-[color:var(--neon-pink)]/15 flex items-center justify-center text-lg">🔔</span>
      <div className="flex-1 text-left">
        <p className="text-cream font-medium text-sm">Ativar notificações</p>
        <p className="text-xs text-mist/60">Receba as provocações dela mesmo com o app fechado</p>
      </div>
      <span className="text-cream/50 text-xl">{loading ? "..." : "›"}</span>
    </button>
  );
}
