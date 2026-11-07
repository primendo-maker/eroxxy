"use client";
import { useEffect, useState } from "react";
import { getPhotoSignedUrl, markMessageViewed } from "@/data/photos";
import type { HeatMessage } from "@/core/types";

const DURATION_ONE_VIEW = 10;

export function PhotoViewer({ msg, isMine, viewerName, onClose }: {
  msg: HeatMessage;
  isMine: boolean;
  viewerName: string;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(msg.is_one_view ? DURATION_ONE_VIEW : 0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!msg.media_url) return;
    getPhotoSignedUrl(msg.media_url).then(setUrl).catch(e => setError(e.message || "erro"));
    // Só marca vista se é foto vida única e eu não sou o dono
    if (msg.is_one_view && !isMine && !msg.viewed_at) {
      markMessageViewed(msg.id);
    }
  }, [msg, isMine]);

  // Timer só pra vida única
  useEffect(() => {
    if (!url || !msg.is_one_view) return;
    if (timer <= 0) { onClose(); return; }
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, url, onClose, msg.is_one_view]);

  const hhmm = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-cream text-2xl z-20 w-10 h-10 flex items-center justify-center bg-black/50 rounded-full">×</button>
      {msg.is_one_view && (
        <div className="absolute top-4 left-4 text-cream text-sm font-mono bg-[color:var(--neon-pink)] px-3 py-1 rounded-full z-20">{timer}s</div>
      )}
      {!msg.is_one_view && (
        <div className="absolute top-4 left-4 text-cream text-xs bg-cream/20 px-3 py-1 rounded-full z-20">💾 sempre disponível</div>
      )}
      {url && !error && (
        <>
          <img src={url} className="max-w-full max-h-full object-contain" alt="" onContextMenu={e => e.preventDefault()} draggable={false} />
          {msg.is_one_view && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none">
              <p className="text-cream/15 text-4xl font-bold rotate-[-20deg]">{viewerName} · {hhmm}</p>
            </div>
          )}
        </>
      )}
      {error && <p className="text-cream">{error}</p>}
      {!url && !error && <p className="text-cream">Carregando...</p>}
    </div>
  );
}
