"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "Início", icon: "🏠" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/desafios", label: "Desafios", icon: "🎯", locked: true },
  { href: "/perfil", label: "Perfil", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 pb-safe">
      <div className="mx-3 mb-3">
        <div className="glass rounded-full px-2 py-2 flex items-center justify-around shadow-[0_-10px_40px_-15px_rgba(255,45,111,0.5)]">
          {items.map(it => {
            const active = pathname === it.href || pathname?.startsWith(it.href + "/");
            if (it.locked) {
              return (
                <button
                  key={it.href}
                  disabled
                  className="flex-1 flex flex-col items-center gap-0.5 py-2 opacity-40 cursor-not-allowed"
                >
                  <span className="text-lg relative">
                    {it.icon}
                    <span className="absolute -top-1 -right-2 text-[8px]">🔒</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-mist">{it.label}</span>
                </button>
              );
            }
            return (
              <Link key={it.href} href={it.href} className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition ${active ? "" : "opacity-60 hover:opacity-100"}`}>
                <span className={`text-lg transition ${active ? "scale-110" : ""}`}>{it.icon}</span>
                <span className={`text-[9px] uppercase tracking-wider font-semibold ${active ? "text-[color:var(--neon-pink)]" : "text-mist"}`}>{it.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
