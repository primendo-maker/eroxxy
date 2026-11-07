"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { getProfile, signOut } from "@/data/auth";
import { getCoupleMembers } from "@/data/couples";
import type { Profile } from "@/core/types";

export default function HomePage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partner, setPartner] = useState<any>(null);

  useEffect(() => {
    if (!loading && !session) router.push("/login");
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const p = await getProfile();
      if (!p?.couple_id) { router.push("/match"); return; }
      setProfile(p as Profile);
      const members = await getCoupleMembers(p.couple_id);
      const other = members?.find(m => m.id !== session.user.id);
      setPartner(other);
    })();
  }, [session, router]);

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  if (loading || !profile) return <main className="min-h-dvh flex items-center justify-center text-mist">...</main>;

  return (
    <main className="relative z-10 flex flex-col min-h-dvh px-6 py-10">
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto gap-6 text-center">
        <div>
          <p className="text-sm text-mist/60 uppercase tracking-wider mb-2">Olá, {profile.nickname}</p>
          <h1 className="font-display italic text-4xl text-cream">
            {partner ? (
              <>Conectado com <span className="text-[color:var(--neon-pink)]">{partner.nickname || "seu par"}</span></>
            ) : (
              "Aguardando seu par..."
            )}
          </h1>
        </div>
        <p className="text-sm text-mist/70">Em breve: chat sensual, provocações rápidas e desafios.</p>
        <button onClick={handleLogout} className="text-xs text-mist/50 underline mt-8">Sair</button>
      </div>
    </main>
  );
}
