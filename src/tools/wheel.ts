import { parseColorToOklch, type OklchSeed } from "./gamut";
import type { LuzPalette } from "./hue";

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

/** The 12 wheel palettes: `color` is the live seed (`override` verbatim, else `primary`'s lightness at the hue's fixed chroma/angle). */
export function luzWheelPalettes(
  primaryCSSVar: string,
  primarySeed: OklchSeed | null,
  overrides: Partial<Record<WheelHueName, string>>,
): LuzPalette[] {
  return WHEEL_NAMES.map((name, i) => {
    const override = overrides[name];
    return {
      name,
      color:
        override ??
        `oklch(from ${primaryCSSVar} l ${WHEEL_CHROMA} ${i * WHEEL_STEP + WHEEL_OFFSET})`,
      seed: luzWheelHueSeed(name, primarySeed, override),
    };
  });
}
