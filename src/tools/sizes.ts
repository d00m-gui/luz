interface SizesMap {
  [key: string]: string;
}

// Fluid sizes interpolate linearly between these two container inline-sizes.
const MIN_CONTAINER_REM = 20; // 320px
const MAX_CONTAINER_REM = 77.5; // 1240px

function generateFluidTagSize(step: number, power: number): string {
  const minSize = step / 10;
  const maxSize = minSize * power;

  const slope = (maxSize - minSize) / (MAX_CONTAINER_REM - MIN_CONTAINER_REM);
  const yIntercept = minSize - slope * MIN_CONTAINER_REM;

  return `clamp(${minSize.toFixed(2)}rem, ${yIntercept.toFixed(2)}rem + ${(slope * 100).toFixed(2)}cqi, ${maxSize.toFixed(2)}rem)`;
}

export function luzSizes(base: number, power: number = 1.31): SizesMap {
  const computedSizes: SizesMap = {};
  for (let i = 1; i <= 12; i++) {
    computedSizes[`size-${i}`] = `${i / 10}rem`;
  }
  for (let i = 13; i <= 22; i++) {
    computedSizes[`size-${i}`] = generateFluidTagSize(i, power);
  }

  return {
    ...computedSizes,
    "border-radius": `${(base / 32).toFixed(1)}rem`,
    "border-width": `${(base / 128).toFixed(1)}rem`,
    spacing: `${((base / 10) * 3).toFixed(0)}rem`,
    "element-vertical": `${(base / 20).toFixed(1)}rem`,
    "element-horizontal": `${(base / 10).toFixed(1)}rem`,
  };
}
