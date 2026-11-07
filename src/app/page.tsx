import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/Badge";
import { FlameIcon } from "@/components/FlameIcon";

export default function Home() {
  return (
    <main className="relative z-10 flex flex-col min-h-dvh overflow-hidden">
      {/* Floating decorative flames */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[18%] left-[8%] opacity-20 flicker"><FlameIcon size={60} /></div>
        <div className="absolute top-[65%] right-[5%] opacity-15 flicker" style={{animationDelay: "0.5s"}}><FlameIcon size={80} /></div>
        <div className="absolute top-[40%] right-[15%] opacity-10 flicker" style={{animationDelay: "1s"}}><FlameIcon size={40} /></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 py-10">
        {/* Top */}
        <div className="flex justify-between items-center mb-8">
          <Badge variant="neon">+18 Adulto</Badge>
          <Badge variant="gold">Beta privado</Badge>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center py-8">
          <Logo size="xl" />

          <div className="max-w-xs space-y-3">
            <h2 className="font-display italic text-2xl sm:text-3xl text-cream leading-tight">
              O canal secreto<br/>
              <span className="text-[color:var(--neon-pink)] text-glow">do casal</span>
            </h2>
            <p className="text-sm text-mist/80 leading-relaxed">
              Provoque, seduza e apimente seu relacionamento com a versão mais safada de vocês dois.
            </p>
          </div>

          {/* Mini stats row */}
          <div className="flex gap-3 w-full max-w-xs">
            <div className="flex-1 glass rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-[color:var(--gold)]">🔥</p>
              <p className="text-[10px] text-mist/60 uppercase tracking-wider mt-1">Chat íntimo</p>
            </div>
            <div className="flex-1 glass rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-[color:var(--neon-pink)]">📷</p>
              <p className="text-[10px] text-mist/60 uppercase tracking-wider mt-1">Foto vida única</p>
            </div>
            <div className="flex-1 glass rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold text-[color:var(--purple-glow)]">🎭</p>
              <p className="text-[10px] text-mist/60 uppercase tracking-wider mt-1">Modo persona</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
          <Link
            href="/entrar"
            className="w-full h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[color:var(--wine)] via-[color:var(--neon-pink)] to-[color:var(--purple)] text-cream font-semibold text-base shadow-[0_15px_50px_-10px_rgba(255,45,111,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.97] transition-transform"
          >
            🔥 Começar agora
          </Link>
          <Link
            href="/login"
            className="w-full h-14 flex items-center justify-center rounded-full bg-cream/5 border border-cream/15 text-cream/90 font-medium text-sm backdrop-blur active:scale-[0.97] transition-transform"
          >
            Já tenho conta
          </Link>
          <p className="text-center text-[11px] text-mist/50 mt-3 leading-relaxed">
            Ao continuar, você confirma ter mais de 18 anos e aceita nossos<br/>
            <Link href="/termos" className="underline">termos</Link> e <Link href="/privacidade" className="underline">privacidade</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
