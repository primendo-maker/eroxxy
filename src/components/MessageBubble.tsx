import type { HeatMessage } from "@/core/types";

export function MessageBubble({ msg, isMine }: { msg: HeatMessage; isMine: boolean }) {
  const isProv = msg.type === "quick_provocation";
  const time = new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
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
