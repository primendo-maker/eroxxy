"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/data/auth";
import { signUpSchema } from "@/core/schemas";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function EntrarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nickname: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError(""); setErrors({});
    const parsed = signUpSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await signUp(parsed.data);
      router.push("/match");
    } catch (e: any) { setGeneralError(e.message || "Erro ao criar conta"); }
    finally { setLoading(false); }
  }

  return (
    <main className="relative z-10 flex flex-col min-h-dvh px-6 py-8">
      <Link href="/" className="text-cream/70 text-sm mb-6">‹ voltar</Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto gap-8">
        <div className="text-center">
          <div className="inline-block mb-4"><Logo size="md" /></div>
          <h1 className="font-display italic text-3xl text-cream mb-2">Entre no jogo</h1>
          <p className="text-sm text-mist/70">Crie sua conta pra conectar com seu parceiro</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input label="Como quer ser chamado(a)" placeholder="Seu apelido" value={form.nickname} onChange={e => setForm({ ...form, nickname: e.target.value })} error={errors.nickname} />
          <Input label="Email" type="email" autoComplete="email" placeholder="voce@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Senha" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password} />
          {generalError && <p className="text-sm text-[color:var(--neon-pink)] text-center">{generalError}</p>}
          <Button type="submit" loading={loading}>🔥 Criar conta</Button>
        </form>

        <p className="text-center text-sm text-mist/70">
          Já tem conta? <Link href="/login" className="text-cream underline">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
