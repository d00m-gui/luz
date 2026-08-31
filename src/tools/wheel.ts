import { luzOnColor, luzShadesByHue } from "./hue";

const WHEEL_STEP = 30;
const WHEEL_OFFSET = 25;
const WHEEL_CHROMA = 0.2;

const WHEEL_NAMES = [
  "red",
  "copper",
  "orange",
  "yellow",
  "green",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "sky",
  "violet",
  "pink",
] as const;

export type WheelHueName = (typeof WHEEL_NAMES)[number];

export const WHEEL_HUE_NAMES: WheelHueName[] = [...WHEEL_NAMES];

export function luzWheel(
  reverse: boolean,
  primaryCSSVar: string,
  prefix?: string,
  steps?: number,
  overrides?: Partial<Record<WheelHueName, string>>,
): Record<string, string> {
  let wheel: Record<string, string> = {};
  for (let i = 0; i < WHEEL_NAMES.length; i++) {
    const name = WHEEL_NAMES[i]!;
    const hue = i * WHEEL_STEP + WHEEL_OFFSET;
    const key = `${prefix ?? ""}${name}`;
    const seedKey = `${key}-seed`;
    const seed =
      overrides?.[name] ?? `oklch(from ${primaryCSSVar} l ${WHEEL_CHROMA} ${hue})`;
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
      [`on-${key}`]: luzOnColor(`var(--${seedKey})`),
    };
  }
  return wheel;
}
