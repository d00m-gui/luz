/**
 * Luz - Lightweight theming library.
 */

import { formatOklch, parseColorToOklch, type OklchSeed } from "./tools/gamut";
import {
  luzHarmonyColorSeeds,
  luzHarmonyColors,
  luzOnColor,
  luzPaletteSeeds,
  luzShades,
  nearestSchemeWeight,
  type ColorHarmony,
  type LuzPalette,
  type LuzRamp,
} from "./tools/hue";
import { luzProperty } from "./tools/props";
import {
  luzSizes,
  luzSpace,
  luzTextScale,
  luzTypeLandmarks,
  type FluidRangeName,
  type TypeScaleName,
} from "./tools/sizes";
import {
  luzWheelPalettes,
  WHEEL_CHROMA,
  WHEEL_HUE_NAMES,
  type WheelHueName,
} from "./tools/wheel";

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
  /** Base color for the primary palette (any CSS color). Default `"#007dea"`. */
  primary?: string;
  /** Base color for the secondary palette. Default: derived from `primary` per `harmony`. */
  secondary?: string;
  /** Base color for the tertiary palette. Default: derived from `primary` per `harmony` when it defines one (`"monochrome"`, `"triad"`, `"analogous"`); otherwise same as `neutral` (`"complementary"` has no third color). */
  tertiary?: string;
  /** Base color for the quaternary palette. Default: derived from `primary` per `harmony` when it defines one (only `"analogous"` has a fourth color); otherwise `primary`'s own hue at a fixed low lightness — an "ink" shade in the brand hue. */
  quaternary?: string;
  /**
   * Color harmony used to derive `secondary`/`tertiary`/`quaternary` from `primary` when they aren't set explicitly. A slot a harmony doesn't define (see `tertiary`/`quaternary`) falls back to `neutral`/an "ink" shade instead.
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
  /** Fraction (0–1) of `primary`'s chroma carried into the neutral/gray palette. `0` = pure gray, `1` = full tint. Default `0`. */
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
  /** Selector the theme block (`color-scheme` + every custom property) is emitted under. Default `":root"`. */
  selector?: string;
  /** Default `transition` shorthand applied via setup rules. Default `"all ease 200ms"`. */
  transition?: string;
  /** Default `box-shadow` token. Default `"none"`. */
  "box-shadow"?: string;
  /** `--spacing` token override (page-level gutter). Default derived from `base`. */
  spacing?: string;
  /** `--background` override. Default: `neutral` 900/100 shade depending on `mode`. */
  background?: string;
  /** `--foreground` override. Default: `neutral` 100/900 shade depending on `mode`. */
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
  /**
   * Multiplier on the base radius unit (`base / 78` rem), or a literal CSS value used as `--border-radius` verbatim (`"8px"`, `"0"`). Drives the whole `--border-radius-N` scale.
   * @default 1
   */
  radius?: number | string;
  /**
   * Total `border-radius-N` tokens generated (`N * ` the radius unit), the scale `rounded-N` resolves against — linear, same shape as `space-N`.
   * @default 8
   */
  radiusSteps?: number;
  /**
   * Lightness (OKLCH `l`) added to `--current-bg` on `:hover`. Emitted as `--state-hover-delta`, live (not baked) — overridable per subtree.
   * @default 0.02
   */
  stateHoverDelta?: number;
  /**
   * Lightness (OKLCH `l`) subtracted from `--current-bg` on `:active`. Emitted as `--state-pressed-delta`, live (not baked) — overridable per subtree.
   * @default 0.02
   */
  statePressedDelta?: number;
  /**
   * `translateY` applied on `:active`. Emitted as `--state-pressed-shift`, live (not baked) — overridable per subtree.
   * @default "0.1ch"
   */
  statePressedShift?: string;
  /** Generate `@property` declarations for every token. Default `false`. */
  properties?: boolean;
  /**
   * How many scale rungs (see `power`) the fluid zone's viewport-max value
   * reaches past its viewport-min value, or a raw number for a custom offset.
   * @default "fixed"
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
}

/** Settings sub-object within tokens (metadata only). */
export interface TokenSettings {
  /** Resolved `config.selector`. */
  selector: string;
}

