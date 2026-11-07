import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "gold" | "danger";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md", loading, children, className = "", disabled, ...props }: Props) {
  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "h-14 px-6 text-base",
    lg: "h-16 px-8 text-lg",
  };
  const base = `w-full flex items-center justify-center rounded-full font-semibold tracking-wide active:scale-[0.97] transition disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]}`;
  const styles = {
    primary: "bg-gradient-to-r from-[color:var(--wine)] via-[color:var(--neon-pink)] to-[color:var(--purple)] text-cream shadow-[0_10px_40px_-10px_rgba(255,45,111,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]",
    ghost: "bg-cream/5 border border-cream/15 text-cream backdrop-blur",
    gold: "bg-gradient-to-r from-[color:var(--gold)] to-[color:var(--gold-deep)] text-[color:var(--night)] shadow-[0_8px_32px_-8px_rgba(245,201,76,0.5)]",
    danger: "bg-[color:var(--wine)] text-cream",
  };
  return (
    <button {...props} disabled={disabled || loading} className={`${base} ${styles[variant]} ${className}`}>
      {loading ? (
        <span className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
