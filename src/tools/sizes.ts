// Fluid sizes interpolate linearly between these two container inline-sizes.
const MIN_CONTAINER_REM = 20; // 320px
const MAX_CONTAINER_REM = 77.5; // 1240px

function generateFluidTagSize(minSize: number, power: number): string {
  const maxSize = minSize * power;

  const slope = (maxSize - minSize) / (MAX_CONTAINER_REM - MIN_CONTAINER_REM);
  const yIntercept = minSize - slope * MIN_CONTAINER_REM;

  return `clamp(${minSize.toFixed(2)}rem, ${yIntercept.toFixed(2)}rem + ${(slope * 100).toFixed(2)}cqi, ${maxSize.toFixed(2)}rem)`;
}

export function luzSizes(
  base: number,
  power: number = 1.31,
  steps: number = 22,
  dynamicFrom: number = 13,
  relativeToBase: boolean = false,
): Record<string, string> {
  const scale = relativeToBase ? base / 16 : 1;
  const computedSizes: Record<string, string> = {};
  for (let i = 1; i <= steps; i++) {
    const refRem = (i / 10) * scale;
    computedSizes[`size-${i}`] =
      i < dynamicFrom
        ? relativeToBase
          ? `${parseFloat(refRem.toFixed(3))}rem`
          : `${i / 10}rem`
        : generateFluidTagSize(refRem, power);
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
    "toast-height": `15.5rem`
  };
}
