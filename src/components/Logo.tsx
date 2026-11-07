import { FlameIcon } from "./FlameIcon";

export function Logo({ size = "lg" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: { text: "text-2xl", flame: 16 },
    md: { text: "text-4xl", flame: 22 },
    lg: { text: "text-6xl sm:text-7xl", flame: 36 },
    xl: { text: "text-7xl sm:text-8xl", flame: 48 },
  };
  const s = sizes[size];
  return (
    <div className="relative inline-flex items-center">
      <span className={`absolute -left-4 -top-2 opacity-70 flicker`}>
        <FlameIcon size={s.flame} />
      </span>
      <h1 className={`font-display italic font-black leading-none tracking-tight ${s.text} relative z-10`}>
        <span className="text-cream text-glow-gold">Ero</span>
        <span className="text-[color:var(--neon-pink)] text-glow">xx</span>
        <span className="text-cream text-glow-gold">y</span>
      </h1>
    </div>
  );
}
