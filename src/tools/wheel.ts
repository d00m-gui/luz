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

/** Numeric seed for one wheel hue: an `override` that parses as a literal color wins; otherwise `primary`'s own `l` with the hue's fixed chroma/angle; `null` when neither is known. */
export function luzWheelHueSeed(
  name: WheelHueName,
  primarySeed: OklchSeed | null,
  override?: string,
): OklchSeed | null {
  if (override) return parseColorToOklch(override);
  if (!primarySeed) return null;
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
  overrides?: Partial<Record<WheelHueName, string>>,
  primarySeed?: OklchSeed | null,
): Record<string, string> {
  const wheel: Record<string, string> = {};
  for (let i = 0; i < WHEEL_NAMES.length; i++) {
    const name = WHEEL_NAMES[i]!;
    const hue = i * WHEEL_STEP + WHEEL_OFFSET;
    const seedKey = `${name}-seed`;
    const override = overrides?.[name];
    wheel[seedKey] =
      override ?? `oklch(from ${primaryCSSVar} l ${WHEEL_CHROMA} ${hue})`;
    Object.assign(
      wheel,
      luzShadesByHue({
        color: `var(--${seedKey})`,
        name,
        reverse,
        seed: luzWheelHueSeed(name, primarySeed ?? null, override),
      }),
    );
    wheel[name] = `var(--${name}-500)`;
    wheel[`on-${name}`] = luzOnColor(`var(--${seedKey})`);
  }
  return wheel;
}
