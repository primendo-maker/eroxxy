type Variant = "neon" | "gold" | "purple" | "ghost";

export function Badge({ children, variant = "neon", className = "" }: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const styles: Record<Variant, string> = {
    neon: "bg-[color:var(--neon-pink)]/15 text-[color:var(--neon-pink)] border border-[color:var(--neon-pink)]/40",
    gold: "bg-[color:var(--gold)]/15 text-[color:var(--gold)] border border-[color:var(--gold)]/40",
    purple: "bg-[color:var(--purple)]/20 text-[color:var(--purple-glow)] border border-[color:var(--purple-glow)]/40",
    ghost: "bg-cream/5 text-mist border border-cream/15",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
