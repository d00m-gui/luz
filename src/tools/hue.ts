import { WEIGHTS } from "./constants";
import { clampToSrgb, formatOklch, type OklchSeed } from "./gamut";

const CENTER_WEIGHT = 500;
const MAX_DISTANCE = CENTER_WEIGHT - 50;
/** Fraction of the remaining headroom to `l=1`/`l=0` covered at 50/950 — never the full headroom, so no shade ever reaches pure white/black. Calibrated so a seed at `l=0.5` reproduces the old fixed `±0.42` curve exactly. */
const LIGHTNESS_FRACTION = 0.84;

function easeIn(t: number): number {
  return t * t;
}

/** Evenly spaced weight labels 50→950, rounded to the nearest 10 (`WEIGHTS` itself for the default 11 steps). */
function generateWeights(steps: number): number[] {
  if (steps === WEIGHTS.length) return WEIGHTS;
  if (steps === 1) return [CENTER_WEIGHT];
  const result: number[] = [];
  for (let i = 0; i < steps; i++) {
    const raw = 50 + ((950 - 50) * i) / (steps - 1);
    result.push(Math.round(raw / 10) * 10);
  }
  return result;
}

/** Direction (`+1` lighten, `-1` darken, `0` unchanged) and eased fraction (0–`LIGHTNESS_FRACTION`) of the headroom to `l=1`/`l=0` a weight reaches, relative to the 500 shade. */
function lightnessFactor(
  weight: number,
  reverse: boolean,
): { sign: 1 | -1 | 0; fraction: number } {
  if (weight === CENTER_WEIGHT) return { sign: 0, fraction: 0 };
  const t = (weight - CENTER_WEIGHT) / MAX_DISTANCE;
  const fraction = easeIn(Math.abs(t)) * LIGHTNESS_FRACTION;
  const sign = (Math.sign(t) * (reverse ? -1 : 1)) as 1 | -1;
  return { sign, fraction };
}

function shadeEntry(
  color: string,
  name: string,
  weight: number,
  reverse: boolean,
): [key: string, value: string] {
  if (weight === CENTER_WEIGHT)
    return [`${name}-${weight}`, `oklch(from ${color} l c h)`];
  const { sign, fraction } = lightnessFactor(weight, reverse);
  const f = fraction.toFixed(3);
  const lExpr =
    sign > 0
      ? `calc(l * ${(1 - fraction).toFixed(3)} + ${f})`
      : `calc(l * ${(1 - fraction).toFixed(3)})`;
  return [
    `${name}-${weight}`,
    `oklch(from var(--${name}-${CENTER_WEIGHT}) ${lExpr} c h)`,
  ];
}

/** Resolves a weight to its exact, gamut-mapped OKLCH: same lightness curve as the live formula, but chroma is clamped to the largest value that still fits sRGB at that `l`/`h` — never exceeding the seed's own chroma. */
export function resolveBakedShade(
  seed: OklchSeed,
  weight: number,
  reverse: boolean,
): OklchSeed {
  const { sign, fraction } = lightnessFactor(weight, reverse);
  const l =
    sign === 0
      ? seed.l
      : sign > 0
        ? seed.l * (1 - fraction) + fraction
        : seed.l * (1 - fraction);
  return clampToSrgb({ l, c: seed.c, h: seed.h });
}

/** Baked OKLCH per weight — the numeric counterpart of `luzShadesByHue`'s baked path (same weights, same gamut mapping). */
export function luzPaletteSeeds(
  seed: OklchSeed,
  reverse: boolean,
  steps: number = WEIGHTS.length,
): Record<number, OklchSeed> {
  const shades: Record<number, OklchSeed> = {};
  for (const weight of generateWeights(steps)) {
    shades[weight] = resolveBakedShade(seed, weight, reverse);
  }
  return shades;
}

function shadeEntryBaked(
  seed: OklchSeed,
  name: string,
  weight: number,
  reverse: boolean,
): [key: string, value: string] {
  const { l, c, h } = resolveBakedShade(seed, weight, reverse);
  return [`${name}-${weight}`, formatOklch(l, c, h)];
}

/** Which generated weight's real lightness lands closest to `target` (0–1) — used to pick a `scheme-*` shade by perceived lightness instead of a fixed nominal weight. */
export function nearestSchemeWeight(
  seed: OklchSeed,
  steps: number,
  reverse: boolean,
  target: number,
): number {
  const weights = steps === WEIGHTS.length ? WEIGHTS : generateWeights(steps);
  let best = CENTER_WEIGHT;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const weight of weights) {
    const { l } = resolveBakedShade(seed, weight, reverse);
    const diff = Math.abs(l - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = weight;
    }
  }
  return best;
}

/** Auto-contrast text color for a background: near-black or near-white (not pure `0`/`1` — softer against saturated backgrounds) depending on `seed`'s own lightness vs. `--contrast-threshold`, with a slight tint of its hue. Fallback for `contrast-color()` behind `@supports`. */
export function luzOnColor(seed: string): string {
  return `oklch(from ${seed} clamp(0.12, calc(0.5 - (l - var(--contrast-threshold, 0.6)) * 1000), 0.92) calc(c * 0.08) h)`;
}

export type ColorHarmony =
  | "complementary"
  | "analogous"
  | "triad"
  | "monochrome";

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

/** Derives the harmony's extra seed colors from `primary`, in slot order (secondary, tertiary, quaternary) — a slot missing from the result means this harmony doesn't define one, and the caller falls back to its own default for that slot. */
export function luzHarmonyColors(
  primaryCSSVar: string,
  harmony: ColorHarmony,
): string[] {
  if (harmony === "monochrome") {
    return MONOCHROME_CHROMA_SCALES.map((factor) =>
      chromaScale(primaryCSSVar, factor),
    );
  }
  return HARMONY_HUE_OFFSETS[harmony].map((degrees) =>
    hueShift(primaryCSSVar, degrees),
  );
}

/** Numeric equivalent of `luzHarmonyColors`, for when `primary`'s exact OKLCH is known at build time (baked shade generation). */
export function luzHarmonyColorSeeds(
  primary: OklchSeed,
  harmony: ColorHarmony,
): OklchSeed[] {
  if (harmony === "monochrome") {
    return MONOCHROME_CHROMA_SCALES.map((factor) => ({
      ...primary,
      c: primary.c * factor,
    }));
  }
  return HARMONY_HUE_OFFSETS[harmony].map((degrees) => ({
    ...primary,
    h: primary.h + degrees,
  }));
}

/** `seed` is the color's exact OKLCH, known at build time — when given, shades are baked with real per-shade gamut mapping instead of the live `oklch(from var(...))` formula. */
export function luzShadesByHue({
  color,
  name,
  reverse = false,
  steps = WEIGHTS.length,
  seed,
}: {
  color: string;
  name: string;
  reverse?: boolean;
  steps?: number;
  seed?: OklchSeed | null;
}): Record<string, string> {
  const weights = generateWeights(steps);
  const shades: Record<string, string> = {};
  for (const weight of weights) {
    const [key, value] = seed
      ? shadeEntryBaked(seed, name, weight, reverse)
      : shadeEntry(color, name, weight, reverse);
    shades[key] = value;
  }
  return shades;
}
