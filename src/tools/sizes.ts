interface SizesMap {
  [key: string]: string;
}

function generateFluidTagSizes(baseFontSize = 16, scaleFactor = 1.31): string {
  let minSize = baseFontSize / 10;
  let maxSize = minSize * scaleFactor;
  // let cqw = Math.pow(maxSize, scaleFactor);
  let cqi = minSize * scaleFactor;
  if (baseFontSize >= 17) {
    maxSize = Math.pow(minSize, 2.6);
    cqi = Math.pow(minSize, 2.6);
    return `clamp(${minSize.toFixed(1)}rem, ${cqi.toFixed(2)}cqw, ${maxSize.toFixed(1)}rem)`;
  }
  return `clamp(${minSize.toFixed(1)}rem, ${cqi.toFixed(2)}cqw, ${maxSize.toFixed(1)}rem)`;
}

export function luzSizes(base: number, power: number = 1.31): SizesMap {
  const computedSizes: SizesMap = {};
  for (let i = 1; i <= 12; i++) {
    computedSizes[`size-${i}`] = `${i / 10}rem`;
  }
  for (let i = 13; i <= 22; i++) {
    computedSizes[`size-${i}`] = generateFluidTagSizes(i, power);
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
