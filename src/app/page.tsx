import Link from "next/link";

export default function Home() {
  return (
    <main className="relative z-10 flex flex-col min-h-dvh items-center justify-between px-6 py-12 overflow-hidden">
      <div className="w-full flex justify-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-mist/60 border border-mist/20 rounded-full px-3 py-1">
          +18 · Conteúdo adulto
        </span>
      </div>

      <div className="flex flex-col items-center gap-8 text-center">
        <div className="relative">
          <h1 className="font-display italic text-7xl sm:text-8xl font-black leading-none tracking-tight">
            <span className="text-cream">Ero</span>
            <span className="text-[color:var(--neon-pink)] drop-shadow-[0_0_20px_rgba(255,59,107,0.6)]">xx</span>
            <span className="text-cream">y</span>
          </h1>
          <div className="absolute -inset-x-8 -bottom-2 h-px bg-gradient-to-r from-transparent via-[color:var(--neon-pink)] to-transparent opacity-60" />
        </div>

        <p className="font-display italic text-xl sm:text-2xl text-mist max-w-xs leading-tight">
          O canal secreto<br/>
          <span className="text-cream">do casal</span>
        </p>

        <p className="text-sm text-mist/70 max-w-xs leading-relaxed">
          Provoque, seduza e apimente seu relacionamento com a versão mais safada de vocês dois.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <Link
          href="/entrar"
          className="w-full h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[color:var(--wine)] to-[color:var(--neon-pink)] text-cream font-medium text-base shadow-[0_8px_32px_-8px_rgba(255,59,107,0.5)] active:scale-[0.98] transition-transform"
        >
          Começar
        </Link>
        <Link
          href="/login"
          className="w-full h-14 flex items-center justify-center rounded-full border border-cream/20 text-cream/80 font-medium text-base active:scale-[0.98] transition-transform"
        >
          Já tenho conta
        </Link>
        <p className="text-center text-[11px] text-mist/50 mt-3 leading-relaxed">
          Ao continuar, você confirma ter mais de 18 anos e aceita nossos<br/>
          <Link href="/termos" className="underline">termos</Link> e <Link href="/privacidade" className="underline">privacidade</Link>.
        </p>
      </div>
    </main>
  );
}
