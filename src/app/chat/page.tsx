"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { usePartnerProfile } from "@/hooks/usePartnerProfile";
import { sendText, sendProvocation } from "@/data/messages";
import { setPersonaMode } from "@/data/profile";
import { notifyPartner } from "@/data/push";
import { MessageBubble } from "@/components/MessageBubble";
import { ProvocationsSheet } from "@/components/ProvocationsSheet";

export default function ChatPage() {
  const router = useRouter();
  const { session, loading: sLoading } = useSession();
  const { profile, loading: pLoading } = useProfile();
  const { messages, loading: mLoading } = useMessages(profile?.couple_id ?? null);
  const partner = usePartnerProfile(profile?.couple_id ?? null, session?.user.id ?? null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [myPersona, setMyPersona] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sLoading && !session) router.push("/login");
  }, [session, sLoading, router]);

  useEffect(() => {
    if (profile?.in_persona_mode !== undefined) setMyPersona(profile.in_persona_mode as boolean);
  }, [profile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function togglePersona() {
    const next = !myPersona;
    setMyPersona(next);
    try { await setPersonaMode(next); } catch { setMyPersona(!next); }
  }

  async function handleSend() {
    if (!input.trim() || !profile?.couple_id || !session) return;
    setSending(true);
    try {
      const content = input.trim();
      await sendText(profile.couple_id, session.user.id, content);
      if (partner?.id) notifyPartner(partner.id, "🔥 Nova provocação", "Toque pra ver").catch(() => {});
      setInput("");
    } catch (e: any) {
      alert("Erro: " + (e.message || ""));
    } finally { setSending(false); }
  }

  async function handleProvocation(text: string) {
    if (!profile?.couple_id || !session) return;
    try {
      await sendProvocation(profile.couple_id, session.user.id, text);
      if (partner?.id) notifyPartner(partner.id, "🔥 Nova provocação", "Toque pra ver").catch(() => {});
    } catch (e: any) { alert("Erro: " + (e.message || "")); }
  }

  if (sLoading || pLoading || !profile) return <main className="min-h-dvh flex items-center justify-center text-mist">...</main>;

  const partnerInPersona = Boolean(partner?.in_persona_mode);
  const partnerDisplayName = partnerInPersona && partner?.persona_name ? partner.persona_name : (partner?.nickname || "Seu par");
  const partnerFirst = (partnerDisplayName || "?")[0].toUpperCase();

  return (
    <main className="relative z-10 flex flex-col h-dvh">
      {/* Header */}
      <header className={`px-4 py-3 border-b border-cream/5 flex items-center gap-3 bg-[color:var(--background)]/80 backdrop-blur transition ${partnerInPersona ? "shadow-[0_0_30px_-5px_rgba(255,59,107,0.4)]" : ""}`}>
        <Link href="/home" className="text-cream/70 text-xl px-1">‹</Link>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-cream transition ${
          partnerInPersona
            ? "bg-gradient-to-br from-[color:var(--neon-pink)] via-[color:var(--wine)] to-[color:var(--neon-pink)] animate-pulse"
            : "bg-gradient-to-br from-[color:var(--wine)] to-[color:var(--neon-pink)]"
        }`}>
          {partnerInPersona ? "🔥" : partnerFirst}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm truncate ${partnerInPersona ? "text-[color:var(--neon-pink)] font-display italic" : "text-cream"}`}>
            {partnerDisplayName}
          </p>
          <p className="text-mist/60 text-[10px] uppercase tracking-wider">
            {partnerInPersona ? "🔥 em personagem" : "online"}
          </p>
        </div>
        <button
          onClick={togglePersona}
          className={`shrink-0 h-9 px-3 rounded-full text-xs font-medium transition ${
            myPersona
              ? "bg-[color:var(--neon-pink)] text-cream shadow-[0_0_14px_-2px_rgba(255,59,107,0.7)]"
              : "bg-surface-high text-mist border border-cream/10"
          }`}
        >
          {myPersona ? "🔥 ON" : "🔥 OFF"}
        </button>
      </header>

      {/* Banner "em personagem" */}
      {myPersona && (
        <div className="px-4 py-2 bg-[color:var(--wine)]/30 border-b border-[color:var(--neon-pink)]/30 text-center">
          <p className="text-xs text-cream font-display italic">Você está em personagem 🔥</p>
        </div>
      )}

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {mLoading && <p className="text-center text-mist/50 text-sm">...</p>}
        {!mLoading && messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-mist/60 py-16 gap-2">
            <p className="font-display italic text-2xl text-cream">Sem mensagens ainda</p>
            <p className="text-sm">Comece com uma provocação rápida 🔥</p>
          </div>
        )}
        {messages.map(m => (
          <MessageBubble key={m.id} msg={m} isMine={m.sender_id === session?.user.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`px-3 py-3 border-t border-cream/5 bg-[color:var(--background)]/90 backdrop-blur flex items-center gap-2 transition ${myPersona ? "shadow-[0_-10px_30px_-10px_rgba(255,59,107,0.5)]" : ""}`}>
        <button
          onClick={() => setSheetOpen(true)}
          className="w-11 h-11 rounded-full bg-surface-high flex items-center justify-center text-lg active:scale-95 transition"
          aria-label="Provocações rápidas"
        >🔥</button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
          placeholder={myPersona ? "Em personagem... 🔥" : "Escreva algo picante..."}
          className="flex-1 h-11 px-4 rounded-full bg-surface border border-cream/10 text-cream text-sm placeholder-mist/40 focus:outline-none focus:border-[color:var(--neon-pink)]/60"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-[color:var(--wine)] to-[color:var(--neon-pink)] text-cream flex items-center justify-center disabled:opacity-40 active:scale-95 transition"
          aria-label="Enviar"
        >↑</button>
      </div>

      <ProvocationsSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onPick={handleProvocation} />
    </main>
  );
}
