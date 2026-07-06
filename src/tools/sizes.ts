interface SizesMap {
  [key: string]: string;
}

function generateFluidTagSizes(baseFontSize = 16, power = 1.31): string {
  let minimum = Math.ceil(baseFontSize / 10);
  let preferred = minimum * power;
  let maximum = preferred ** minimum;
  // console.log("preferred", baseFontSize);
  // if (baseFontSize >= 17) {
  //   // maximum = minimum *= minimum;
  //   return `clamp(${minimum}rem, ${preferred.toFixed(2)}cqi, ${maximum.toFixed(1)}rem)`;
  // }
  return `clamp(${minimum}rem, ${preferred.toFixed(2)}cqi, ${maximum.toFixed(1)}rem)`;
}

export function luzSizes(base: number, power: number = 1.31): SizesMap {
  const computedSizes: SizesMap = {};
  // for (let i = 1; i <= 12; i++) {
  //   computedSizes[`size-${i}`] = `${i / 10}rem`;
  // }
  // for (let i = 13; i <= 22; i++) {
  //   computedSizes[`size-${i}`] = generateFluidTagSizes(i, power);
  // }

  for (let i = 1; i <= 22; i++) {
    computedSizes[`size-${i}`] = `${i / 10}rem`;
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
