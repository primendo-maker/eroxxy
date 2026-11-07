"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { getProfile } from "@/data/auth";
import { createCouple, joinCouple } from "@/data/couples";
import { joinCoupleSchema } from "@/core/schemas";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function MatchPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const [step, setStep] = useState<"choose" | "created" | "join">("choose");
  const [pairCode, setPairCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!sessionLoading && !session) router.push("/entrar");
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!session) return;
    // Se já tem couple, pula pro home
    getProfile().then(p => {
      if (p?.couple_id) router.push("/home");
    });
  }, [session, router]);

  async function handleCreate() {
    if (!session) return;
    setError(""); setBusy(true);
    try {
      const c = await createCouple(session.user.id);
      setPairCode(c.pair_code);
      setStep("created");
    } catch (e: any) {
      setError(e.message || "Erro");
    } finally { setBusy(false); }
  }

  async function handleJoin() {
    if (!session) return;
    setError("");
    const parsed = joinCoupleSchema.safeParse({ pair_code: inputCode });
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      await joinCouple(session.user.id, parsed.data.pair_code);
      router.push("/home");
    } catch (e: any) {
      setError(e.message || "Erro");
    } finally { setBusy(false); }
  }

  if (sessionLoading) return <main className="min-h-dvh flex items-center justify-center text-mist">...</main>;

  return (
    <main className="relative z-10 flex flex-col min-h-dvh px-6 py-10">
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto gap-6">
        {step === "choose" && (
          <>
            <div className="text-center mb-4">
              <h1 className="font-display italic text-4xl text-cream mb-2">Conectar</h1>
              <p className="text-sm text-mist/70">Como vocês vão se encontrar aqui?</p>
            </div>
            <Button onClick={handleCreate} loading={busy}>Gerar código pra meu par</Button>
            <Button variant="ghost" onClick={() => setStep("join")}>Já tenho um código</Button>
            {error && <p className="text-sm text-[color:var(--neon-pink)] text-center">{error}</p>}
          </>
        )}

        {step === "created" && (
          <>
            <div className="text-center mb-4">
              <h1 className="font-display italic text-3xl text-cream mb-2">Seu código secreto</h1>
              <p className="text-sm text-mist/70">Mande pra seu par entrar com esse código</p>
            </div>
            <div className="bg-surface rounded-2xl p-8 text-center">
              <div className="font-mono text-5xl tracking-[0.3em] text-[color:var(--neon-pink)] font-bold">{pairCode}</div>
            </div>
            <Button onClick={() => { navigator.clipboard.writeText(pairCode); }}>Copiar código</Button>
            <Button variant="ghost" onClick={() => router.push("/home")}>Continuar</Button>
          </>
        )}

        {step === "join" && (
          <>
            <div className="text-center mb-4">
              <h1 className="font-display italic text-3xl text-cream mb-2">Insira o código</h1>
              <p className="text-sm text-mist/70">6 dígitos que seu par te mandou</p>
            </div>
            <Input
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="text-center text-3xl tracking-[0.3em] font-mono h-16"
              value={inputCode}
              onChange={e => setInputCode(e.target.value.replace(/\D/g, ""))}
              error={error}
            />
            <Button onClick={handleJoin} loading={busy}>Conectar</Button>
            <Button variant="ghost" onClick={() => setStep("choose")}>Voltar</Button>
          </>
        )}
      </div>
    </main>
  );
}
