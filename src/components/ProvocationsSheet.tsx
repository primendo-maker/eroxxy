"use client";
import { useEffect, useState } from "react";
import { listProvocations } from "@/data/provocations";
import type { Provocation, Intensity } from "@/core/types";

export function ProvocationsSheet({ open, onClose, onPick }: {
  open: boolean;
  onClose: () => void;
  onPick: (text: string) => void;
}) {
  const [filter, setFilter] = useState<Intensity | "all">("all");
  const [items, setItems] = useState<Provocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listProvocations(filter === "all" ? undefined : filter)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [open, filter]);

  if (!open) return null;

  const chips: Array<{ k: Intensity | "all"; label: string }> = [
    { k: "all", label: "Todas" },
    { k: "leve", label: "Leves" },
    { k: "media", label: "Médias" },
    { k: "picante", label: "Picantes" },
  ];

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[75dvh] bg-surface rounded-t-3xl border-t border-cream/10 flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-cream/20" />
        </div>
        <div className="px-5 pb-3">
          <h3 className="font-display italic text-xl text-cream mb-3">🔥 Provocações rápidas</h3>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
            {chips.map(c => (
              <button
                key={c.k}
                onClick={() => setFilter(c.k)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  filter === c.k
                    ? "bg-[color:var(--neon-pink)] text-cream"
                    : "bg-surface-high text-mist border border-cream/10"
                }`}
              >{c.label}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-2">
          {loading && <p className="text-center text-mist/50 text-sm py-6">...</p>}
          {!loading && items.map(p => (
            <button
              key={p.id}
              onClick={() => { onPick(p.text); onClose(); }}
              className="text-left px-4 py-3 rounded-xl bg-surface-high text-cream text-sm leading-relaxed border border-cream/5 hover:border-[color:var(--neon-pink)]/40 active:scale-[0.99] transition"
            >
              <span className="opacity-60 mr-1 text-[10px] uppercase tracking-wider">{p.intensity}</span>
              <br/>{p.text}
            </button>
          ))}
          {!loading && items.length === 0 && <p className="text-center text-mist/50 text-sm py-6">Sem provocações nessa intensidade</p>}
        </div>
      </div>
    </div>
  );
}
