import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  loading?: boolean;
};

export function Button({ variant = "primary", loading, children, className = "", disabled, ...props }: Props) {
  const base = "w-full h-14 flex items-center justify-center rounded-full font-medium text-base active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed";
  const style = variant === "primary"
    ? "bg-gradient-to-r from-[color:var(--wine)] to-[color:var(--neon-pink)] text-cream shadow-[0_8px_32px_-8px_rgba(255,59,107,0.5)]"
    : "border border-cream/20 text-cream/80";
  return (
    <button {...props} disabled={disabled || loading} className={`${base} ${style} ${className}`}>
      {loading ? (
        <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
