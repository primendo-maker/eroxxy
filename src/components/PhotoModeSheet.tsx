"use client";

export function PhotoModeSheet({ open, onClose, onPick }: {
  open: boolean;
  onClose: () => void;
  onPick: (isOneView: boolean) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl border-t border-cream/10 p-6 pb-10">
        <div className="pt-1 pb-4 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-cream/20" />
        </div>
        <h3 className="font-display italic text-xl text-cream mb-4 text-center">Como quer enviar?</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { onPick(true); onClose(); }}
            className="w-full bg-gradient-to-br from-[color:var(--wine)]/30 to-[color:var(--neon-pink)]/15 border border-[color:var(--neon-pink)]/40 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition"
          >
            <span className="w-11 h-11 rounded-full bg-[color:var(--neon-pink)]/20 flex items-center justify-center text-xl">🔥</span>
            <div className="flex-1 text-left">
              <p className="text-cream font-medium text-sm">Vida única</p>
              <p className="text-xs text-mist/60">Só pode abrir 1 vez, 10 segundos</p>
            </div>
          </button>
          <button
            onClick={() => { onPick(false); onClose(); }}
            className="w-full bg-surface-high border border-cream/10 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition"
          >
            <span className="w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-xl">💾</span>
            <div className="flex-1 text-left">
              <p className="text-cream font-medium text-sm">Sempre disponível</p>
              <p className="text-xs text-mist/60">Pode abrir quantas vezes quiser</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
