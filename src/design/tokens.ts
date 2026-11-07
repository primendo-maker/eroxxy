// Eroxxy design tokens — reutilizáveis no Expo
export const colors = {
  // Backgrounds
  night: "#0A0507",        // preto com toque avermelhado
  surface: "#1A0A0E",      // surface elevada
  surfaceHigh: "#2A1218",  // cards/modais
  // Brand
  wine: "#8B0E26",         // vinho sensual
  wineDeep: "#5C0616",     // vinho escuro
  neonPink: "#FF3B6B",     // rosa neon (CTA, highlights)
  neonPinkSoft: "#FF7A99", // rosa suave
  ember: "#FF6B35",        // brasa laranja
  // Texto
  cream: "#F5E6D3",        // texto principal
  mist: "#C9A98E",         // texto secundário
  smoke: "#8A6F60",        // texto desbotado
  // Accent
  gold: "#D4AF37",          // detalhes premium
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
} as const;

export const radius = {
  sm: 6, md: 12, lg: 20, xl: 28, full: 9999,
} as const;

export const typography = {
  display: "var(--font-playfair), serif",
  body: "var(--font-inter), system-ui, sans-serif",
} as const;
