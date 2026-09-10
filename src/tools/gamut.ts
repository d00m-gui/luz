export interface OklchSeed {
  l: number;
  c: number;
  h: number;
}

function srgbToLinear(v: number): number {
  const abs = Math.abs(v);
  return abs <= 0.04045
    ? v / 12.92
    : Math.sign(v) * ((abs + 0.055) / 1.055) ** 2.4;
}

function linearSrgbToXyz(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  return [
    0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
    0.2126729 * r + 0.7151522 * g + 0.072175 * b,
    0.0193339 * r + 0.119192 * g + 0.9503041 * b,
  ];
}

function xyzToOklab(x: number, y: number, z: number): [number, number, number] {
  const l = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s = 0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToXyz(l: number, a: number, b: number): [number, number, number] {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;
  return [
    1.2270138511 * l3 - 0.5577999807 * m3 + 0.281256149 * s3,
    -0.0405801784 * l3 + 1.1122568696 * m3 - 0.0716766787 * s3,
    -0.0763812845 * l3 - 0.4214819784 * m3 + 1.5861632204 * s3,
  ];
}

function xyzToLinearSrgb(
  x: number,
  y: number,
  z: number,
): [number, number, number] {
  return [
    3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.969266 * x + 1.8760108 * y + 0.041556 * z,
    0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
  ];
}

function inSrgbRange(rgb: [number, number, number]): boolean {
  return rgb.every((v) => v >= -0.0001 && v <= 1.0001);
}

function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  const hr = (h * Math.PI) / 180;
  const xyz = oklabToXyz(l, c * Math.cos(hr), c * Math.sin(hr));
  return xyzToLinearSrgb(...xyz);
}

/** Whether an OKLCH color falls inside the sRGB gamut. */
export function isInSrgbGamut(l: number, c: number, h: number): boolean {
  return inSrgbRange(oklchToRgb(l, c, h));
}

/** Largest chroma at the given `l`/`h` that still fits sRGB, via binary search. */
export function maxSrgbChroma(l: number, h: number, ceiling = 0.4): number {
  if (l <= 0 || l >= 1) return 0;
  if (isInSrgbGamut(l, ceiling, h)) return ceiling;
  let lo = 0;
  let hi = ceiling;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (isInSrgbGamut(l, mid, h)) lo = mid;
    else hi = mid;
  }
  return lo;
}

/** Clamps a seed's chroma to the largest value that still fits sRGB at its own `l`/`h`. */
export function clampToSrgb(seed: OklchSeed): OklchSeed {
  return { ...seed, c: Math.min(seed.c, maxSrgbChroma(seed.l, seed.h)) };
}

export function formatOklch(l: number, c: number, h: number): string {
  const hue = ((h % 360) + 360) % 360;
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${hue.toFixed(2)})`;
}

const HEX_RE = /^#([0-9a-f]{3,8})$/i;
const RGB_RE = /^rgba?\(\s*([^)]+)\)$/i;
const HSL_RE = /^hsla?\(\s*([^)]+)\)$/i;
const OKLCH_RE = /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)/i;
const OKLAB_RE = /^oklab\(\s*([\d.]+%?)\s+(-?[\d.]+%?)\s+(-?[\d.]+%?)/i;

function pct(value: string, max: number): number {
  return value.endsWith("%")
    ? (Number.parseFloat(value) / 100) * max
    : Number.parseFloat(value);
}

function hslToRgbByte(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function rgbToOklch(r: number, g: number, b: number): OklchSeed {
  const lin = [r / 255, g / 255, b / 255].map(srgbToLinear) as [
    number,
    number,
    number,
  ];
  const xyz = linearSrgbToXyz(...lin);
  const [l, a, ob] = xyzToOklab(...xyz);
  return { l, c: Math.hypot(a, ob), h: (Math.atan2(ob, a) * 180) / Math.PI };
}

/** Parses a literal CSS color (hex, `rgb()`, `hsl()`, `oklch()`, `oklab()`) into OKLCH. Returns `null` for anything else (named colors, `var()`, `color-mix()`, …) — callers fall back to the live `calc()` pipeline. */
export function parseColorToOklch(value: string): OklchSeed | null {
  const input = value.trim();

  const hex = HEX_RE.exec(input);
  if (hex) {
    let h = hex[1]!;
    if (h.length === 3 || h.length === 4) h = h.replace(/./g, (ch) => ch + ch);
    if (h.length !== 6 && h.length !== 8) return null;
    const r = Number.parseInt(h.slice(0, 2), 16);
    const g = Number.parseInt(h.slice(2, 4), 16);
    const b = Number.parseInt(h.slice(4, 6), 16);
    return rgbToOklch(r, g, b);
  }

  const rgb = RGB_RE.exec(input);
  if (rgb) {
    const parts = rgb[1]!.split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const r = pct(parts[0]!, 255);
    const g = pct(parts[1]!, 255);
    const b = pct(parts[2]!, 255);
    if ([r, g, b].some(Number.isNaN)) return null;
    return rgbToOklch(r, g, b);
  }

  const hsl = HSL_RE.exec(input);
  if (hsl) {
    const parts = hsl[1]!.split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const h = Number.parseFloat(parts[0]!);
    const s = pct(parts[1]!, 1);
    const l = pct(parts[2]!, 1);
    if ([h, s, l].some(Number.isNaN)) return null;
    return rgbToOklch(...hslToRgbByte(h, s, l));
  }

  const oklch = OKLCH_RE.exec(input);
  if (oklch) {
    const l = pct(oklch[1]!, 1);
    const c = pct(oklch[2]!, 0.4);
    const h = Number.parseFloat(oklch[3]!);
    if ([l, c, h].some(Number.isNaN)) return null;
    return { l: Math.min(1, Math.max(0, l)), c: Math.max(0, c), h };
  }

  const oklab = OKLAB_RE.exec(input);
  if (oklab) {
    const l = pct(oklab[1]!, 1);
    const a = pct(oklab[2]!, 0.4);
    const b = pct(oklab[3]!, 0.4);
    if ([l, a, b].some(Number.isNaN)) return null;
    return {
      l: Math.min(1, Math.max(0, l)),
      c: Math.hypot(a, b),
      h: (Math.atan2(b, a) * 180) / Math.PI,
    };
  }

  return null;
}
