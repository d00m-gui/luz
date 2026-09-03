export type GamutCheck = { srgb: boolean; p3: boolean };

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

function inRange(rgb: [number, number, number]): boolean {
  return rgb.every((v) => v >= -0.001 && v <= 1.001);
}

function xyzToLinearSrgb(x: number, y: number, z: number): [number, number, number] {
  return [
    3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.969266 * x + 1.8760108 * y + 0.041556 * z,
    0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
  ];
}

function xyzToLinearP3(x: number, y: number, z: number): [number, number, number] {
  return [
    2.4934969119 * x - 0.9313836179 * y - 0.4027107845 * z,
    -0.8294889696 * x + 1.7626640603 * y + 0.0236246858 * z,
    0.0358458302 * x - 0.0761723893 * y + 0.956884524 * z,
  ];
}

export function oklchGamut(l: number, c: number, h: number): GamutCheck {
  const hr = (h * Math.PI) / 180;
  const xyz = oklabToXyz(l, c * Math.cos(hr), c * Math.sin(hr));
  return {
    srgb: inRange(xyzToLinearSrgb(...xyz)),
    p3: inRange(xyzToLinearP3(...xyz)),
  };
}

const OKLCH_RE = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/;

export function parseOklch(value: string): [l: number, c: number, h: number] | null {
  const match = OKLCH_RE.exec(value);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function supportsP3Display(): boolean {
  return typeof matchMedia === "function" && matchMedia("(color-gamut: p3)").matches;
}
