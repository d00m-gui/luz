import type { LuzAstroConfig } from "../../src/astro";

export const config: LuzAstroConfig = {
  font: `var(--mona)`,
  "font-headings": `var(--mona)`,
  "font-monospace": `var(--mona)`,
  primary: "#C45AFF",
  secondary: "#A684E8",
  mode: "dark",
  background: "#0F0F1F",
  sizeFluidRange: "fixed",
  path: "./src/styles/luz.css",
  minify: true,
};
