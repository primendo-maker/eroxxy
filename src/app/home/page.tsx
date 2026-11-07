"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { getProfile, signOut } from "@/data/auth";
import { getCoupleMembers, getCouple } from "@/data/couples";
import { listMessages } from "@/data/messages";
import type { Profile, HeatMessage, Couple } from "@/core/types";
import { PushActivator } from "@/components/PushActivator";

export default function HomePage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [partner, setPartner] = useState<any>(null);
  const [lastMsg, setLastMsg] = useState<HeatMessage | null>(null);

  useEffect(() => {
    if (!loading && !session) router.push("/login");
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const p = await getProfile();
      if (!p?.couple_id) { router.push("/match"); return; }
      setProfile(p as Profile);

      const [members, c, msgs] = await Promise.all([
        getCoupleMembers(p.couple_id),
        getCouple(p.couple_id),
        listMessages(p.couple_id, 1).catch(() => []),
      ]);
      setPartner(members?.find(m => m.id !== session.user.id));
      setCouple(c);
      setLastMsg(msgs[msgs.length - 1] || null);
    })();
  }, [session, router]);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  if (loading || !profile) return <main className="min-h-dvh flex items-center justify-center text-mist">...</main>;

  const myFirst = (profile.nickname || "?")[0].toUpperCase();
  const partnerFirst = (partner?.nickname || "?")[0].toUpperCase();

  return (
    <main className="relative z-10 flex flex-col min-h-dvh px-5 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[color:var(--wine)] to-[color:var(--neon-pink)] flex items-center justify-center text-cream text-xs font-semibold">{myFirst}</div>
          <span className="text-cream/70 text-sm">+</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[color:var(--neon-pink)] to-[color:var(--wine)] flex items-center justify-center text-cream text-xs font-semibold">{partnerFirst}</div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/perfil" className="text-xs text-mist/70 underline">Perfil</Link>
          <button onClick={handleLogout} className="text-xs text-mist/50 underline">Sair</button>
        </div>
      </div>

      <div className="mb-10">
        <p className="text-sm text-mist/60 uppercase tracking-wider mb-2">Olá, {profile.nickname}</p>
        <h1 className="font-display italic text-3xl text-cream leading-tight">
          Você e <span className="text-[color:var(--neon-pink)]">{partner?.nickname || "seu par"}</span> estão conectados
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface rounded-2xl p-4 border border-cream/5">
          <p className="text-[10px] uppercase tracking-wider text-mist/60 mb-1">🔥 Streak</p>
          <p className="text-2xl font-semibold text-cream">{couple?.streak_days ?? 0} <span className="text-sm text-mist/60 font-normal">dias</span></p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border border-cream/5">
          <p className="text-[10px] uppercase tracking-wider text-mist/60 mb-1">💎 Couple XP</p>
          <p className="text-2xl font-semibold text-cream">{couple?.couple_xp ?? 0}</p>
        </div>
      </div>

      <PushActivator />

      <Link
        href="/chat"
        className="block bg-gradient-to-br from-[color:var(--wine)]/40 to-[color:var(--surface)] rounded-2xl p-5 border border-[color:var(--neon-pink)]/30 mb-4 active:scale-[0.99] transition"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[color:var(--neon-pink)]/20 flex items-center justify-center text-lg">💬</div>
          <div className="flex-1">
            <p className="text-cream font-medium">Canal íntimo</p>
            <p className="text-xs text-mist/60">{lastMsg ? "Clique pra abrir" : "Ainda sem mensagens"}</p>
          </div>
          <span className="text-cream/50 text-xl">›</span>
        </div>
        {lastMsg && (
          <p className="text-sm text-cream/80 line-clamp-2">
            <span className="text-mist/60">{lastMsg.sender_id === session?.user.id ? "você:" : (partner?.nickname || "par") + ":"} </span>
            {lastMsg.content}
          </p>
        )}
      </Link>

      <div className="mt-auto pt-6 text-center">
        <p className="text-xs text-mist/40">Em breve: desafios semanais e foto vida única</p>
      </div>
    </main>
  );
}
