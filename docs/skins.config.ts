import type { LuzConfig } from "../src";

/** Translucent blue/cyan holo, thin lines, cut corners, mono legends. */
export const terminal: LuzConfig = {
  primary: "oklch(0.78 0.13 210)",
  background: "oklch(0.16 0.04 240)",
  foreground: "oklch(0.9 0.06 205)",
  mode: "dark",
  font: "var(--dm-mono), monospace",
  "font-monospace": "var(--dm-mono), monospace",
  vars: {
    "control-face": "oklch(0.42 0.09 225 / 35%)",
    "control-face-pressed": "oklch(0.62 0.12 205 / 45%)",
    "control-well": "oklch(0.1 0.04 235 / 70%)",
    "control-bezel": "oklch(0.24 0.06 230 / 55%)",
    "control-ink": "oklch(0.86 0.1 205)",
    "control-line": "oklch(0.8 0.13 205 / 60%)",
    "control-led-on": "oklch(0.85 0.15 200)",
    "control-led-off": "oklch(0.3 0.05 220 / 60%)",
    "control-readout-ink": "oklch(0.85 0.13 200)",
    "control-glow": "0.6rem",
    "control-relief": 0,
    "control-radius": "0.5rem",
    "control-corner-shape": "bevel",
  },
};

/** Machined dark metal bezel, amber ink, chunky softkeys, stencil legends. */
export const industrial: LuzConfig = {
  primary: "oklch(0.75 0.16 65)",
  background: "oklch(0.2 0.005 260)",
  foreground: "oklch(0.88 0.04 75)",
  mode: "dark",
  "font-monospace": "var(--dm-mono), monospace",
  vars: {
    "control-face": "oklch(0.34 0.006 250)",
    "control-well": "oklch(0.12 0.01 60)",
    "control-bezel": "oklch(0.27 0.005 250)",
    "control-ink": "oklch(0.8 0.15 70)",
    "control-led-on": "oklch(0.75 0.18 55)",
    "control-led-off": "oklch(0.25 0.04 55)",
    "control-readout-ink": "oklch(0.8 0.16 65)",
    "control-glow": "0.3rem",
    "control-relief": 1.3,
    "control-radius": "0.2rem",
    "control-font":
      '"Stardos Stencil", "Black Ops One", Impact, "Arial Narrow", sans-serif',
    "mfd-key-size": "3.6rem",
  },
};
