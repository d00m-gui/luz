const MIN_CONTAINER_REM = 20; // 320px
const MAX_CONTAINER_REM = 77.5; // 1240px

/** Named ratios for luz's exponential type scales (`text-*`, headings) — common typographic scale steps. */
export const TYPE_SCALES = {
  "minor-second": 1.067,
  "major-second": 1.125,
  "minor-third": 1.2,
  "major-third": 1.25,
  "perfect-fourth": 1.333,
  "augmented-fourth": 1.414,
  "perfect-fifth": 1.5,
  golden: 1.618,
} as const;

/** Preset name for the exponential type scale ratio — see `TYPE_SCALES`. */
export type TypeScaleName = keyof typeof TYPE_SCALES;

/** Resolves a preset name or a raw ratio number to a numeric ratio. */
export function resolveScale(scale: TypeScaleName | number): number {
  return typeof scale === "number" ? scale : TYPE_SCALES[scale];
}

export const FLUID_RANGES = {
  fixed: 0,
  tight: 0.35,
  balanced: 1,
  dramatic: 1.6,
} as const;

/** Preset name for how far a fluid size step's viewport-max reaches past its viewport-min — see `FLUID_RANGES`. */
export type FluidRangeName = keyof typeof FLUID_RANGES;

/** Resolves a preset name or a raw exponent-offset number to a number. */
export function resolveFluidRange(range: FluidRangeName | number): number {
  return typeof range === "number" ? range : FLUID_RANGES[range];
}

/** Ratio for the rung `n` — steps below the anchor use √ratio so `sm`/`xs` stay legible. */
function rungSize(anchorRem: number, ratio: number, n: number): number {
  return anchorRem * (n < 0 ? Math.sqrt(ratio) : ratio) ** n;
}

/** `font-size-{name}` (static rem) plus `font-size-{name}-fluid` (`clamp()`/`cqi`, consumed by `.fluid`) for each named rung, `anchorRem` at rung 0. */
function fluidScale(
  rungs: readonly (readonly [string, number])[],
  anchorRem: number,
  scale: TypeScaleName | number,
  fluidRange: FluidRangeName | number,
): Record<string, string> {
  const ratio = resolveScale(scale);
  const range = resolveFluidRange(fluidRange);
  const sizes: Record<string, string> = {};
  for (const [name, n] of rungs) {
    const minSize = rungSize(anchorRem, ratio, n);
    const maxSize = rungSize(anchorRem, ratio, n + range);
    const slope = (maxSize - minSize) / (MAX_CONTAINER_REM - MIN_CONTAINER_REM);
    const yIntercept = minSize - slope * MIN_CONTAINER_REM;
    sizes[`font-size-${name}`] = `${minSize.toFixed(3)}rem`;
    sizes[`font-size-${name}-fluid`] =
      `clamp(${minSize.toFixed(3)}rem, ${yIntercept.toFixed(3)}rem + ${(slope * 100).toFixed(3)}cqi, ${maxSize.toFixed(3)}rem)`;
  }
  return sizes;
}

/** Consecutive rungs — `small` is the anchor (rung 0), `h1` six steps up. */
const TYPE_LANDMARK_RUNGS = [
  ["small", 0],
  ["h6", 1],
  ["h5", 2],
  ["h4", 3],
  ["h3", 4],
  ["h2", 5],
  ["h1", 6],
] as const;

/** `font-size-small`..`font-size-h1` — its own rungs, independent of `luzTextScale`. */
export function luzTypeLandmarks(
  base: number,
  scale: TypeScaleName | number = "perfect-fourth",
  relativeToBase: boolean = false,
  fluidRange: FluidRangeName | number = "balanced",
): Record<string, string> {
  return fluidScale(
    TYPE_LANDMARK_RUNGS,
    0.75 * (relativeToBase ? base / 16 : 1),
    scale,
    fluidRange,
  );
}

/** Consecutive rungs for the `text-*` utility scale — `base` is the anchor (rung 0). */
const TEXT_SCALE_RUNGS = [
  ["xs", -2],
  ["sm", -1],
  ["base", 0],
  ["lg", 1],
  ["xl", 2],
  ["2xl", 3],
  ["3xl", 4],
] as const;

/** Named type scale backing the `text-xs`..`text-3xl` utility classes. */
export function luzTextScale(
  base: number,
  scale: TypeScaleName | number = "perfect-fourth",
  relativeToBase: boolean = false,
  fluidRange: FluidRangeName | number = "balanced",
): Record<string, string> {
  return fluidScale(
    TEXT_SCALE_RUNGS,
    relativeToBase ? base / 16 : 1,
    scale,
    fluidRange,
  );
}

export function luzSizes(
  base: number,
  relativeToBase: boolean = false,
  radius: number | string = 1,
  radiusSteps: number = 8,
): Record<string, string> {
  const unit = relativeToBase ? base / 16 : 1;

  return {
    "size-unit": relativeToBase
      ? `${parseFloat((0.1 * unit).toFixed(3))}rem`
      : "0.1rem",
    ...luzRadius(base, radius, radiusSteps),
    "border-width": `${(base / 128).toFixed(1)}rem`,
    spacing: `calc(${(base / 4).toFixed(0)}vw * var(--density, 1))`,
    "element-vertical": `calc(${(base / 32).toFixed(3)}rem * var(--density, 1))`,
    "element-horizontal": `calc(${(base / 24).toFixed(3)}rem * var(--density, 1))`,
    "element-width": `min(${(base * 1.78).toFixed(0)}rem, 100%)`,
    "element-width-min": `${base * 2}rem`,
    "element-gap": `calc(${(base / 32).toFixed(3)}rem * var(--density, 1))`,
  };
}

/** A CSS length literal split into its numeric part and unit — `"8px"`, `"0"`, `"1.5rem"`. */
const RADIUS_LITERAL_RE = /^(-?\d*\.?\d+)([a-z]*|%)$/i;

/** `border-radius` (= `border-radius-1`) plus the `border-radius-1..steps` scale. `radius` multiplies the `base / 78` rem unit, or replaces it as a literal CSS value. */
function luzRadius(
  base: number,
  radius: number | string,
  steps: number,
): Record<string, string> {
  const literal = typeof radius === "string" ? radius.trim() : "";
  const scalar = typeof radius === "number" ? radius : 1;
  const parsed = literal === "" ? null : RADIUS_LITERAL_RE.exec(literal);
  const amount = parsed
    ? parseFloat(parsed[1]!)
    : parseFloat((base / 78).toFixed(1)) * scalar;
  const unit = parsed ? parsed[2]! : "rem";

  /** Rung `i` — a non-scalable literal (`calc()`, `var()`) stays symbolic. */
  const rung = (i: number): string => {
    if (literal !== "" && !parsed) {
      return i === 1 ? literal : `calc(${literal} * ${i})`;
    }
    return `${parseFloat((amount * i).toFixed(3))}${unit}`;
  };

  const radiusTokens: Record<string, string> = { "border-radius": rung(1) };
  for (let i = 1; i <= steps; i++) {
    radiusTokens[`border-radius-${i}`] = rung(i);
  }
  return radiusTokens;
}

export function luzSpace(
  base: number,
  steps: number = 24,
): Record<string, string> {
  const unit = base / 64;
  const spaceTokens: Record<string, string> = {};
  for (let i = 1; i <= steps; i++) {
    spaceTokens[`space-${i}`] = `${parseFloat((i * unit).toFixed(3))}rem`;
  }
  return spaceTokens;
}
