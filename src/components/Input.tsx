import { forwardRef, InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = "", ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-xs uppercase tracking-wider text-mist/70 mb-2">{label}</label>
    )}
    <input
      ref={ref}
      {...props}
      className={`w-full h-12 px-4 rounded-xl bg-surface border border-cream/10 text-cream placeholder-mist/40 focus:outline-none focus:border-[color:var(--neon-pink)]/60 focus:ring-2 focus:ring-[color:var(--neon-pink)]/20 transition ${className}`}
    />
    {error && <p className="mt-1 text-xs text-[color:var(--neon-pink)]">{error}</p>}
  </div>
));
Input.displayName = "Input";
