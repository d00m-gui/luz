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

function generateFluidTagSize(minSize: number, maxSize: number): string {
  const slope = (maxSize - minSize) / (MAX_CONTAINER_REM - MIN_CONTAINER_REM);
  const yIntercept = minSize - slope * MIN_CONTAINER_REM;

  return `clamp(${minSize.toFixed(3)}rem, ${yIntercept.toFixed(3)}rem + ${(slope * 100).toFixed(3)}cqi, ${maxSize.toFixed(3)}rem)`;
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

/**
 * Returns `font-size-small`..`font-size-h1` (static rem, no `clamp()`) plus
 * `font-size-{name}-fluid` (the `clamp()`/`cqi` variant, consumed by `.fluid`).
 * Its own rungs, independent of `luzTextScale`.
 */
export function luzTypeLandmarks(
  base: number,
  scale: TypeScaleName | number = "perfect-fourth",
  relativeToBase: boolean = false,
  fluidRange: FluidRangeName | number = "balanced",
): Record<string, string> {
  const ratio = resolveScale(scale);
  const range = resolveFluidRange(fluidRange);
  const unit = relativeToBase ? base / 16 : 1;
  const anchorRem = 0.75 * unit;

  const landmarks: Record<string, string> = {};
  for (const [name, n] of TYPE_LANDMARK_RUNGS) {
    const minSize = anchorRem * ratio ** n;
    const maxSize = anchorRem * ratio ** (n + range);
    landmarks[`font-size-${name}`] = `${minSize.toFixed(3)}rem`;
    landmarks[`font-size-${name}-fluid`] = generateFluidTagSize(minSize, maxSize);
  }
  return landmarks;
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

/**
 * Named type scale backing the `text-xs`..`text-3xl` utility classes —
 * static rem by default, plus `font-size-{name}-fluid` for `.fluid`.
 */
export function luzTextScale(
  base: number,
  scale: TypeScaleName | number = "perfect-fourth",
  relativeToBase: boolean = false,
  fluidRange: FluidRangeName | number = "balanced",
): Record<string, string> {
  const ratio = resolveScale(scale);
  const range = resolveFluidRange(fluidRange);
  const unit = relativeToBase ? base / 16 : 1;
  const anchorRem = 1 * unit;

  const textSizes: Record<string, string> = {};
  for (const [name, n] of TEXT_SCALE_RUNGS) {
    const minSize = anchorRem * ratio ** n;
    const maxSize = anchorRem * ratio ** (n + range);
    textSizes[`font-size-${name}`] = `${minSize.toFixed(3)}rem`;
    textSizes[`font-size-${name}-fluid`] = generateFluidTagSize(minSize, maxSize);
  }
  return textSizes;
}

export function luzSizes(
  base: number,
  relativeToBase: boolean = false,
): Record<string, string> {
  const unit = relativeToBase ? base / 16 : 1;

  return {
    "size-unit": relativeToBase
      ? `${parseFloat((0.1 * unit).toFixed(3))}rem`
      : "0.1rem",
    "border-radius": `${(base / 78).toFixed(1)}rem`,
    "border-width": `${(base / 128).toFixed(1)}rem`,
    spacing: `${((base / 10) * 3).toFixed(0)}vw`,
    "element-vertical": `${(base / 16).toFixed(1)}ch`,
    "element-horizontal": `${(base / 12).toFixed(1)}ch`
  };
}

export function luzSpace(base: number, steps: number = 24): Record<string, string> {
  const unit = base / 64;
  const spaceTokens: Record<string, string> = {};
  for (let i = 1; i <= steps; i++) {
    spaceTokens[`space-${i}`] = `${parseFloat((i * unit).toFixed(3))}rem`;
  }
  return spaceTokens;
}
