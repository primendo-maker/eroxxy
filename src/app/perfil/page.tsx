"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { getProfile } from "@/data/auth";
import { updateProfile } from "@/data/profile";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import type { Intensity } from "@/core/types";

export default function PerfilPage() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [form, setForm] = useState({ nickname: "", persona_name: "", bio: "", intensity_pref: "media" as Intensity });
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.push("/login");
  }, [session, loading, router]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const p = await getProfile();
      if (p) {
        setForm({
          nickname: p.nickname || "",
          persona_name: p.persona_name || "",
          bio: p.bio || "",
          intensity_pref: (p.intensity_pref as Intensity) || "media",
        });
      }
      setLoadingData(false);
    })();
  }, [session]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      alert(e.message || "Erro");
    } finally { setSaving(false); }
  }

  if (loading || loadingData) return <main className="min-h-dvh flex items-center justify-center text-mist">...</main>;

  const intensities: Array<{ k: Intensity; label: string; desc: string }> = [
    { k: "leve", label: "Leve", desc: "Saudade, encontros, memórias" },
    { k: "media", label: "Média", desc: "Desejo mais explícito" },
    { k: "picante", label: "Picante", desc: "Sem filtro, bem direto" },
  ];

  return (
    <main className="relative z-10 flex flex-col min-h-dvh px-5 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/home" className="text-cream/70 text-xl">‹</Link>
        <h1 className="font-display italic text-2xl text-cream">Seu perfil</h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-sm w-full mx-auto">
        <Input
          label="Nickname"
          value={form.nickname}
          onChange={e => setForm({ ...form, nickname: e.target.value })}
          placeholder="Como você quer ser chamado"
        />

        <div>
          <label className="block text-xs uppercase tracking-wider text-mist/70 mb-2">
            Persona 🔥 <span className="text-mist/40 normal-case">(nome que seu par vê quando você entra em personagem)</span>
          </label>
          <Input
            value={form.persona_name}
            onChange={e => setForm({ ...form, persona_name: e.target.value })}
            placeholder="Ex: Vilena, Lobo, Diaba..."
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-mist/70 mb-2">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Algo sobre você..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-cream/10 text-cream placeholder-mist/40 focus:outline-none focus:border-[color:var(--neon-pink)]/60 resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-mist/70 mb-2">Intensidade padrão</label>
          <div className="flex flex-col gap-2">
            {intensities.map(i => (
              <button
                key={i.k}
                type="button"
                onClick={() => setForm({ ...form, intensity_pref: i.k })}
                className={`text-left px-4 py-3 rounded-xl border transition ${
                  form.intensity_pref === i.k
                    ? "border-[color:var(--neon-pink)] bg-[color:var(--neon-pink)]/10"
                    : "border-cream/10 bg-surface"
                }`}
              >
                <p className="text-cream font-medium text-sm">{i.label}</p>
                <p className="text-xs text-mist/60">{i.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" loading={saving}>{saved ? "Salvo ✓" : "Salvar"}</Button>
      </form>
    </main>
  );
}
