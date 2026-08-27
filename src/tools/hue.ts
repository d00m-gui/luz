import { SHADES, SHADES_REVERSE, WEIGHTS } from "./constants";

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

function shadeEntry(
  color: string,
  name: string,
  weight: number,
  percent: number,
  perIndex: number,
  base: number,
  amplitude: number | undefined,
): [key: string, value: string] {
  const chromaTerm = amplitude === undefined ? "c" : amplitude;
  const chroma = `clamp(0, calc(${base} + (sin(${perIndex} * pi) * ${chromaTerm})), 0.4)`;
  return [`${name}-${weight}`, `oklch(from ${color} ${percent}% ${chroma} h)`];
}

export function luzShadesByHue({
  color,
  name,
  base = 0.05,
  reverse = false,
  steps = WEIGHTS.length,
  amplitude,
}: {
  color: string;
  name: string;
  base?: number;
  reverse?: boolean;
  steps?: number;
  amplitude?: number;
}): Record<string, string> {
  const curve = reverse ? SHADES_REVERSE : SHADES;
  const shades: Record<string, string> = {};

  if (steps !== WEIGHTS.length) {
    const weights = generateWeights(steps);
    const percents = resampleCurve(curve, steps);
    for (let i = weights.length - 1; i >= 0; i--) {
      const perIndex = weights.length === 1 ? 0.5 : i / (weights.length - 1);
      const [key, value] = shadeEntry(
        color,
        name,
        weights[i]!,
        percents[i]!,
        perIndex,
        base,
        amplitude,
      );
      shades[key] = value;
    }
  }

  for (let i = WEIGHTS.length - 1; i >= 0; i--) {
    const perIndex = i / (WEIGHTS.length - 1);
    const [key, value] = shadeEntry(
      color,
      name,
      WEIGHTS[i]!,
      curve[i]!,
      perIndex,
      base,
      amplitude,
    );
    shades[key] = value;
  }

  return shades;
}
