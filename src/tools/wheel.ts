import { luzShadesByHue } from "./hue";

const WHEEL_HUES = {
  sky: { hue: 270, c: 0.11 },
  blue: { hue: 240, c: 0.19 },
  cyan: { hue: 210, c: 0.1 },
  teal: { hue: 180, c: 0.1 },
  emerald: { hue: 150, c: 0.15 },
  green: { hue: 120, c: 0.18 },
  yellow: { hue: 90, c: 0.16 },
  orange: { hue: 60, c: 0.19 },
  copper: { hue: 30, c: 0.14 },
  red: { hue: 0, c: 0.21 },
} as const;

export type WheelHueName = keyof typeof WHEEL_HUES;

export const WHEEL_HUE_NAMES = Object.keys(WHEEL_HUES) as WheelHueName[];

export function luzWheel(
  reverse: boolean,
  primaryCSSVar: string,
  prefix?: string,
  steps?: number,
  overrides?: Partial<Record<WheelHueName, string>>,
): Record<string, string> {
  let wheel: Record<string, string> = {};
  for (const name of WHEEL_HUE_NAMES) {
    const { hue, c } = WHEEL_HUES[name];
    const key = `${prefix ?? ""}${name}`;
    const seedKey = `${key}-seed`;
    const seed = overrides?.[name] ?? `oklch(from ${primaryCSSVar} l ${c} ${hue})`;
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
      [`on-${key}`]: `oklch(from var(--${seedKey}) 88% 0 h)`,
      [`on-${key}-inverse`]: `oklch(from var(--${seedKey}) 20% 0 h)`,
    };
  }
  return wheel;
}
