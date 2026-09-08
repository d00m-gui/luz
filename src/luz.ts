/**
 * Luz - Lightweight theming library.
 */

import { formatOklch, parseColorToOklch, type OklchSeed } from "./tools/gamut";
import {
  luzHarmonyColorSeeds,
  luzHarmonyColors,
  luzOnColor,
  luzShadesByHue,
  nearestSchemeWeight,
  resolveBakedShade,
  type ColorHarmony,
} from "./tools/hue";
import { luzProperty } from "./tools/props";
import { buildReset } from "./tools/reset";
import { luzCustomMedia, type BreakpointsConfig } from "./tools/breakpoints";
import {
  luzSizes,
  luzSpace,
  luzTextScale,
  luzTypeLandmarks,
  type FluidRangeName,
  type TypeScaleName,
} from "./tools/sizes";
import {
  luzWheel,
  luzWheelHueSeed,
  WHEEL_CHROMA,
  WHEEL_HUE_NAMES,
  type WheelHueName,
} from "./tools/wheel";
import { withShadeFallback } from "./tools/shade-fallback";

/** Also accepts any of luz's 12 wheel hue names (`red`, `copper`, `orange`, `yellow`, `green`, `emerald`, `teal`, `cyan`, `blue`, `sky`, `violet`, `pink`) as a raw CSS color. */
export interface LuzConfig extends Partial<Record<WheelHueName, string>> {
  /** Body font stack. Default `"sans-serif"`. */
  font?: string;
  /** Default `"line-height"` for body text. Default `"130%"`. */
  "line-height"?: string;
  /** `letter-spacing` applied to `h1`-`h6`. Default `"-0.02em"`. */
  "heading-letter-spacing"?: string;
  /** `font-weight` used for `<strong>`/`<b>`. Default `800`. */
  "font-bold-weight"?: number;
  /** Base `font-weight` for body text. Default `400`. */
  "font-weight"?: number;
  /** Font stack for `<code>`/`<pre>`/`<kbd>`. Default `"monospace"`. */
  "font-monospace"?: string;
  /** Font stack for `h1`–`h6`. Default `"sans-serif"`. */
  "font-headings"?: string;
  /** Font stack for `<em>`/`<i>`. Default `"cursive"`. */
  "font-emphasis"?: string;
  /** Root font size in px, drives every size/spacing token. Default `16`. */
  base?: number;
  /**
   * Ratio for the exponential `text-*`/heading type scale, or a raw number for a custom ratio.
   * @default "perfect-fourth"
   * @param "minor-second" 1.067
   * @param "major-second" 1.125
   * @param "minor-third" 1.2
   * @param "major-third" 1.25
   * @param "perfect-fourth" 1.333
   * @param "augmented-fourth" 1.414
   * @param "perfect-fifth" 1.5
   * @param "golden" 1.618
   */
  power?: TypeScaleName | number;
  /** Base color for the primary palette (any CSS color). Required. */
  primary: string;
  /** Custom-property name for the primary palette, e.g. `--{name}-500`. Default `"primary"`. */
  name?: string;
  /** Base color for the secondary palette. Default: derived from `primary` per `harmony`. */
  secondary?: string;
  /** Base color for the tertiary palette. Default: derived from `primary` per `harmony` when it defines one (`"monochrome"`, `"triad"`, `"analogous"`); otherwise same as `neutrals` (`"complementary"` has no third color). */
  tertiary?: string;
  /** Base color for the quaternary palette. Default: derived from `primary` per `harmony` when it defines one (only `"analogous"` has a fourth color); otherwise `primary`'s own hue at a fixed low lightness — an "ink" shade in the brand hue. */
  quaternary?: string;
  /**
   * Color harmony used to derive `secondary`/`tertiary`/`quaternary` from `primary` when they aren't set explicitly. A slot a harmony doesn't define (see `tertiary`/`quaternary`) falls back to `neutrals`/an "ink" shade instead.
   * @default "complementary"
   * @param "complementary" primary + secondary, hue rotated 180°
   * @param "analogous" primary + secondary/tertiary/quaternary, hue rotated 30°/60°/90°
   * @param "triad" primary + secondary/tertiary, hue rotated 120°/240°
   * @param "monochrome" primary + secondary/tertiary, same hue, lower chroma
   */
  harmony?: ColorHarmony;
  /**
   * Color scheme the generated palette ships as.
   * @default "dark"
   * @param "light" fixed light palette
   * @param "dark" fixed dark palette
   * @param "auto" both palettes emitted in `:root` via `light-dark()`, resolved per `prefers-color-scheme`
   */
  mode?: "light" | "dark" | "auto";
  /** Custom-property name for the neutral/gray palette. Default `"neutral"`. */
  neutrals?: string;
  /** Fraction (0–1) of `primary`'s chroma carried into the neutral/gray palette. `0` = pure gray, `1` = full tint. Default `0.2`. */
  neutralTint?: number;
  /** Fraction (0–1) of `secondary`/`tertiary`/`quaternary`'s own chroma carried into their `surface-*` scale (the muted background each feeds to the `.surface-*` utility classes) — independent of `neutralTint`. Default `0.4`. */
  surfaceTint?: number;
  /**
   * Target lightness (0–1, OKLCH `l`) for `scheme-primary`/`-secondary`/`-tertiary`/`-quaternary`/`-neutral` — the shade `.badge`/`.btn`/`.alert` use, both the default (unmodified) look and every variant class (`.secondary`, `.success`, …). Instead of a fixed nominal weight, each palette picks whichever of its generated shades has the real lightness closest to this target — harmonic across hues regardless of how each one's chroma happens to fall. Requires the palette's seed to be a parseable color literal (same as gamut baking); a palette that can't be baked keeps its fixed weight. Overridden per-palette by `schemeShade`. Unset by default — behaves as `schemeShade`'s default (`500`, or `800` for `neutral`).
   */
  schemeLightness?: number;
  /** Forces the exact weight used by `scheme-*` for one or all palettes, overriding `schemeLightness`. A number applies to every palette; an object targets individual ones. Default `{ neutral: 800 }` (`500` for the rest). */
  schemeShade?:
    | number
    | Partial<
        Record<
          | "primary"
          | "secondary"
          | "tertiary"
          | "quaternary"
          | "neutral"
          | "danger"
          | "success"
          | "warning"
          | "info",
          number
        >
      >;
  /** Chroma multiplier (0–1) applied to every `scheme-*` color on top of whichever shade `schemeShade`/`schemeLightness` picks — the peak-chroma `-500` shade of a saturated hue can read too loud for `.btn`/`.badge`/`.alert`. `1` (default) leaves it untouched; same mechanism as `muted()`'s `anchor-*` (fixed at `0.6`), just a knob instead of a constant. */
  schemeChroma?: number;
  /** Prepended to every generated custom-property name (e.g. `"luz-"` → `--luz-primary-500`). Default `""`. */
  prefix?: string;
  /** Default `transition` shorthand applied via setup rules. Default `"all ease 200ms"`. */
  transition?: string;
  /** Default `box-shadow` token. Default `"none"`. */
  "box-shadow"?: string;
  /** `--spacing` token override (page-level gutter). Default derived from `base`. */
  spacing?: string;
  /** `--background` override. Default: `neutrals` 900/100 shade depending on `mode`. */
  background?: string;
  /** `--foreground` override. Default: `neutrals` 100/900 shade depending on `mode`. */
  foreground?: string;
  /**
   * Multiplier on element padding (`--element-vertical`/`--element-horizontal`, buttons/fields/forms) and form-control chrome size (`range` track/thumb). Emitted as `--density`, a live `calc()` factor (not baked at generation time) — overridable per subtree/instance by redeclaring `--density` locally, same as any custom property. `1` = default, `<1` = denser, `>1` = looser. Default `1`.
   */
  density?: number;
  /** `--depth-base` offset added to the nesting level counted by `.card`/`.popover`/etc. (1–4, capped). Default `0`. */
  depth?: number;
  /** Max lightness offset from `background` the `--depth` elevation curve (nested `.card`/`.popover`/etc.) approaches asymptotically. Default `0.125`. */
  depthMax?: number;
  /** Per-level falloff (0–1) of the `--depth` elevation curve — smaller means more contrast between the first few nesting levels. Default `0.6`. */
  depthDecay?: number;
  /** Forces the `--depth` elevation direction/magnitude, overriding the automatic `mode`-based sign. A `.elements-depth-light`/`.elements-depth-dark` class on a subtree still overrides this. */
  depthSign?: number;
  /** Lightness (0–1) above which `luzOnColor`'s auto-contrast text (the 12 wheel hues' `on-*`, and the `contrast-color()` fallback) flips from white-ish to black-ish. Emitted as `--contrast-threshold`, live (not baked) — overridable per subtree. Default `0.6`. */
  contrastThreshold?: number;
  /** Generate `@property` declarations for every token. Default `false`. */
  properties?: boolean;
  /** Shade steps generated per color palette. Default `11` (50–950). */
  colorSteps?: number;
  /**
   * How many scale rungs (see `power`) the fluid zone's viewport-max value
   * reaches past its viewport-min value, or a raw number for a custom offset.
   * @default "balanced"
   * @param "fixed" 0 — locked, no reflow with viewport width (dense app UI)
   * @param "tight" 0.35 — subtle reflow
   * @param "balanced" 1 — one full scale rung
   * @param "dramatic" 1.6 — large reflow (marketing hero text)
   */
  sizeFluidRange?: FluidRangeName | number;
  /** Sets `sizeFluidRange` (`"app"` → `"fixed"`, `"content"` → `"balanced"`, `"landing"` → steeper than `"dramatic"`). An explicit `sizeFluidRange` overrides this. */
  preset?: "app" | "content" | "landing";
  /** Scale `size-unit` and the `text-*`/heading type scale by `base / 16` instead of a fixed 16px assumption. Default `false`. */
  sizeRelativeToBase?: boolean;
  /**
   * Total `space-N` tokens generated. Default `24`. Unlike the `text-*`/
   * heading type scale (exponential — see `power` — meant for font-size/
   * typographic rhythm), `space-N` is linear and fixed (`N * base/64`, e.g.
   * `space-4` = `1rem` at the default `base`): the scale the utility
   * engine's `p-`/`m-`/`gap-`/`w-`/`h-` classes resolve against, where
   * predictable, evenly-spaced steps matter more than typographic
   * proportion.
   */
  spaceSteps?: number;
  /** Raw CSS custom properties, merged last — overrides an existing token by name or adds a new one. */
  vars?: Record<string, string | number>;
  /**
   * Named viewport breakpoints, emitted as `@custom-media --breakpoint-{name} (min-width: ...)`.
   * A number is rem, a string is used as-is (e.g. `"1200px"`). Merged over the default set. `false` disables emission entirely.
   * @default `{ sm: 40, md: 48, lg: 64, xl: 80, "2xl": 96 }` (rem)
   */
  breakpoints?: BreakpointsConfig;
}