/** Baked OKLCH ramps keyed by palette name (as in `colors`). */
export type LuzPalettes = Record<string, LuzRamp>;

/** Full token set used by all downstream consumers. */
export interface LuzTokens {
  /** Metadata about the emitted theme block (selector). */
  settings: TokenSettings;
  /** Generated color variable map (primary/secondary/neutral shades, wheel, semantic aliases). */
  colors: Record<string, string>;
  /** Numeric OKLCH per palette/weight for every palette whose seed parsed, per scheme — both in `mode: "auto"`, only the active one otherwise. */
  palettes: Partial<Record<"light" | "dark", LuzPalettes>>;
  /** Generated size variable map (`--size-unit`, `--border-radius`, `--element-*`, `--space-N`, `--text-*`, …). */
  sizes: Record<string, string>;
  /** Non-color, non-size config fields (fonts, weights, line-height, …), echoed back as tokens. */
  typography: Partial<LuzConfig>;
}

/** Return value of the `luz()` function. */
export interface LuzResult {
  /** Raw tokens object (structured). */
  tokens: LuzTokens;
  /** CSS custom property declarations as a single string, active scheme only — in `mode: "auto"` the scheme-dependent scalars carry their light value. */
  variables: string;
  /** CSS @property generated via tokens */
  properties: string;
  /** `properties` + the `selector { … }` block, plus the `prefers-color-scheme: dark` override of the scheme-dependent scalars in `mode: "auto"`. */
  theme: string;
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
  mode: "dark",
  harmony: "complementary",
  neutralTint: 0,
  surfaceTint: 0.4,
  schemeShade: { neutral: 800 },
  selector: ":root",
  transition: "all ease 200ms",
  "box-shadow": "none",
  sizeRelativeToBase: false,
  sizeFluidRange: "fixed",
  spaceSteps: 24,
  radius: 1,
  radiusSteps: 8,
  stateHoverDelta: 0.02,
  statePressedDelta: 0.02,
  statePressedShift: "0.1ch",
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

function themeVariables(): Record<string, string> {
  return {
    success: `var(--green-200)`,
    danger: `var(--red-200)`,
    warning: `var(--yellow-200)`,
    info: `var(--blue-200)`,
    "anchor-contrast": `var(--neutral-500)`,
    "hr-color": `var(--scheme-primary)`,
    "kbd-bg": `var(--neutral-900)`,
    "on-kbd": `var(--on-scheme, ${luzOnColor("var(--kbd-bg)")})`,
    "kbd-shadow": `var(--neutral-500)`,
    "code-bg": `light-dark(oklch(from var(--element-background) calc(l - 0.03) c h), oklch(from var(--element-background) calc(l + 0.03) c h))`,
    "on-code": `var(--foreground)`,
    "table-hover-bg": `var(--neutral-900)`,
    "on-table-hover": `var(--neutral-300)`,
    "selection-bg": `var(--scheme-primary)`,
    "on-selection": `var(--on-scheme, ${luzOnColor("var(--selection-bg)")})`,
    "file-input-border-top": `var(--primary-200)`,
    "range-track-bg": `var(--element-background)`,
    "range-track-shadow": `var(--scheme-primary)`,
    "range-thumb-active-bg": `var(--scheme-primary)`,
    "range-tick-color": `var(--element-border-color)`,
    "progress-shadow": `var(--scheme-primary)`,
    "progress-fill": `var(--scheme-primary)`,
    "on-checkbox": `var(--primary-100)`,
    "checkbox-checked-bg": `var(--scheme-primary)`,
    "checkbox-checked-border": `transparent`,
    "switch-bg": `var(--scheme-primary)`,
    "radio-dot-bg": `var(--green-200)`,
    "radio-checked-bg": `var(--scheme-primary)`,
    "radio-checked-border": `var(--scheme-primary)`,
    "blockquote-border": `var(--primary-200)`,
    "on-blockquote-footer": `var(--scheme-primary)`,
    "btn-bg": `var(--scheme-neutral)`,
    "on-btn": `var(--on-scheme, ${luzOnColor("var(--btn-bg)")})`,
    "on-btn-ghost": `oklch(from var(--foreground) l c h / 65%)`,
    "tooltip-bg": `var(--neutral-950)`,
    "on-tooltip": `var(--neutral-300)`,
    "badge-bg": `var(--scheme-primary)`,
    "on-badge": `var(--on-scheme, ${luzOnColor("var(--badge-bg)")})`,
    "on-badge-ghost": `var(--primary-400)`,
    "on-tab": `oklch(from var(--foreground) l c h / 65%)`,
    "on-tab-active": `var(--foreground)`,
    "tab-border-active": `var(--scheme-primary)`,
    "modal-backdrop": `oklch(from var(--neutral-950) l c h / 60%)`,
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
    mode,
    base,
    selector,
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
    background,
    foreground,
    properties: generateProperties,
    preset: _preset,
    sizeRelativeToBase,
    sizeFluidRange,
    spaceSteps,
    radius,
    radiusSteps,
    stateHoverDelta,
    statePressedDelta,
    statePressedShift,
    spacing,
    density,
    depth,
    depthMax,
    depthDecay,
    depthSign,
    contrastThreshold,
    vars,
    ...typography
  } = settings;
  for (const hueName of WHEEL_HUE_NAMES) delete typography[hueName];

  const normalPrimary = primary as string;
  const normalBase = base as number;
  const normalNeutralTint = neutralTint as number;
  const normalSurfaceTint = surfaceTint as number;
  const isAuto = mode === "auto";
  const isDark: boolean = isAuto ? false : mode === "dark";

  const primaryCSSVar = "var(--primary)";
  const primarySeed = parseColorToOklch(normalPrimary);
  const harmonyColors = luzHarmonyColors(
    primaryCSSVar,
    harmony as ColorHarmony,
  );
  const harmonySeeds = primarySeed
    ? luzHarmonyColorSeeds(primarySeed, harmony as ColorHarmony)
    : [];

  const primaryPalette: LuzPalette = {
    name: "primary",
    color: normalPrimary,
    seed: primarySeed,
  };
  const neutralPalette: LuzPalette = {
    name: "neutral",
    color: `oklch(from ${primaryCSSVar} l calc(c * ${normalNeutralTint}) h)`,
    seed: primarySeed
      ? { ...primarySeed, c: primarySeed.c * normalNeutralTint }
      : null,
  };

  /** OKLCH lightness of quaternary's "ink" fallback (harmonies without a 4th hue). */
  const QUATERNARY_INK_LIGHTNESS = 0.25;

  /** The explicit config color, else the harmony's color for `slot`, else `fallback`. */
  function accentPalette(
    name: string,
    explicit: string | undefined,
    slot: number,
    fallback: Omit<LuzPalette, "name">,
  ): LuzPalette {
    if (explicit !== undefined) {
      return { name, color: explicit, seed: parseColorToOklch(explicit) };
    }
    const color = harmonyColors[slot];
    if (color === undefined) return { name, ...fallback };
    return { name, color, seed: harmonySeeds[slot] ?? null };
  }

  const neutralFallback = {
    color: "var(--neutral)",
    seed: neutralPalette.seed,
  };
  const secondaryPalette = accentPalette(
    "secondary",
    secondary,
    0,
    neutralFallback,
  );
  const tertiaryPalette = accentPalette(
    "tertiary",
    tertiary,
    1,
    neutralFallback,
  );
  const quaternaryPalette = accentPalette("quaternary", quaternary, 2, {
    color: `oklch(from ${primaryCSSVar} ${QUATERNARY_INK_LIGHTNESS} c h)`,
    seed: primarySeed ? { ...primarySeed, l: QUATERNARY_INK_LIGHTNESS } : null,
  });

  /** Low-chroma surface scale for an accent: `neutral`'s lightness curve tinted toward that palette's hue. */
  function surfaceOf(accent: LuzPalette): LuzPalette {
    return {
      name: `surface-${accent.name}`,
      color: `oklch(from var(--${accent.name}) l calc(c * ${normalSurfaceTint}) h)`,
      seed: accent.seed
        ? { ...accent.seed, c: accent.seed.c * normalSurfaceTint }
        : null,
    };
  }

  const accentPalettes = [
    primaryPalette,
    secondaryPalette,
    tertiaryPalette,
    quaternaryPalette,
  ];
  const namedPalettes = [
    ...accentPalettes,
    neutralPalette,
    surfaceOf(secondaryPalette),
    surfaceOf(tertiaryPalette),
    surfaceOf(quaternaryPalette),
  ];
  const wheelPalettes = luzWheelPalettes(
    primaryCSSVar,
    primarySeed,
    wheelOverrides,
  );

  /** Hue for `scheme-warning`; the wheel's `yellow` slot (h=115) reads yellow-green. */
  const WARNING_HUE = 92;
  const warningSeed: OklchSeed | null = primarySeed
    ? { l: primarySeed.l, c: WHEEL_CHROMA, h: WARNING_HUE }
    : null;

  const normalSchemeChroma = schemeChroma ?? 1;

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

  /** Bakes every palette with a known seed for one scheme and derives the whole `colors` record from those ramps. */
  function buildScheme(reverse: boolean): {
    palettes: LuzPalettes;
    colors: Record<string, string>;
    scalars: Record<string, string>;
  } {
    const palettes: LuzPalettes = {};
    for (const palette of [...namedPalettes, ...wheelPalettes]) {
      if (palette.seed) {
        palettes[palette.name] = luzPaletteSeeds(palette.seed, reverse);
      }
    }
    const warningRamp = warningSeed
      ? luzPaletteSeeds(warningSeed, reverse)
      : undefined;

    /** One shade with chroma scaled by `factor`: literal from `ramp` when baked, else a live `calc()` against `liveVarRef`. */
    function shade(
      ramp: LuzRamp | undefined,
      weight: number,
      factor: number,
      liveVarRef: string,
    ): string {
      const baked = ramp?.[weight];
      if (!baked) return factor === 1 ? liveVarRef : muted(liveVarRef, factor);
      return formatOklch(baked.l, baked.c * factor, baked.h);
    }

    /** `scheme-{slot}`: weight from explicit `schemeShade`, else `schemeLightness` against the ramp, else `500` (`800` for `neutral`). */
    function scheme(
      slot: SchemeSlot,
      ramp: LuzRamp | undefined,
      liveVarRef: (weight: number) => string,
    ): string {
      const explicit =
        typeof schemeShade === "number" ? schemeShade : schemeShade?.[slot];
      const weight =
        explicit ??
        (schemeLightness !== undefined && ramp
          ? nearestSchemeWeight(ramp, schemeLightness)
          : slot === "neutral"
            ? 800
            : 500);
      return shade(ramp, weight, normalSchemeChroma, liveVarRef(weight));
    }

    const colors: Record<string, string> = {};
    for (const { name, color } of namedPalettes) {
      colors[name] = color;
      Object.assign(
        colors,
        luzShades(name, `var(--${name})`, reverse, palettes[name]),
      );
    }
    colors.background = background ?? "var(--neutral-900)";
    colors.foreground = foreground ?? "var(--neutral-100)";
    for (const { name } of accentPalettes) {
      colors[`on-${name}`] = luzOnColor(`var(--${name})`);
    }
    for (const { name, color } of wheelPalettes) {
      const seedVar = `var(--${name}-seed)`;
      colors[`${name}-seed`] = color;
      Object.assign(colors, luzShades(name, seedVar, reverse, palettes[name]));
      colors[name] = `var(--${name}-500)`;
      colors[`on-${name}`] = luzOnColor(seedVar);
    }

    const p = palettes;
    Object.assign(colors, {
      "scheme-primary": scheme(
        "primary",
        p.primary,
        (w) => `var(--primary-${w})`,
      ),
      "scheme-secondary": scheme(
        "secondary",
        p.secondary,
        (w) => `var(--secondary-${w})`,
      ),
      "scheme-tertiary": scheme(
        "tertiary",
        p.tertiary,
        (w) => `var(--tertiary-${w})`,
      ),
      "scheme-quaternary": scheme(
        "quaternary",
        p.quaternary,
        (w) => `var(--quaternary-${w})`,
      ),
      "scheme-neutral": scheme(
        "neutral",
        p.neutral,
        (w) => `var(--neutral-${w})`,
      ),
      "scheme-info": scheme("info", p.blue, () => "var(--info)"),
      "scheme-danger": scheme("danger", p.red, () => "var(--danger)"),
      "scheme-success": scheme("success", p.green, () => "var(--success)"),
      "scheme-warning": scheme("warning", warningRamp, () => "var(--warning)"),
      anchor: shade(p.blue, 200, 0.6, "var(--info)"),
      "anchor-secondary": shade(p.secondary, 500, 0.6, "var(--secondary-500)"),
      "anchor-tertiary": shade(p.tertiary, 500, 0.6, "var(--tertiary-500)"),
      "anchor-quaternary": shade(
        p.quaternary,
        500,
        0.6,
        "var(--quaternary-500)",
      ),
      "anchor-danger": shade(p.red, 200, 0.6, "var(--danger)"),
      "anchor-success": shade(p.green, 200, 0.6, "var(--success)"),
      "anchor-warning": shade(warningRamp, 200, 0.6, "var(--warning)"),
    });

    /** Unitless/length knobs, kept out of the `light-dark()` color merge. */
    const scalars: Record<string, string> = {
      "depth-base": `${depth}`,
      "depth-max": `${depthMax}`,
      "depth-decay": `${depthDecay}`,
      "depth-sign": `${depthSign ?? (reverse ? -0.3 : 0.3)}`,
      "contrast-threshold": `${contrastThreshold}`,
      density: `${density}`,
      "state-hover-delta": `${stateHoverDelta}`,
      "state-pressed-delta": `${statePressedDelta}`,
      "state-pressed-shift": `${statePressedShift}`,
    };

    Object.assign(colors, {
      "element-background": "var(--background)",
      "element-border-color": "oklch(from var(--foreground) l c h / 20%)",
      "border-color": "oklch(from var(--foreground) l c h / 50%)",
      "element-active-border-color":
        "oklch(from var(--primary-200) l c h / 50%)",
      "on-element": "var(--primary-100)",
      "on-element-active": "var(--primary-50)",
      "on-element-placeholder": "oklch(from var(--foreground) l c h / 50%)",
    });
    return { palettes, colors, scalars };
  }

  const active = buildScheme(isDark);
  const other = isAuto ? buildScheme(true) : undefined;
  const colors = {
    ...(other ? mergeLightDark(active.colors, other.colors) : active.colors),
    ...active.scalars,
  };
  const palettes: LuzTokens["palettes"] = {
    [isDark ? "dark" : "light"]: active.palettes,
  };
  if (other) palettes.dark = other.palettes;

  const sizeTokens: Record<string, string> = {
    ...luzSizes(normalBase, sizeRelativeToBase, radius, radiusSteps),
    ...luzTextScale(normalBase, power, sizeRelativeToBase, sizeFluidRange),
    ...luzTypeLandmarks(normalBase, power, sizeRelativeToBase, sizeFluidRange),
    ...luzSpace(normalBase, spaceSteps),
  };

  if (spacing !== undefined) sizeTokens.spacing = spacing;

  const tokens: LuzTokens = {
    settings: {
      selector: selector as string,
    },
    colors,
    palettes,
    sizes: sizeTokens,
    typography: { ...typography } as Partial<LuzConfig>,
  };

  const properties = generateProperties ? luzProperty(tokens) : "";

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

  const variables = toVariableLines({
    ...tokens.sizes,
    ...tokens.colors,
    ...tokens.typography,
    ...themeVariables(),
    ...vars,
  });

  /** Dark-scheme values of the scheme-dependent scalars (`--depth-sign`), minus any key `config.vars` sets. */
  const darkScalars = other
    ? Object.fromEntries(
        Object.entries(other.scalars).filter(
          ([key, value]) =>
            value !== active.scalars[key] && vars?.[key] === undefined,
        ),
      )
    : {};

  const colorScheme = `color-scheme: ${isAuto ? "light dark" : mode};\n    `;

  const darkBlock =
    Object.keys(darkScalars).length > 0
      ? `
  @media (prefers-color-scheme: dark) {
    ${selector} {
      ${toVariableLines(darkScalars)}
    }
  }`
      : "";

  const theme = `
  ${properties}
  ${selector} {
    ${colorScheme}${variables}
  }${darkBlock}
  `;

  return { tokens, variables, properties, theme };
}
