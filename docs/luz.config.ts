import type { LuzAstroConfig } from "../src/astro";

export const config: LuzAstroConfig = {
  primary: "#d97b45",
  mode: "dark",
  preset: "app",
  font: "var(--dm-sans)",
  "font-headings": "var(--dm-sans)",
  "font-monospace": "var(--dm-mono)",
  "font-emphasis": "var(--eb-serif)",
  properties: true,
  neutralTint: 0,
  contrastThreshold: 0.7
};
