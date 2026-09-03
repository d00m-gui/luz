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

/** Auto-contrast text color for a background: near-black or near-white (not pure `0`/`1` — softer against saturated backgrounds) depending on `seed`'s own lightness vs. `--contrast-threshold`, with a slight tint of its hue. Fallback for `contrast-color()` behind `@supports`. */
export function luzOnColor(seed: string): string {
  return `oklch(from ${seed} clamp(0.12, calc(0.5 - (l - var(--contrast-threshold, 0.6)) * 1000), 0.92) calc(c * 0.08) h)`;
}


export type ColorHarmony = "complementary" | "analogous" | "triad" | "monochrome";

function hueShift(color: string, degrees: number): string {
  return `oklch(from ${color} l c calc(h + ${degrees}))`;
}

function chromaScale(color: string, factor: number): string {
  return `oklch(from ${color} l calc(c * ${factor}) h)`;
}

/** Hue offsets from `primary` for each extra harmony color, in slot order (secondary, tertiary, quaternary). */
const HARMONY_HUE_OFFSETS: Record<ColorHarmony, number[]> = {
  complementary: [180],
  analogous: [30, 60, 90],
  triad: [120, 240],
  monochrome: [],
};

/** Chroma multipliers from `primary` for `monochrome`'s extra colors, in slot order (secondary, tertiary). */
const MONOCHROME_CHROMA_SCALES = [0.45, 0.2];

/** Derives the harmony's extra seed colors from `primary`, in slot order (secondary, tertiary, quaternary) — used for a slot when it isn't set explicitly in config. */
export function luzHarmonyColors(primaryCSSVar: string, harmony: ColorHarmony): string[] {
  if (harmony === "monochrome") {
    return MONOCHROME_CHROMA_SCALES.map((factor) => chromaScale(primaryCSSVar, factor));
  }
  return HARMONY_HUE_OFFSETS[harmony].map((degrees) => hueShift(primaryCSSVar, degrees));
}

const HARMONY_SLOT_NAMES = ["secondary", "tertiary", "quaternary"] as const;

/** Palette names (besides `primary`) a harmony actually generates, e.g. `["secondary"]` for `complementary`, `["secondary", "tertiary", "quaternary"]` for `analogous`. */
export function luzHarmonyColorNames(harmony: ColorHarmony): string[] {
  const count = harmony === "monochrome" ? MONOCHROME_CHROMA_SCALES.length : HARMONY_HUE_OFFSETS[harmony].length;
  return HARMONY_SLOT_NAMES.slice(0, count);
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
