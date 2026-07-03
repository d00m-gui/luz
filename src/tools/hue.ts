import { SHADES, SHADES_REVERSE, WEIGHTS } from "./constants";

export interface LuzHueConfig {
  color: string;
  name: string;
  base?: number;
  reverse?: boolean;
}

/**
 * Generate a palette of oklch shades from a base hue.
 *
 * When `reverse` is true the shade order (50 → 950) is flipped so that
 * dark-mode palettes map light steps to high values and vice-versa.
 */
export function luzShadesByHue({
  color,
  name,
  base = 0.05,
  reverse = false,
}: LuzHueConfig): Record<string, string> {
  let percents = reverse ? SHADES_REVERSE : SHADES;
  let shades = {};
  for (let step = 0; step < WEIGHTS.length; step++) {
    const perIndex = (step + 1) / 10;
    const sin = `clamp(0, calc(${base} + (sin(${perIndex} * pi) * c)), 0.4)`;
    const percent = percents[step];
    const key = `${name}-${WEIGHTS[step]}`;
    const value = `oklch(from ${color} ${percent}% ${sin} h)`;
    const pair = { [key]: value };
    shades = { ...pair, ...shades };
  }

  return shades;
}
