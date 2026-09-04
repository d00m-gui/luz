import type { LuzAstroConfig } from "../src/astro";

export const config: LuzAstroConfig = {
  primary: "oklch(0.6691 0.1828 40.61)",
  mode: "dark",
  preset: "app",
  font: "var(--dm-sans)",
  "font-headings": "var(--dm-sans)",
  "font-monospace": "var(--dm-mono)",
  "font-emphasis": "var(--eb-serif)",
  properties: true,
  neutralTint: 0,
  contrastThreshold: 0.67,
  schemeChroma: 0.9,
};
