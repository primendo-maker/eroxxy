"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/data/auth";
import { signInSchema } from "@/core/schemas";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError(""); setErrors({});
    const parsed = signInSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(i => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await signIn(parsed.data);
      router.push("/home");
    } catch (e: any) { setGeneralError(e.message || "Email ou senha inválidos"); }
    finally { setLoading(false); }
  }

  return (
    <main className="relative z-10 flex flex-col min-h-dvh px-6 py-8">
      <Link href="/" className="text-cream/70 text-sm mb-6">‹ voltar</Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto gap-8">
        <div className="text-center">
          <div className="inline-block mb-4"><Logo size="md" /></div>
          <h1 className="font-display italic text-3xl text-cream mb-2">Bem-vindo</h1>
          <p className="text-sm text-mist/70">Entre pra continuar seu jogo</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" autoComplete="email" placeholder="voce@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Senha" type="password" autoComplete="current-password" placeholder="Sua senha" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password} />
          {generalError && <p className="text-sm text-[color:var(--neon-pink)] text-center">{generalError}</p>}
          <Button type="submit" loading={loading}>Entrar</Button>
        </form>

        <p className="text-center text-sm text-mist/70">
          Primeira vez aqui? <Link href="/entrar" className="text-cream underline">Criar conta</Link>
        </p>
      </div>
    </main>
  );
}
