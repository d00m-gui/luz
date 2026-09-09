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
  depth: 0,
  depthMax: 0.175,
  depthDecay: 0.8,
  depthSign: -0.3,
  density: 1,
  contrastThreshold: 0.6,
  schemeChroma: 0.7,
};

// ,
// contrastThreshold: 0.67,
// schemeChroma: 0.9,
// density: 0.95