/** Settings sub-object within tokens (metadata only). */
export interface TokenSettings {
  /** Resolved palette name (falls back to `"primary"` if `config.name` is empty). */
  name: string;
  /** Resolved `config.prefix`, echoed back for consumers building var names. */
  prefix?: string;
  /** Resolved `config.neutrals` palette name. */
  neutrals?: string;
}

/** Full token set used by all downstream consumers. */
export interface LuzTokens {
  /** Metadata about the resolved palette (name/prefix/neutrals). */
  settings: TokenSettings;
  /** Generated color variable map (primary/secondary/neutral shades, wheel, semantic aliases). */
  colors: Record<string, string>;
  /** Generated size variable map (`--size-1` → `0.1rem`, etc.). */
  sizes: Record<string, string>;
  /** Non-color, non-size config fields (fonts, weights, line-height, …), echoed back as tokens. */
  typography: Partial<LuzConfig>;
}

/** Return value of the `luz()` function. */
export interface LuzResult {
  /** Raw tokens object (structured). */
  tokens: LuzTokens;
  /** CSS custom property declarations as a single string. */
  variables: string;
  /** CSS @property generated via tokens */
  properties: string;
  /** `@custom-media --breakpoint-*` declarations */
  customMedia: string;
  /** Complete CSS as a string */
  style: string;
}

