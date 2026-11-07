import type { HeatMessage } from "@/core/types";

export function MessageBubble({ msg, isMine, onPhotoClick }: {
  msg: HeatMessage;
  isMine: boolean;
  onPhotoClick?: (msg: HeatMessage) => void;
}) {
  const time = new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (msg.type === "photo") {
    const isOneView = msg.is_one_view;
    const viewed = Boolean(msg.viewed_at);
    const locked = isOneView && viewed;
    // Se é foto vida única e já viu, ninguém pode mais abrir
    // Se é sempre disponível, sempre pode abrir

    const label = (() => {
      if (locked) return isMine ? "Visualizada · vida única" : "Já visualizada";
      if (isOneView) return isMine ? "Enviada · vida única 🔥" : "Toque pra ver · vida única 🔥";
      return isMine ? "Enviada · sempre disponível 💾" : "Toque pra ver · sempre disponível 💾";
    })();

    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[75%] flex flex-col gap-1">
          <button
            onClick={() => !locked && onPhotoClick?.(msg)}
            disabled={locked}
            className={`px-5 py-5 rounded-2xl flex flex-col items-center gap-2 transition ${
              locked
                ? "bg-surface-high/40 opacity-60 cursor-not-allowed"
                : isMine
                ? `bg-gradient-to-br from-[color:var(--wine)]/50 to-[color:var(--neon-pink)]/30 border ${isOneView ? "border-[color:var(--neon-pink)]/40" : "border-cream/20"} rounded-br-md active:scale-[0.98]`
                : `bg-surface-high border ${isOneView ? "border-[color:var(--neon-pink)]/50 shadow-[0_0_20px_-5px_rgba(255,59,107,0.3)]" : "border-cream/20"} rounded-bl-md active:scale-[0.98]`
            }`}
          >
            <span className="text-3xl">{locked ? "📷" : (isOneView ? "🔥📷" : "💾📷")}</span>
            <span className="text-xs text-cream text-center leading-tight">{label}</span>
          </button>
          <span className={`text-[10px] text-mist/50 ${isMine ? "text-right" : "text-left"}`}>{time}</span>
        </div>
      </div>
    );
  }

  const isProv = msg.type === "quick_provocation";
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[75%] flex flex-col gap-1">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isMine
              ? "bg-gradient-to-br from-[color:var(--wine)] to-[color:var(--neon-pink)] text-cream rounded-br-md"
              : "bg-surface-high text-cream rounded-bl-md"
          }`}
        >
          {isProv && <span className="mr-1 text-xs opacity-80">🔥</span>}
          {msg.content}
        </div>
        <span className={`text-[10px] text-mist/50 ${isMine ? "text-right" : "text-left"}`}>{time}</span>
      </div>
    </div>
  );
}
