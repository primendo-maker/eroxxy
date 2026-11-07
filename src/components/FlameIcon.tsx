export function FlameIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flame-g" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#F5C94C" />
          <stop offset="40%" stopColor="#FF6B35" />
          <stop offset="80%" stopColor="#FF2D6F" />
          <stop offset="100%" stopColor="#8B0E26" />
        </linearGradient>
        <linearGradient id="flame-g2" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#F5C94C" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF2D6F" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d="M20 2 C20 12, 8 16, 8 30 C8 40, 14 46, 20 46 C26 46, 32 40, 32 30 C32 22, 26 18, 24 10 C22 18, 18 20, 20 2 Z" fill="url(#flame-g)" />
      <path d="M20 14 C20 22, 14 24, 14 32 C14 38, 17 42, 20 42 C23 42, 26 38, 26 32 C26 26, 22 24, 20 14 Z" fill="url(#flame-g2)" opacity="0.85" />
    </svg>
  );
}
