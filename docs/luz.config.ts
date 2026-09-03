import type { LuzAstroConfig } from "../src/astro";

export const config: LuzAstroConfig = {
  primary: "#e9560c",
  mode: "light",
  preset: "app",
  font: "var(--dm-sans)",
  "font-headings": "var(--dm-sans)",
  "font-monospace": "var(--dm-mono)",
  "font-emphasis": "var(--eb-serif)",
  properties: true,
  neutralTint: 0,
  contrastThreshold: 0.71,
};