const PRESET_FLUID_RANGE: Record<
  NonNullable<LuzConfig["preset"]>,
  FluidRangeName | number
> = {
  app: "fixed",
  content: "balanced",
  landing: 2.4,
};

export const LUZ_DEFAULT_CONFIG: LuzConfig = {
  font: "sans-serif",
  "line-height": "130%",
  "heading-letter-spacing": "-0.02em",
  "font-bold-weight": 800,
  "font-weight": 400,
  "font-monospace": "monospace",
  "font-headings": "sans-serif",
  "font-emphasis": "cursive",
  base: 16,
  power: "perfect-fourth",
  primary: "#007dea",
  name: "primary",
  mode: "dark",
  harmony: "complementary",
  neutrals: "neutral",
  neutralTint: 0,
  surfaceTint: 0.4,
  schemeShade: { neutral: 800 },
  prefix: "",
  transition: "all ease 200ms",
  "box-shadow": "none",
  colorSteps: 11,
  sizeRelativeToBase: false,
  sizeFluidRange: "fixed",
  spaceSteps: 24,
  density: 1,
  depth: 0,
  depthMax: 0.125,
  depthDecay: 0.6,
  contrastThreshold: 0.6,
};

/** Tones down a shade's chroma by `factor` (default `0.6`) — the live `calc()` fallback for `chromaScaledEntry` when the seed isn't known at build time. */
function muted(cssVar: string, factor = 0.6): string {
  return `oklch(from ${cssVar} l calc(c * ${factor}) h)`;
}

