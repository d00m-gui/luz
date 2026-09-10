import type { LuzConfig } from "@d00m-gui/luz";

export const config: LuzConfig = {
  primary: "oklch(82% 0.09 320)",
  harmony: "triad",
  mode: "dark",
  neutralTint: 0.3,
  depthSign: -1,
  depthMax: 0.07,
  depthDecay: 0.5,
  schemeChroma: 0.75,
  contrastThreshold: 0.62,
  power: "major-third",
  font: '"DM Sans", system-ui, sans-serif',
  "font-headings": '"DM Sans", system-ui, sans-serif',
  "font-monospace": '"DM Mono", ui-monospace, monospace',
  "font-bold-weight": 600,
  density: 0.9,
  vars: {
    "border-width": "0.0625rem",
    "border-radius": "0.375rem",
  },
};
