// Fluid sizes interpolate linearly between these two container inline-sizes.
const MIN_CONTAINER_REM = 20; // 320px
const MAX_CONTAINER_REM = 77.5; // 1240px

/** Named ratios for the exponential `size-N` scale — common typographic scale steps. */
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

export type TypeScaleName = keyof typeof TYPE_SCALES;

/** Resolves a preset name or a raw ratio number to a numeric ratio. */
export function resolveScale(scale: TypeScaleName | number): number {
  return typeof scale === "number" ? scale : TYPE_SCALES[scale];
}

/**
 * How far each fluid step's viewport-max value reaches past its viewport-min
 * value, in scale rungs. `1` = a full rung (marketing-site drama). Dense app
 * UIs usually want less viewport-driven reflow: `"tight"` keeps growth
 * subtle, `"fixed"` locks the size so it doesn't change with viewport width
 * at all (only the step-to-step scale ratio still applies).
 */
export const FLUID_RANGES = {
  fixed: 0,
  tight: 0.35,
  balanced: 1,
  dramatic: 1.6,
} as const;

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

export function luzSizes(
  base: number,
  scale: TypeScaleName | number = "perfect-fourth",
  steps: number = 22,
  dynamicFrom: number = 13,
  relativeToBase: boolean = false,
  fluidRange: FluidRangeName | number = "balanced",
): Record<string, string> {
  const ratio = resolveScale(scale);
  const range = resolveFluidRange(fluidRange);
  const unit = relativeToBase ? base / 16 : 1;
  const anchorRem = (dynamicFrom / 10) * unit;

  const computedSizes: Record<string, string> = {};
  for (let i = 1; i <= steps; i++) {
    if (i < dynamicFrom) {
      const refRem = (i / 10) * unit;
      computedSizes[`size-${i}`] = relativeToBase
        ? `${parseFloat(refRem.toFixed(3))}rem`
        : `${i / 10}rem`;
      continue;
    }
    // The viewport-min value sits at ratio^n; the viewport-max value reaches
    // `fluidRange` rungs further (1 = a full rung, 0 = locked/no fluid
    // growth) — a real compounding exponential scale, not a flat multiplier
    // reapplied at every step.
    const n = i - dynamicFrom;
    const minSize = anchorRem * ratio ** n;
    const maxSize = anchorRem * ratio ** (n + range);
    computedSizes[`size-${i}`] = generateFluidTagSize(minSize, maxSize);
  }

  return {
    ...computedSizes,
    "border-radius": `${(base / 32).toFixed(1)}rem`,
    "border-width": `${(base / 128).toFixed(1)}rem`,
    spacing: `${((base / 10) * 3).toFixed(0)}rem`,
    "element-vertical": `${(base / 20).toFixed(1)}rem`,
    "element-horizontal": `${(base / 10).toFixed(1)}rem`,
    "transform-origin": `50% 50%`,
    "toast-index": `0`,
    "toast-offset-y": `0`,
    "toast-swipe-movement-y": `0`,
    "toast-swipe-movement-x": `0`,
    "toast-height": `15.5rem`,
  };
}
