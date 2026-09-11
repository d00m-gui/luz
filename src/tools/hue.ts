import { WEIGHTS } from "./constants";
import { clampToSrgb, formatOklch, type OklchSeed } from "./gamut";

const CENTER_WEIGHT = 500;
const MAX_DISTANCE = CENTER_WEIGHT - 50;
/** Fraction of the remaining headroom to `l=1`/`l=0` covered at 50/950 — never the full headroom, so no shade ever reaches pure white/black. Calibrated so a seed at `l=0.5` reproduces the old fixed `±0.42` curve exactly. */
const LIGHTNESS_FRACTION = 0.84;

/** One named palette: `color` is the live CSS value of its base token, `seed` its exact OKLCH when known at build time (`null` → shades stay live formulas). */
export interface LuzPalette {
  name: string;
  color: string;
  seed: OklchSeed | null;
}

/** Baked OKLCH per weight, one palette in one scheme. */
export type LuzRamp = Record<number, OklchSeed>;

/** Direction (`+1` lighten, `-1` darken, `0` unchanged) and eased fraction (0–`LIGHTNESS_FRACTION`) of the headroom to `l=1`/`l=0` a weight reaches, relative to the 500 shade. */
function lightnessFactor(
  weight: number,
  reverse: boolean,
): { sign: 1 | -1 | 0; fraction: number } {
  if (weight === CENTER_WEIGHT) return { sign: 0, fraction: 0 };
  const t = (weight - CENTER_WEIGHT) / MAX_DISTANCE;
  const fraction = t * t * LIGHTNESS_FRACTION;
  const sign = (Math.sign(t) * (reverse ? -1 : 1)) as 1 | -1;
  return { sign, fraction };
}

function liveShade(
  color: string,
  name: string,
  weight: number,
  reverse: boolean,
): string {
  if (weight === CENTER_WEIGHT) return `oklch(from ${color} l c h)`;
  const { sign, fraction } = lightnessFactor(weight, reverse);
  const f = fraction.toFixed(3);
  const lExpr =
    sign > 0
      ? `calc(l * ${(1 - fraction).toFixed(3)} + ${f})`
      : `calc(l * ${(1 - fraction).toFixed(3)})`;
  return `oklch(from var(--${name}-${CENTER_WEIGHT}) ${lExpr} c h)`;
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

/** Bakes the full `50…950` ramp of a seed for one scheme. */
export function luzPaletteSeeds(seed: OklchSeed, reverse: boolean): LuzRamp {
  const ramp: LuzRamp = {};
  for (const weight of WEIGHTS) {
    ramp[weight] = resolveBakedShade(seed, weight, reverse);
  }
  return ramp;
}

/** `{name}-{weight}` tokens: literal `oklch()` from `ramp` when baked, otherwise the live `oklch(from …)` formula against `color`. */
export function luzShades(
  name: string,
  color: string,
  reverse: boolean,
  ramp: LuzRamp | undefined,
): Record<string, string> {
  const shades: Record<string, string> = {};
  for (const weight of WEIGHTS) {
    const baked = ramp?.[weight];
    shades[`${name}-${weight}`] = baked
      ? formatOklch(baked.l, baked.c, baked.h)
      : liveShade(color, name, weight, reverse);
  }
  return shades;
}

/** Weight of `ramp` whose real lightness lands closest to `target` (0–1). */
export function nearestSchemeWeight(ramp: LuzRamp, target: number): number {
  let best = CENTER_WEIGHT;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (const weight of WEIGHTS) {
    const diff = Math.abs(ramp[weight]!.l - target);
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