/** Merges a light and a dark color map into one, wrapping each differing entry in `light-dark()`. */
function mergeLightDark(
  light: Record<string, string>,
  dark: Record<string, string>,
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const [key, lightValue] of Object.entries(light)) {
    const darkValue = dark[key];
    merged[key] =
      darkValue !== undefined && darkValue !== lightValue
        ? `light-dark(${lightValue}, ${darkValue})`
        : lightValue;
  }
  return merged;
}

function themeVariables(tokens: LuzTokens): Record<string, string> {
  const { name, prefix, neutrals } = { ...tokens.settings };
  return {
    success: `var(--${prefix}green-200)`,
    danger: `var(--${prefix}red-200)`,
    warning: `var(--${prefix}yellow-200)`,
    info: `var(--${prefix}blue-200)`,
    "anchor-contrast": `var(--${prefix}${neutrals}-500)`,
    "hr-color": `var(--scheme-primary)`,
    "kbd-border-color": `var(--${prefix}${neutrals}-950)`,
    "kbd-bg": `var(--${prefix}${neutrals}-900)`,
    "on-kbd": `var(--on-scheme, ${luzOnColor("var(--kbd-bg)")})`,
    "kbd-shadow": `var(--${prefix}${neutrals}-500)`,
    "table-hover-bg": `var(--${prefix}${neutrals}-900)`,
    "on-table-hover": `var(--${prefix}${neutrals}-300)`,
    "selection-bg": `var(--scheme-primary)`,
    "on-selection": `var(--on-scheme, ${luzOnColor("var(--selection-bg)")})`,
    "file-input-border-top": `var(--${prefix}${name}-200)`,
    "range-track-bg": `var(--element-background)`,
    "range-track-shadow": `var(--scheme-primary)`,
    "range-thumb-active-bg": `var(--scheme-primary)`,
    "range-tick-color": `var(--element-border-color)`,
    accent: `var(--scheme-primary)`,
    "progress-shadow": `var(--scheme-primary)`,
    "progress-fill": `var(--scheme-primary)`,
    "on-checkbox": `var(--${prefix}${name}-100)`,
    "checkbox-checked-bg": `var(--scheme-primary)`,
    "checkbox-checked-border": `transparent`,
    "switch-bg": `var(--scheme-primary)`,
    "radio-dot-bg": `var(--${prefix}green-200)`,
    "radio-checked-bg": `var(--scheme-primary)`,
    "radio-checked-border": `var(--scheme-primary)`,
    "blockquote-border": `var(--${prefix}${name}-200)`,
    "on-blockquote-footer": `var(--scheme-primary)`,
    "btn-bg": `var(--scheme-neutral)`,
    "on-btn": `var(--on-scheme, ${luzOnColor("var(--btn-bg)")})`,
    "btn-bg-hover": `oklch(from var(--btn-bg) calc(l + 0.05) c h)`,
    "btn-box-shadow": `oklch(from var(--btn-bg) calc(l + 0.05) c h)`,
    "on-btn-ghost": `oklch(from var(--foreground) l c h / 65%)`,
    "tooltip-bg": `var(--${prefix}${neutrals}-950)`,
    "on-tooltip": `var(--${prefix}${neutrals}-300)`,
    "badge-bg": `var(--scheme-primary)`,
    "on-badge": `var(--on-scheme, ${luzOnColor("var(--badge-bg)")})`,
    "on-badge-ghost": `var(--${prefix}${name}-400)`,
    "on-tab": `oklch(from var(--foreground) l c h / 65%)`,
    "on-tab-active": `var(--foreground)`,
    "tab-border-active": `var(--scheme-primary)`,
    "modal-backdrop": `oklch(from var(--${prefix}${neutrals}-950) l c h / 60%)`,
    "on-breadcrumb": `oklch(from var(--foreground) l c h / 65%)`,
    "breadcrumb-separator": `oklch(from var(--foreground) l c h / 35%)`,
    "skeleton-bg": `oklch(from var(--foreground) l c h / 8%)`,
    "skeleton-shine": `oklch(from var(--foreground) l c h / 14%)`,
  };
}

