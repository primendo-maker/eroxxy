"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { getProfile, signOut } from "@/data/auth";
import { getCoupleMembers, getCouple } from "@/data/couples";
import { listMessages } from "@/data/messages";
import { PushActivator } from "@/components/PushActivator";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/Badge";
import { FlameIcon } from "@/components/FlameIcon";
import type { Profile, HeatMessage, Couple } from "@/core/types";

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
  const xp = couple?.couple_xp ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = (xp % 100);
  const streak = couple?.streak_days ?? 0;

  return (
    <main className="relative z-10 min-h-dvh pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <Badge variant="purple">Nível {level}</Badge>
        <button onClick={handleLogout} className="text-xs text-mist/50 underline">Sair</button>
      </div>

      {/* Hero — avatars + greeting */}
      <section className="px-5 pt-4 pb-6 text-center">
        <div className="flex items-center justify-center mb-5 relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[color:var(--wine)] to-[color:var(--neon-pink)] flex items-center justify-center text-cream text-2xl font-bold ring-4 ring-[color:var(--neon-pink)]/20 relative">
            {myFirst}
          </div>
          <div className="w-10 h-10 -mx-3 rounded-full bg-[color:var(--night)] flex items-center justify-center text-[color:var(--gold)] text-xl z-10 border-4 border-[color:var(--night)] shadow-[0_0_20px_rgba(245,201,76,0.4)]">
            <FlameIcon size={22} />
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[color:var(--purple)] to-[color:var(--neon-pink)] flex items-center justify-center text-cream text-2xl font-bold ring-4 ring-[color:var(--purple-glow)]/20">
            {partnerFirst}
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-mist/60 mb-1">Olá, {profile.nickname}</p>
        <h1 className="font-display italic text-3xl text-cream leading-tight">
          Você e <span className="text-[color:var(--neon-pink)] text-glow">{partner?.nickname || "seu par"}</span>
        </h1>
      </section>

      {/* Stats row */}
      <section className="px-5 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-2xl p-4 overflow-hidden glass border-neon">
            <div className="absolute -right-2 -top-2 opacity-20"><FlameIcon size={60} /></div>
            <p className="text-[10px] uppercase tracking-wider text-mist/60 mb-1">Streak</p>
            <p className="text-3xl font-display italic font-black text-cream">{streak}</p>
            <p className="text-xs text-mist/70 mt-0.5">dias em chamas 🔥</p>
          </div>
          <div className="relative rounded-2xl p-4 overflow-hidden glass">
            <p className="text-[10px] uppercase tracking-wider text-mist/60 mb-1">Nível {level}</p>
            <p className="text-3xl font-display italic font-black text-[color:var(--gold)] text-glow-gold">{xp}</p>
            <p className="text-xs text-mist/70 mt-0.5 mb-2">couple XP</p>
            <div className="h-1.5 rounded-full bg-cream/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[color:var(--gold)] to-[color:var(--neon-pink)] transition-all" style={{width: `${levelProgress}%`}} />
            </div>
          </div>
        </div>
      </section>

      {/* Push activator */}
      <section className="px-5">
        <PushActivator />
      </section>

      {/* Main CTA: Chat */}
      <section className="px-5 mb-3">
        <Link href="/chat" className="block rounded-2xl p-5 relative overflow-hidden border-neon active:scale-[0.99] transition">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--wine)]/40 via-transparent to-[color:var(--purple)]/30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[color:var(--neon-pink)]/20 flex items-center justify-center text-2xl pulse-neon">💬</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-cream font-semibold">Canal íntimo</p>
                  <Badge variant="neon">Ao vivo</Badge>
                </div>
                <p className="text-xs text-mist/60">Chat + provocações + foto vida única</p>
              </div>
              <span className="text-cream/60 text-2xl">›</span>
            </div>
            {lastMsg && (
              <div className="pl-15 border-t border-cream/5 pt-3">
                <p className="text-xs text-mist/50 uppercase tracking-wider mb-1">Última mensagem</p>
                <p className="text-sm text-cream line-clamp-1">
                  <span className="text-mist/60">{lastMsg.sender_id === session?.user.id ? "você: " : (partner?.nickname || "par") + ": "}</span>
                  {lastMsg.type === "photo" ? "📷 foto" : lastMsg.content}
                </p>
              </div>
            )}
          </div>
        </Link>
      </section>

      {/* Desafios locked (coming soon) */}
      <section className="px-5">
        <div className="block rounded-2xl p-5 glass opacity-70 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><FlameIcon size={100} /></div>
          <div className="flex items-center gap-3 relative">
            <div className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center text-2xl">🎯</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-cream font-semibold">Desafios semanais</p>
                <Badge variant="gold">Em breve</Badge>
              </div>
              <p className="text-xs text-mist/60">3 opções · 3 dias · ganhe XP</p>
            </div>
            <span className="text-cream/30 text-xl">🔒</span>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
