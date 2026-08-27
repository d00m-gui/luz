import { luzShadesByHue } from "./hue";

const WHEEL_HUES = {
  sky: { hue: 270, l: 68, c: 0.11 },
  blue: { hue: 240, l: 58, c: 0.19 },
  cyan: { hue: 210, l: 70, c: 0.1 },
  teal: { hue: 180, l: 65, c: 0.1 },
  emerald: { hue: 150, l: 60, c: 0.15 },
  green: { hue: 120, l: 58, c: 0.18 },
  yellow: { hue: 90, l: 83, c: 0.16 },
  orange: { hue: 60, l: 62, c: 0.19 },
  copper: { hue: 30, l: 58, c: 0.14 },
  red: { hue: 0, l: 55, c: 0.21 },
} as const;

export type WheelHueName = keyof typeof WHEEL_HUES;

export const WHEEL_HUE_NAMES = Object.keys(WHEEL_HUES) as WheelHueName[];

export function luzWheel(
  reverse: boolean,
  prefix?: string,
  steps?: number,
  overrides?: Partial<Record<WheelHueName, string>>,
): Record<string, string> {
  let wheel: Record<string, string> = {};
  for (const name of WHEEL_HUE_NAMES) {
    const { hue, l, c } = WHEEL_HUES[name];
    const key = `${prefix ?? ""}${name}`;
    const seedKey = `${key}-seed`;
    const seed = overrides?.[name] ?? `oklch(${l}% ${c} ${hue})`;
    const shades = luzShadesByHue({
      color: `var(--${seedKey})`,
      name: key,
      reverse,
      steps,
    });
    wheel = {
      ...wheel,
      [seedKey]: seed,
      ...shades,
      [key]: `var(--${key}-500)`,
    };
  }
  return wheel;
}