/**
 * Generate theme tokens and CSS custom properties from configuration.
 *
 * @param config - Optional override of default settings (typography, colors, sizing).
 * @returns Object containing structured `tokens` and a string of CSS variables.
 */
export function luz(config?: LuzConfig): LuzResult {
  const settings: LuzConfig = { ...LUZ_DEFAULT_CONFIG, ...config };
  if (config?.preset !== undefined && config?.sizeFluidRange === undefined) {
    settings.sizeFluidRange = PRESET_FLUID_RANGE[config.preset];
  }

  const wheelOverrides: Partial<Record<WheelHueName, string>> = {};
  for (const hueName of WHEEL_HUE_NAMES) {
    const value = settings[hueName];
    if (value !== undefined) wheelOverrides[hueName] = value;
  }

  const {
    primary,
    name,
    mode,
    base,
    prefix,
    neutrals,
    neutralTint,
    surfaceTint,
    schemeLightness,
    schemeShade,
    schemeChroma,
    power,
    secondary,
    tertiary,
    quaternary,
    harmony,
    properties: generateProperties,
    preset: _preset,
    colorSteps,
    sizeRelativeToBase,
    sizeFluidRange,
    spaceSteps,
    spacing,
    density,
    depth,
    depthMax,
    depthDecay,
    depthSign,
    contrastThreshold,
    vars,
    breakpoints,
    ...typography
  } = settings;
  for (const hueName of WHEEL_HUE_NAMES) delete typography[hueName];

  const normalBase = base as number;
  const normalNeutralTint = neutralTint as number;
  const normalSurfaceTint = surfaceTint as number;
  const isAuto = mode === "auto";
  const isDark: boolean = isAuto ? false : mode === "dark";

  const normalName: string = name && name.length > 0 ? name : "primary";
  const primaryName: string = `${prefix}${normalName}`;
  const primaryCSSVar: string = `var(--${primaryName})`;

  const harmonyColors = luzHarmonyColors(
    primaryCSSVar,
    harmony as ColorHarmony,
  );

  const secondaryColor: string = secondary ?? (harmonyColors[0] as string);
  const secondaryName: string = `${prefix}secondary`;
  const secondaryCSSVar: string = `var(--${secondaryName})`;

  const neutralsName: string = `${prefix}${neutrals}`;
  const neutralCSSVar: string = `var(--${neutralsName})`;
  const neutralColor: string = `oklch(from ${primaryCSSVar} l calc(c * ${normalNeutralTint}) h)`;

  /** Fixed OKLCH lightness for quaternary's "ink" fallback (harmonies without a 4th hue) — `primary`'s hue/chroma at a near-black lightness, evoking `foreground` without literally referencing it (relative-color syntax can't mix one channel from each of two different `var()` sources). */
  const QUATERNARY_INK_LIGHTNESS = 0.25;

  const tertiaryColor: string = tertiary ?? harmonyColors[1] ?? neutralCSSVar;
  const tertiaryName: string = `${prefix}tertiary`;
  const tertiaryCSSVar: string = `var(--${tertiaryName})`;

  const quaternaryColor: string =
    quaternary ??
    harmonyColors[2] ??
    `oklch(from ${primaryCSSVar} ${QUATERNARY_INK_LIGHTNESS} c h)`;
  const quaternaryName: string = `${prefix}quaternary`;
  const quaternaryCSSVar: string = `var(--${quaternaryName})`;

  const primarySeed = parseColorToOklch(primary);
  const harmonySeeds = primarySeed
    ? luzHarmonyColorSeeds(primarySeed, harmony as ColorHarmony)
    : [];
  const secondarySeed = secondary
    ? parseColorToOklch(secondary)
    : (harmonySeeds[0] ?? null);
  const neutralSeed: OklchSeed | null = primarySeed
    ? { ...primarySeed, c: primarySeed.c * normalNeutralTint }
    : null;
  const tertiarySeed = tertiary
    ? parseColorToOklch(tertiary)
    : (harmonySeeds[1] ?? neutralSeed);
  const quaternarySeed = quaternary
    ? parseColorToOklch(quaternary)
    : (harmonySeeds[2] ??
      (primarySeed ? { ...primarySeed, l: QUATERNARY_INK_LIGHTNESS } : null));

  /** Low-chroma, `neutral`-like surface scale for one accent palette (secondary/tertiary/quaternary) — same lightness curve/contrast as `neutral`, tinted toward that palette's hue instead of `primary`'s. Lets a component opt into `var(--{name}-900)`/`-100` as background/foreground without the full accent saturation. */
  function surfaceOf(
    accentCSSVar: string,
    accentSeed: OklchSeed | null,
    accentName: string,
  ): {
    name: string;
    cssVar: string;
    color: string;
    seed: OklchSeed | null;
  } {
    const surfaceName = `${prefix}surface-${accentName}`;
    return {
      name: surfaceName,
      cssVar: `var(--${surfaceName})`,
      color: `oklch(from ${accentCSSVar} l calc(c * ${normalSurfaceTint}) h)`,
      seed: accentSeed
        ? { ...accentSeed, c: accentSeed.c * normalSurfaceTint }
        : null,
    };
  }

  const surfaceSecondary = surfaceOf(
    secondaryCSSVar,
    secondarySeed,
    "secondary",
  );
  const surfaceTertiary = surfaceOf(tertiaryCSSVar, tertiarySeed, "tertiary");
  const surfaceQuaternary = surfaceOf(
    quaternaryCSSVar,
    quaternarySeed,
    "quaternary",
  );

  const infoSeed = primarySeed ? luzWheelHueSeed("blue", primarySeed) : null;
  const dangerSeed = primarySeed ? luzWheelHueSeed("red", primarySeed) : null;
  const successSeed = primarySeed
    ? luzWheelHueSeed("green", primarySeed)
    : null;
  /** Hue for `scheme-warning` — the wheel's own `yellow` slot (h=115, spaced evenly with its 11 siblings) reads as yellow-green, not yellow. */
  const WARNING_HUE = 92;
  const warningSeed = primarySeed
    ? { l: primarySeed.l, c: WHEEL_CHROMA, h: WARNING_HUE }
    : null;

  type SchemeSlot =
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "neutral"
    | "danger"
    | "success"
    | "warning"
    | "info";
  /** Resolves the weight `scheme-{slot}` picks: an explicit `schemeShade` wins outright; otherwise `schemeLightness` picks the closest real shade when the palette's seed is known; otherwise the historical fixed default (`500`, `800` for `neutral`). */
  function resolveSchemeWeight(
    slot: SchemeSlot,
    seed: OklchSeed | null,
    reverse: boolean,
  ): number {
    const explicit =
      typeof schemeShade === "number" ? schemeShade : schemeShade?.[slot];
    if (explicit !== undefined) return explicit;
    if (schemeLightness !== undefined && seed) {
      return nearestSchemeWeight(
        seed,
        colorSteps as number,
        reverse,
        schemeLightness,
      );
    }
    return slot === "neutral" ? 800 : 500;
  }

  /** A shade with its chroma scaled by `factor` (`1` = untouched): gamut-baked literal when `seed` is known, otherwise the live `calc()` formula against `liveVarRef` (a plain `var()`, or one with a fallback chain). Shared by `scheme-*` (`factor: schemeChroma`, weight picked by `resolveSchemeWeight`) and `anchor-*`/`muted()` (`factor: 0.6`, fixed weight `500`) — same operation, different factor/weight. */
  function chromaScaledEntry(
    seed: OklchSeed | null,
    weight: number,
    reverse: boolean,
    factor: number,
    liveVarRef: string,
  ): string {
    if (!seed) return factor === 1 ? liveVarRef : muted(liveVarRef, factor);
    const { l, c, h } = resolveBakedShade(seed, weight, reverse);
    return formatOklch(l, c * factor, h);
  }

  const normalSchemeChroma = schemeChroma ?? 1;

  /** Full `colors` token record for one shade direction (light or dark). */
  function buildColors(reverse: boolean): Record<string, string> {
    const primaryShades = luzShadesByHue({
      color: primaryCSSVar,
      name: primaryName,
      reverse,
      steps: colorSteps,
      seed: primarySeed,
    });
    const secondaryShades = luzShadesByHue({
      color: secondaryCSSVar,
      name: secondaryName,
      reverse,
      steps: colorSteps,
      seed: secondarySeed,
    });

    const tertiaryShades = luzShadesByHue({
      color: tertiaryCSSVar,
      name: tertiaryName,
      reverse,
      steps: colorSteps,
      seed: tertiarySeed,
    });

    const quaternaryShades = luzShadesByHue({
      color: quaternaryCSSVar,
      name: quaternaryName,
      reverse,
      steps: colorSteps,
      seed: quaternarySeed,
    });

    const neutralShades = luzShadesByHue({
      color: neutralCSSVar,
      name: neutralsName,
      reverse,
      steps: colorSteps,
      seed: neutralSeed,
    });

    const surfaceShades = (
      surface: typeof surfaceSecondary,
    ): Record<string, string> =>
      luzShadesByHue({
        color: surface.cssVar,
        name: surface.name,
        reverse,
        steps: colorSteps,
        seed: surface.seed,
      });
    const surfaceSecondaryShades = surfaceShades(surfaceSecondary);
    const surfaceTertiaryShades = surfaceShades(surfaceTertiary);
    const surfaceQuaternaryShades = surfaceShades(surfaceQuaternary);

    const wheel: Record<string, string> = luzWheel(
      reverse,
      primaryCSSVar,
      prefix,
      colorSteps,
      wheelOverrides,
      primarySeed,
    );

    const primaryWeight = resolveSchemeWeight("primary", primarySeed, reverse);
    const secondaryWeight = resolveSchemeWeight(
      "secondary",
      secondarySeed,
      reverse,
    );
    const tertiaryWeight = resolveSchemeWeight(
      "tertiary",
      tertiarySeed,
      reverse,
    );
    const quaternaryWeight = resolveSchemeWeight(
      "quaternary",
      quaternarySeed,
      reverse,
    );
    const neutralWeight = resolveSchemeWeight("neutral", neutralSeed, reverse);
    const dangerWeight = resolveSchemeWeight("danger", dangerSeed, reverse);
    const successWeight = resolveSchemeWeight("success", successSeed, reverse);
    const warningWeight = resolveSchemeWeight("warning", warningSeed, reverse);
    const infoWeight = resolveSchemeWeight("info", infoSeed, reverse);

    return {
      [primaryName]: primary,
      ...primaryShades,
      ...secondaryShades,
      [secondaryName]: secondaryColor,
      ...tertiaryShades,
      [tertiaryName]: tertiaryColor,
      ...quaternaryShades,
      [quaternaryName]: quaternaryColor,
      [neutralsName]: neutralColor,
      ...neutralShades,
      [surfaceSecondary.name]: surfaceSecondary.color,
      ...surfaceSecondaryShades,
      [surfaceTertiary.name]: surfaceTertiary.color,
      ...surfaceTertiaryShades,
      [surfaceQuaternary.name]: surfaceQuaternary.color,
      ...surfaceQuaternaryShades,
      background: `var(--${neutralsName}-900)`,
      foreground: `var(--${neutralsName}-100)`,
      ...wheel,
      "scheme-primary": chromaScaledEntry(
        primarySeed,
        primaryWeight,
        reverse,
        normalSchemeChroma,
        `var(--${primaryName}-${primaryWeight})`,
      ),
      "scheme-secondary": chromaScaledEntry(
        secondarySeed,
        secondaryWeight,
        reverse,
        normalSchemeChroma,
        `var(--${secondaryName}-${secondaryWeight})`,
      ),
      "scheme-tertiary": chromaScaledEntry(
        tertiarySeed,
        tertiaryWeight,
        reverse,
        normalSchemeChroma,
        `var(--${tertiaryName}-${tertiaryWeight})`,
      ),
      "scheme-quaternary": chromaScaledEntry(
        quaternarySeed,
        quaternaryWeight,
        reverse,
        normalSchemeChroma,
        `var(--${quaternaryName}-${quaternaryWeight})`,
      ),
      "scheme-neutral": chromaScaledEntry(
        neutralSeed,
        neutralWeight,
        reverse,
        normalSchemeChroma,
        `var(--${neutralsName}-${neutralWeight})`,
      ),
      "scheme-info": chromaScaledEntry(
        infoSeed,
        infoWeight,
        reverse,
        normalSchemeChroma,
        `var(--${prefix}info)`,
      ),
      "scheme-danger": chromaScaledEntry(
        dangerSeed,
        dangerWeight,
        reverse,
        normalSchemeChroma,
        `var(--${prefix}danger)`,
      ),
      "scheme-success": chromaScaledEntry(
        successSeed,
        successWeight,
        reverse,
        normalSchemeChroma,
        `var(--${prefix}success)`,
      ),
      "scheme-warning": chromaScaledEntry(
        warningSeed,
        warningWeight,
        reverse,
        normalSchemeChroma,
        `var(--${prefix}warning)`,
      ),
      anchor: chromaScaledEntry(
        infoSeed,
        200,
        reverse,
        0.6,
        `var(--${prefix}info)`,
      ),
      "anchor-secondary": chromaScaledEntry(
        secondarySeed,
        500,
        reverse,
        0.6,
        `var(--${secondaryName}-500)`,
      ),
      "anchor-tertiary": chromaScaledEntry(
        tertiarySeed,
        500,
        reverse,
        0.6,
        `var(--${tertiaryName}-500)`,
      ),
      "anchor-quaternary": chromaScaledEntry(
        quaternarySeed,
        500,
        reverse,
        0.6,
        `var(--${quaternaryName}-500)`,
      ),
      "anchor-danger": chromaScaledEntry(
        dangerSeed,
        200,
        reverse,
        0.6,
        `var(--${prefix}danger)`,
      ),
      "anchor-success": chromaScaledEntry(
        successSeed,
        200,
        reverse,
        0.6,
        `var(--${prefix}success)`,
      ),
      "anchor-warning": chromaScaledEntry(
        warningSeed,
        200,
        reverse,
        0.6,
        `var(--${prefix}warning)`,
      ),
      border: `var(--border-width) solid var(--element-border-color)`,
      "depth-base": `${depth}`,
      "depth-max": `${depthMax}`,
      "depth-decay": `${depthDecay}`,
      "depth-sign": `${depthSign ?? (reverse ? -0.3 : 0.3)}`,
      "contrast-threshold": `${contrastThreshold}`,
      density: `${density}`,
      "element-background": `var(--background)`,
      "element-border-color": `oklch(from var(--foreground) l c h / 20%)`,
      "border-color": `oklch(from var(--foreground) l c h / 50%)`,
      "element-active-border-color": `oklch(from var(--${primaryName}-200) l c h / 50%)`,
      "on-element": `var(--${primaryName}-100)`,
      "on-element-active": `var(--${primaryName}-50)`,
      "on-element-placeholder": `oklch(from var(--foreground) l c h / 50%)`,
    };
  }

  const colors = isAuto
    ? mergeLightDark(buildColors(false), buildColors(true))
    : buildColors(isDark);

  const sizeTokens: Record<string, string> = {
    ...luzSizes(normalBase, sizeRelativeToBase),
    ...luzTextScale(normalBase, power, sizeRelativeToBase, sizeFluidRange),
    ...luzTypeLandmarks(normalBase, power, sizeRelativeToBase, sizeFluidRange),
    ...luzSpace(normalBase, spaceSteps),
  };

  if (spacing !== undefined) sizeTokens.spacing = spacing;

  const tokens: LuzTokens = {
    settings: {
      name: normalName,
      prefix,
      neutrals,
    },
    colors,
    sizes: sizeTokens,
    typography: { ...typography } as Partial<LuzConfig>,
  };

  const properties = generateProperties ? luzProperty(tokens) : "";
  const customMedia = luzCustomMedia(breakpoints);

  /** Renders a flat `--name: value;` line per entry, skipping nullish values. */
  function toVariableLines(record: Record<string, unknown>): string {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(record)) {
      if (value !== undefined && value !== null) {
        lines.push(`--${key}: ${value};`);
      }
    }
    return lines.join("\n");
  }

  const shadedNames = [
    primaryName,
    secondaryName,
    tertiaryName,
    quaternaryName,
    neutralsName,
    surfaceSecondary.name,
    surfaceTertiary.name,
    surfaceQuaternary.name,
  ];

  const variables = withShadeFallback(
    toVariableLines({
      ...tokens.sizes,
      ...tokens.colors,
      ...tokens.typography,
      ...themeVariables(tokens),
      ...vars,
    }),
    shadedNames,
  );

  const colorScheme = isAuto ? "color-scheme: light dark;\n    " : "";

  const style = `
  ${customMedia}
  ${buildReset()}
  ${properties}
  :root {
    ${colorScheme}${variables}
  }
  `;

  return { tokens, variables, style, properties, customMedia };
}
