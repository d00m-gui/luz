import chroma from "chroma-js";

interface ShadesMap {
  [key: string]: string;
}
interface WheelMap {
  [key: string]: string;
}
interface SizesMap {
  [key: string]: string;
}
interface LuzHueOutput {
  blue: string;
  sky: string;
  cyan: string;
  teal: string;
  emerald: string;
  green: string;
  yellow: string;
  orange: string;
  red: string;
  rose: string;
}

function luzShade(
  color: string,
  name: string = "shades",
  reverse: boolean = true,
): ShadesMap {
  const darkest = chroma(color).shade(0.95);
  const lightest = chroma(color).tint(0.6);
  const shades = reverse
    ? chroma.scale([darkest, color, lightest]).colors(11).reverse()
    : chroma.scale([darkest, color, lightest]).colors(11);
  let shadesVars = {};
  for (var shade in shades) {
    const value = shades[shade] ?? "#f6f";
    let max: number;
    if (shade === "0") {
      max = 50;
    } else if (shade === "10") {
      max = 950;
    } else {
      max = parseInt(shade) * 100;
    }
    const key = `${name}-${max}`;
    const newValue = { [key]: chroma(value).css("oklch") };
    shadesVars = { ...newValue, ...shadesVars };
  }
  return shadesVars;
}

function getLightnessFromHex(sh: string): number {
  let hex = chroma(sh).hex();

  if (hex) {
    let { r, g, b }: { r: number; g: number; b: number } = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
    // Formula for luminance perceived brightness
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return +(luminance * 100).toFixed(2);
  } else {
    console.error("[luz] Invalid HEX value");
    return 0;
  }
}

function luzContrast(color: string): string {
  if (getLightnessFromHex(color) > 60) {
    return chroma(color).darken(3).css("oklch");
  } else {
    return chroma(color).brighten(3).css("oklch");
  }
}

function luzHue(color: string, rotation: string): string {
  return chroma(color).set("oklch.h", rotation).css("oklch");
}

function luzWheel(color: string, prefix?: string) {
  let initWheel: LuzHueOutput = {
    blue: luzHue(color, "270"),
    sky: luzHue(color, "240"),
    cyan: luzHue(color, "210"),
    teal: luzHue(color, "180"),
    emerald: luzHue(color, "150"),
    green: luzHue(color, "120"),
    yellow: luzHue(color, "90"),
    orange: luzHue(color, "60"),
    red: luzHue(color, "30"),
    rose: luzHue(color, "0"),
  };
  let luzStep = {};
  Object.entries(initWheel).map(([key, value], index) => {
    let keyp = prefix ? `${prefix}${key}` : key;
    let item = { [keyp]: value };
    luzStep = { ...item, ...luzStep };
  });

  return luzStep;
}

export function generateFluidTagSizes(baseFontSize = 16, scaleFactor = 1.31) {
  let minSize = baseFontSize / 10;
  let maxSize = minSize * scaleFactor;
  let cqw = Math.pow(maxSize, scaleFactor);
  let cqi = minSize * scaleFactor;
  if (baseFontSize >= 17) {
    console.log("BASE", baseFontSize);
    maxSize = Math.pow(minSize, 2.6);
    cqi = Math.pow(minSize, 2.6);
    return `clamp(${minSize.toFixed(1)}rem, ${cqi.toFixed(2)}cqw, ${maxSize.toFixed(1)}rem)`;
  }
  return `clamp(${minSize.toFixed(1)}rem, ${cqi.toFixed(2)}cqw, ${maxSize.toFixed(1)}rem)`;
}

function luzSizes(base: number, power: number = 2): SizesMap {
  const computedSizes: SizesMap = {};
  for (let i = 1; i <= 12; i++) {
    computedSizes[`size-${i}`] = `${i / 10}rem`;
  }
  for (let i = 13; i <= 22; i++) {
    computedSizes[`size-${i}`] = generateFluidTagSizes(i);
  }

  // Maintain utility sizes with consistent rem units
  return {
    ...computedSizes,
    "border-radius": `${(base / 32).toFixed(1)}rem`,
    "border-width": `${(base / 128).toFixed(1)}rem`,
    spacing: `${((base / 10) * 3).toFixed(0)}rem`,
    "element-vertical": `${(base / 20).toFixed(1)}rem`,
    "element-horizontal": `${(base / 10).toFixed(1)}rem`,
  };
}

export { luzSizes, luzShade, luzContrast, luzWheel };
