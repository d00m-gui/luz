export const config = {
  primary: "#007DEA",
  mode: "dark",
  // Real fonts loaded via Astro's Fonts API (see astro.config.mjs's `fonts`
  // array + Layout.astro's <Font cssVariable> tags) — these just point luz's
  // own typography tokens at the CSS variables Astro generates for them.
  font: "var(--dm-sans)",
  "font-headings": "var(--dm-sans)",
  "font-monospace": "var(--dm-mono)",
  power: 1.1,
  sizeFluidRange: "tight",
  sound: {
    enabled: true,
    volume: 0.3
  },
};
