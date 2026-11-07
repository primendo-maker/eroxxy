import type { HeatMessage } from "@/core/types";

export function MessageBubble({ msg, isMine, onPhotoClick }: {
  msg: HeatMessage;
  isMine: boolean;
  onPhotoClick?: (msg: HeatMessage) => void;
}) {
  const time = new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (msg.type === "photo") {
    const viewed = Boolean(msg.viewed_at);
    const disabled = isMine && viewed;
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[75%] flex flex-col gap-1">
          <button
            onClick={() => !disabled && onPhotoClick?.(msg)}
            disabled={disabled || (!isMine && viewed)}
            className={`px-5 py-5 rounded-2xl flex flex-col items-center gap-2 transition ${
              viewed
                ? "bg-surface-high/40 opacity-60"
                : isMine
                ? "bg-gradient-to-br from-[color:var(--wine)]/50 to-[color:var(--neon-pink)]/30 border border-[color:var(--neon-pink)]/30 rounded-br-md"
                : "bg-surface-high border border-[color:var(--neon-pink)]/50 shadow-[0_0_20px_-5px_rgba(255,59,107,0.3)] rounded-bl-md active:scale-[0.98]"
            }`}
          >
            <span className="text-3xl">{viewed ? "📷" : "🔥📷"}</span>
            <span className="text-xs text-cream text-center leading-tight">
              {viewed
                ? (isMine ? "Foto visualizada" : "Já visualizada")
                : (isMine ? "Enviada · vida única" : "Toque pra ver · vida única")}
            </span>
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
