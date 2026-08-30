import type { LuzAstroConfig } from "../src/astro";

export const config: LuzAstroConfig = {
  primary: "#f28c20",
  mode: "dark",
  preset: "content",
  font: "var(--dm-sans)",
  "font-headings": "var(--dm-sans)",
  "font-monospace": "var(--dm-mono)",
  properties: true,
  background: "#050505",
  "font-bold-weight": 600,
  vars: {
    "neutral-50": "oklch(98% 0 0)",
    "neutral-100": "oklch(99.9% 0 0)",
    "neutral-200": "oklch(92.2% 0 0)",
    "neutral-300": "oklch(88.8% 0 0)",
    "neutral-400": "oklch(88% 0 0)",
    "neutral-500": "oklch(55.6% 0 0)",
    "neutral-600": "oklch(43.9% 0 0)",
    "neutral-700": "oklch(37.1% 0 0)",
    "neutral-800": "oklch(26.9% 0 0)",
    "neutral-900": "oklch(20.5% 0 0)",
    "neutral-950": "oklch(14.5% 0 0)",
  },
};
