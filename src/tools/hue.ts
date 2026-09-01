import { WEIGHTS } from "./constants";

const CENTER_WEIGHT = 500;
const MAX_DISTANCE = CENTER_WEIGHT - 50;
/** Max signed `l` delta (0–1) from the 500 shade, reached at 50/950. */
const MAX_OFFSET = 0.42;

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

/** Signed `l` delta from the 500 shade for a weight, eased toward the extremes. */
function lightnessOffset(weight: number, reverse: boolean): number {
  if (weight === CENTER_WEIGHT) return 0;
  const t = (weight - CENTER_WEIGHT) / MAX_DISTANCE;
  const magnitude = easeIn(Math.abs(t)) * MAX_OFFSET;
  const sign = Math.sign(t) * (reverse ? -1 : 1);
  return sign * magnitude;
}

function shadeEntry(
  color: string,
  name: string,
  weight: number,
  reverse: boolean,
): [key: string, value: string] {
  if (weight === CENTER_WEIGHT) return [`${name}-${weight}`, `oklch(from ${color} l c h)`];
  const offset = lightnessOffset(weight, reverse).toFixed(3);
  return [
    `${name}-${weight}`,
    `oklch(from var(--${name}-${CENTER_WEIGHT}) clamp(0, calc(l + (${offset})), 1) c h)`,
  ];
}

/** Auto-contrast text color for a background: white-ish or black-ish depending on `seed`'s own lightness, with a slight tint of its hue. */
export function luzOnColor(seed: string): string {
  return `oklch(from ${seed} clamp(0, calc((l - 0.6) * -1000), 1) calc(c * 0.08) h)`;
}

export type ColorHarmony = "complementary" | "analogous" | "triad" | "monochrome";

const HARMONY_HUE_OFFSET: Record<ColorHarmony, number> = {
  complementary: 180,
  analogous: 30,
  triad: 120,
  monochrome: 0,
};

/** Derives a `secondary` seed from `primary` per color harmony, used when no explicit `secondary` is set. */
export function luzHarmonySecondary(primaryCSSVar: string, harmony: ColorHarmony): string {
  if (harmony === "monochrome") {
    return `oklch(from ${primaryCSSVar} l calc(c * 0.45) h)`;
  }
  return `oklch(from ${primaryCSSVar} l c calc(h + ${HARMONY_HUE_OFFSET[harmony]}))`;
}

export function luzShadesByHue({
  color,
  name,
  reverse = false,
  steps = WEIGHTS.length,
}: {
  color: string;
  name: string;
  reverse?: boolean;
  steps?: number;
}): Record<string, string> {
  const weights = steps === WEIGHTS.length ? WEIGHTS : generateWeights(steps);
  const shades: Record<string, string> = {};
  for (const weight of weights) {
    const [key, value] = shadeEntry(color, name, weight, reverse);
    shades[key] = value;
  }
  return shades;
}
