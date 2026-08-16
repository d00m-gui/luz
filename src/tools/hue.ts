import { SHADES, SHADES_REVERSE, WEIGHTS } from "./constants";

/** Linearly interpolates `curve` (fixed control points) to `steps` samples. */
function resampleCurve(curve: number[], steps: number): number[] {
  const lastIndex = curve.length - 1;
  const result: number[] = [];
  for (let i = 0; i < steps; i++) {
    const pos = steps === 1 ? lastIndex / 2 : (i / (steps - 1)) * lastIndex;
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    const t = pos - lower;
    result.push((curve[lower] as number) + ((curve[upper] as number) - (curve[lower] as number)) * t);
  }
  return result;
}

/** Evenly spaced weight labels 50→950, rounded to the nearest 10. */
function generateWeights(steps: number): number[] {
  if (steps === 1) return [500];
  const result: number[] = [];
  for (let i = 0; i < steps; i++) {
    const raw = 50 + ((950 - 50) * i) / (steps - 1);
    result.push(Math.round(raw / 10) * 10);
  }
  return result;
}

/**
 * Generate a palette of oklch shades from a base hue.
 *
 * When `reverse` is true the shade order (50 → 950) is flipped so that
 * dark-mode palettes map light steps to high values and vice-versa.
 *
 * `steps` defaults to the tuned 11-point curve (`WEIGHTS`/`SHADES`); any
 * other count resamples that curve via linear interpolation instead of
 * using a new formula, so the palette's shape stays consistent at any size.
 */
export function luzShadesByHue({
  color,
  name,
  base = 0.05,
  reverse = false,
  steps = WEIGHTS.length,
}: {
  color: string;
  name: string;
  base?: number;
  reverse?: boolean;
  steps?: number;
}): Record<string, string> {
  const isDefaultSteps = steps === WEIGHTS.length;
  const weights = isDefaultSteps ? WEIGHTS : generateWeights(steps);
  const curve = reverse ? SHADES_REVERSE : SHADES;
  const percents = isDefaultSteps ? curve : resampleCurve(curve, steps);

  let shades = {};
  for (let step = 0; step < weights.length; step++) {
    // 0 at the first weight, 1 at the last — symmetric, so both palette
    // extremes land at sin(0)=0 (minimal chroma) and the true midpoint
    // weight hits sin(π/2)=1 (peak chroma). `(step + 1) / steps` (the old
    // formula) was shifted by one step: it skipped perIndex=0 entirely and
    // ran past 1 at the last step, giving a *negative* chroma multiplier
    // there while the lightest shade got nonzero tint instead of none.
    const perIndex = weights.length === 1 ? 0.5 : step / (weights.length - 1);
    const sin = `clamp(0, calc(${base} + (sin(${perIndex} * pi) * c)), 0.4)`;
    const percent = percents[step];
    const key = `${name}-${weights[step]}`;
    const value = `oklch(from ${color} ${percent}% ${sin} h)`;
    const pair = { [key]: value };
    shades = { ...pair, ...shades };
  }

  return shades;
}
