import { WEIGHTS } from "./constants";

const CENTER_WEIGHT = 500;
const MAX_DISTANCE = CENTER_WEIGHT - 50;

function easeIn(t: number): number {
  return t * t;
}

/** Evenly spaced weight labels 50→950, rounded to the nearest 10. */
function generateWeights(steps: number): number[] {
  if (steps === 1) return [CENTER_WEIGHT];
  const result: number[] = [];
  for (let i = 0; i < steps; i++) {
    const raw = 50 + ((950 - 50) * i) / (steps - 1);
    result.push(Math.round(raw / 10) * 10);
  }
  return result;
}

function shadeEntry(
  color: string,
  name: string,
  weight: number,
  reverse: boolean,
  maxMix: number,
): [key: string, value: string] {
  if (weight === CENTER_WEIGHT) return [`${name}-${weight}`, `oklch(from ${color} l c h)`];
  const t = Math.min(Math.abs(weight - CENTER_WEIGHT) / MAX_DISTANCE, 1);
  const mix = (maxMix * easeIn(t)).toFixed(1);
  const isLowWeight = weight < CENTER_WEIGHT;
  const toward = isLowWeight === !reverse ? "black" : "white";
  return [`${name}-${weight}`, `color-mix(in oklch, ${toward} ${mix}%, ${color})`];
}

/** Auto-contrast text color for a background: white-ish or black-ish depending on `seed`'s own lightness, with a slight tint of its hue. */
export function luzOnColor(seed: string): string {
  return `oklch(from ${seed} clamp(0, calc((l - 0.6) * -1000), 1) calc(c * 0.08) h)`;
}

export function luzShadesByHue({
  color,
  name,
  reverse = false,
  steps = WEIGHTS.length,
  maxMix = 94,
}: {
  color: string;
  name: string;
  reverse?: boolean;
  steps?: number;
  maxMix?: number;
}): Record<string, string> {
  const weights = steps === WEIGHTS.length ? WEIGHTS : generateWeights(steps);
  const shades: Record<string, string> = {};
  for (const weight of weights) {
    const [key, value] = shadeEntry(color, name, weight, reverse, maxMix);
    shades[key] = value;
  }
  return shades;
}
