import { parseColorToOklch, type OklchSeed } from "./gamut";
import { luzOnColor, luzShadesByHue } from "./hue";

const WHEEL_STEP = 30;
const WHEEL_OFFSET = 25;
export const WHEEL_CHROMA = 0.2;

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

/** Numeric seed for one wheel hue, derived from `primarySeed` the same way `luzWheel`'s default (non-overridden) seeds are: `primary`'s own `l`, the hue's fixed chroma/hue. */
export function luzWheelHueSeed(
  name: WheelHueName,
  primarySeed: OklchSeed,
): OklchSeed {
  const index = WHEEL_NAMES.indexOf(name);
  return {
    l: primarySeed.l,
    c: WHEEL_CHROMA,
    h: index * WHEEL_STEP + WHEEL_OFFSET,
  };
}

/** `primarySeed` is `primary`'s exact OKLCH, known at build time — when given, each wheel hue's shades are baked with real per-shade gamut mapping. An explicit `overrides[name]` that itself parses as a literal color bakes from its own OKLCH instead of `primarySeed`'s. */
export function luzWheel(
  reverse: boolean,
  primaryCSSVar: string,
  prefix?: string,
  steps?: number,
  overrides?: Partial<Record<WheelHueName, string>>,
  primarySeed?: OklchSeed | null,
): Record<string, string> {
  let wheel: Record<string, string> = {};
  for (let i = 0; i < WHEEL_NAMES.length; i++) {
    const name = WHEEL_NAMES[i]!;
    const hue = i * WHEEL_STEP + WHEEL_OFFSET;
    const key = `${prefix ?? ""}${name}`;
    const seedKey = `${key}-seed`;
    const override = overrides?.[name];
    const seed =
      override ?? `oklch(from ${primaryCSSVar} l ${WHEEL_CHROMA} ${hue})`;
    const seedNumeric = override
      ? parseColorToOklch(override)
      : primarySeed
        ? { l: primarySeed.l, c: WHEEL_CHROMA, h: hue }
        : null;
    const shades = luzShadesByHue({
      color: `var(--${seedKey})`,
      name: key,
      reverse,
      steps,
      seed: seedNumeric,
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
