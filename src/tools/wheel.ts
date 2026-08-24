import { luzShadesByHue } from "./hue";

/**
 * Hand-tuned per-hue `l` (lightness %) and `c` (chroma) for each wheel color.
 * Angles are the same 10 fixed steps used before; `l`/`c` are picked per-hue
 * (not derived from a shared formula) because sRGB's in-gamut chroma ceiling
 * varies a lot by hue — e.g. yellow needs much higher L than blue to read as
 * yellow at all. Same spirit as Radix Colors / Tailwind's hand-tuned scales.
 */
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

/**
 * Build the semantic hue wheel (red/orange/copper/yellow/green/emerald/
 * teal/cyan/blue/sky), each as a full 50–950 shade ramp via `luzShadesByHue`,
 * the same function primary/secondary/neutral use.
 *
 * Unlike the old `luzWheel(color, prefix)`, this no longer inherits `l`/`c`
 * from the caller's color: a muted/pastel `primary` used to wash out "danger
 * red"/"success green", and a saturated `primary` could push yellow/green
 * out of sRGB gamut. Each hue now seeds from its own hand-tuned literal
 * instead, independent of `primary`.
 *
 * Returns a flat record with each shade (`${prefix}${name}-${weight}`) plus
 * a bare alias (`${prefix}${name}`) pointing at that hue's `-500` step, so
 * existing CSS referencing the unprefixed semantic name keeps working.
 */
export function luzWheel(
  reverse: boolean,
  prefix?: string,
  steps?: number,
): Record<string, string> {
  let wheel: Record<string, string> = {};
  for (const [name, { hue, l, c }] of Object.entries(WHEEL_HUES)) {
    const key = `${prefix ?? ""}${name}`;
    // `luzShadesByHue` wraps its `color` arg in `oklch(from ${color} ...)`.
    // A literal `oklch(L C H)` passed straight in would nest as
    // `oklch(from oklch(...) ...)` — lightningcss's relative-color parser
    // (used by the Astro build's CSS minifier) chokes on that shape, even
    // though it's valid CSS. Emit the tuned literal as its own custom
    // property first and reference it via `var()` instead, same as every
    // other `from` source in this codebase.
    const seedKey = `${key}-seed`;
    const shades = luzShadesByHue({
      color: `var(--${seedKey})`,
      name: key,
      reverse,
      steps,
    });
    wheel = {
      ...wheel,
      [seedKey]: `oklch(${l}% ${c} ${hue})`,
      ...shades,
      [key]: `var(--${key}-500)`,
    };
  }
  return wheel;
}
