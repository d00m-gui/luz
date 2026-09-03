/**
 * Luz - Lightweight theming library.
 */

import { luzContrastColor, luzHarmonyColors, luzOnColor, luzShadesByHue, type ColorHarmony } from "./tools/hue";
import { luzProperty } from "./tools/props";
import { buildReset } from "./tools/reset";
import {
  luzSizes,
  luzSpace,
  luzTextScale,
  luzTypeLandmarks,
  type FluidRangeName,
  type TypeScaleName,
} from "./tools/sizes";
import { luzWheel, WHEEL_HUE_NAMES, type WheelHueName } from "./tools/wheel";
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
  /** Base color for the tertiary palette. Default: derived from `primary` per `harmony`. Only generated for `"monochrome"`, `"triad"`, and `"analogous"` — `"complementary"` has no third color. */
  tertiary?: string;
  /** Base color for the quaternary palette. Default: derived from `primary` per `harmony`. Only generated for `"analogous"`, the only harmony with a fourth color. */
  quaternary?: string;
  /**
   * Color harmony used to derive `secondary`/`tertiary`/`quaternary` from `primary` when they aren't set explicitly.
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
  /** `--depth-base` offset added to the nesting level counted by `.card`/`.popover`/etc. (1–4, capped). Default `0`. */
  depth?: number;
  /** Max lightness offset from `background` the `--depth` elevation curve (nested `.card`/`.popover`/etc.) approaches asymptotically. Default `0.125`. */
  depthMax?: number;
  /** Per-level falloff (0–1) of the `--depth` elevation curve — smaller means more contrast between the first few nesting levels. Default `0.6`. */
  depthDecay?: number;
  /** Forces the `--depth` elevation direction/magnitude, overriding the automatic `mode`-based sign. A `.elements-depth-light`/`.elements-depth-dark` class on a subtree still overrides this. */
  depthSign?: number;
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
  /** Complete CSS as a string */
  style: string;
}

const PRESET_FLUID_RANGE: Record<NonNullable<LuzConfig["preset"]>, FluidRangeName | number> = {
  app: "fixed",
  content: "balanced",
  landing: 2.4,
};

const defaultConfig: LuzConfig = {
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
  neutralTint: 0.2,
  prefix: "",
  transition: "all ease 200ms",
  "box-shadow": "none",
  colorSteps: 11,
  sizeRelativeToBase: false,
  sizeFluidRange: "fixed",
  spaceSteps: 24,
  depth: 0,
  depthMax: 0.125,
  depthDecay: 0.6,
};

/** Tones down a shade's chroma — inline text (links) reads calmer than the raw peak-chroma shade. */
function muted(cssVar: string): string {
  return `oklch(from ${cssVar} l calc(c * 0.6) h)`;
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
  const success = `var(--${prefix}success)`;
  const danger = `var(--${prefix}danger)`;
  const warning = `var(--${prefix}warning)`;
  const info = `var(--${prefix}info)`;
  return {
    success: `var(--${prefix}green-200)`,
    danger: `var(--${prefix}red-200)`,
    warning: `var(--${prefix}yellow-200)`,
    info: `var(--${prefix}blue-200)`,
    "scheme-primary": `var(--${prefix}${name}-500)`,
    "scheme-secondary": `var(--${prefix}secondary-500)`,
    "scheme-tertiary": `var(--${prefix}tertiary-500, var(--${prefix}secondary-500))`,
    "scheme-quaternary": `var(--${prefix}quaternary-500, var(--${prefix}tertiary-500, var(--${prefix}secondary-500)))`,
    "scheme-neutral": `var(--${prefix}${neutrals}-500)`,
    anchor: muted(info),
    "anchor-secondary": muted(`var(--${prefix}secondary-500)`),
    "anchor-tertiary": muted(`var(--${prefix}tertiary-500, var(--${prefix}secondary-500))`),
    "anchor-quaternary": muted(
      `var(--${prefix}quaternary-500, var(--${prefix}tertiary-500, var(--${prefix}secondary-500)))`,
    ),
    "anchor-contrast": `var(--${prefix}${neutrals}-500)`,
    "anchor-danger": muted(danger),
    "anchor-success": muted(success),
    "anchor-warning": muted(warning),
    "hr-color": `var(--${prefix}${name}-500)`,
    "kbd-border-color": `var(--${prefix}${neutrals}-950)`,
    "kbd-bg": `var(--${prefix}${neutrals}-900)`,
    "on-kbd": luzContrastColor(`var(--kbd-bg)`),
    "kbd-shadow": `var(--${prefix}${neutrals}-500)`,
    "table-hover-bg": `var(--${prefix}${neutrals}-900)`,
    "on-table-hover": `var(--${prefix}${neutrals}-300)`,
    "selection-bg": `var(--${prefix}${name}-500)`,
    "on-selection": luzContrastColor(`var(--selection-bg)`),
    "file-input-border-top": `var(--${prefix}${name}-200)`,
    "range-track-bg": `var(--element-background)`,
    "range-track-shadow": `var(--${prefix}${name}-500)`,
    "range-thumb-active-bg": `var(--${prefix}${name}-500)`,
    accent: `var(--${prefix}${name}-500)`,
    "progress-shadow": `var(--${prefix}${name}-500)`,
    "progress-fill": `var(--${prefix}${name}-500)`,
    "on-checkbox": `var(--${prefix}${name}-100)`,
    "checkbox-checked-bg": `var(--${prefix}${name}-500)`,
    "checkbox-checked-border": `transparent`,
    "switch-bg": `var(--${prefix}${name}-500)`,
    "radio-dot-bg": success,
    "radio-checked-bg": `var(--${prefix}${name}-500)`,
    "radio-checked-border": `var(--${prefix}${name}-500)`,
    "blockquote-border": `var(--${prefix}${name}-200)`,
    "on-blockquote-footer": `var(--${prefix}${name}-500)`,
    "btn-bg": `var(--${prefix}${name}-500)`,
    "on-btn": luzContrastColor(`var(--btn-bg)`),
    "btn-bg-hover": `oklch(from var(--btn-bg) calc(l + 0.05) c h)`,
    "on-btn-ghost": `oklch(from var(--foreground) l c h / 65%)`,
    "tooltip-bg": `var(--${prefix}${neutrals}-950)`,
    "on-tooltip": `var(--${prefix}${neutrals}-300)`,
    "badge-bg": `var(--${prefix}${name}-500)`,
    "on-badge": luzContrastColor(`var(--badge-bg)`),
    "on-badge-ghost": `var(--${prefix}${name}-400)`,
    "on-tab": `oklch(from var(--foreground) l c h / 65%)`,
    "on-tab-active": `var(--foreground)`,
    "tab-border-active": `var(--${prefix}${name}-500)`,
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
  const settings: LuzConfig = { ...defaultConfig, ...config };
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
    depth,
    depthMax,
    depthDecay,
    depthSign,
    vars,
    ...typography
  } = settings;
  for (const hueName of WHEEL_HUE_NAMES) delete typography[hueName];

  const normalBase = base as number;
  const normalNeutralTint = neutralTint as number;
  const isAuto = mode === "auto";
  const isDark: boolean = isAuto ? false : mode === "dark";

  const normalName: string = name && name.length > 0 ? name : "primary";
  const primaryName: string = `${prefix}${normalName}`;
  const primaryCSSVar: string = `var(--${primaryName})`;

  const harmonyColors = luzHarmonyColors(primaryCSSVar, harmony as ColorHarmony);

  const secondaryColor: string = secondary ?? (harmonyColors[0] as string);
  const secondaryName: string = `${prefix}secondary`;
  const secondaryCSSVar: string = `var(--${secondaryName})`;

  const tertiaryColor: string | undefined = tertiary ?? harmonyColors[1];
  const tertiaryName: string = `${prefix}tertiary`;
  const tertiaryCSSVar: string = `var(--${tertiaryName})`;

  const quaternaryColor: string | undefined = quaternary ?? harmonyColors[2];
  const quaternaryName: string = `${prefix}quaternary`;
  const quaternaryCSSVar: string = `var(--${quaternaryName})`;

  const neutralsName: string = `${prefix}${neutrals}`;
  const neutralCSSVar: string = `var(--${neutralsName})`;
  const neutralColor: string = `oklch(from ${primaryCSSVar} l calc(c * ${normalNeutralTint}) h)`;

  /** Full `colors` token record for one shade direction (light or dark). */
  function buildColors(reverse: boolean): Record<string, string> {
    const primaryShades = luzShadesByHue({
      color: primaryCSSVar,
      name: primaryName,
      reverse,
      steps: colorSteps,
    });
    const secondaryShades = luzShadesByHue({
      color: secondaryCSSVar,
      name: secondaryName,
      reverse,
      steps: colorSteps,
    });

    const tertiaryShades = tertiaryColor
      ? luzShadesByHue({ color: tertiaryCSSVar, name: tertiaryName, reverse, steps: colorSteps })
      : {};

    const quaternaryShades = quaternaryColor
      ? luzShadesByHue({
          color: quaternaryCSSVar,
          name: quaternaryName,
          reverse,
          steps: colorSteps,
        })
      : {};

    const neutralShades = luzShadesByHue({
      color: neutralCSSVar,
      name: neutralsName,
      reverse,
      steps: colorSteps,
    });

    const wheel: Record<string, string> = luzWheel(
      reverse,
      primaryCSSVar,
      prefix,
      colorSteps,
      wheelOverrides,
    );

    return {
      [primaryName]: primary,
      ...primaryShades,
      ...secondaryShades,
      [secondaryName]: secondaryColor,
      ...tertiaryShades,
      ...(tertiaryColor ? { [tertiaryName]: tertiaryColor } : {}),
      ...quaternaryShades,
      ...(quaternaryColor ? { [quaternaryName]: quaternaryColor } : {}),
      [neutralsName]: neutralColor,
      ...neutralShades,
      background: `var(--${neutralsName}-900)`,
      foreground: `var(--${neutralsName}-100)`,
      ...wheel,
      border: `var(--border-width) solid var(--element-border-color)`,
      "depth-base": `${depth}`,
      "depth-max": `${depthMax}`,
      "depth-decay": `${depthDecay}`,
      "depth-sign": `${depthSign ?? (reverse ? -0.3 : 0.3)}`,
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
    ...(tertiaryColor ? [tertiaryName] : []),
    ...(quaternaryColor ? [quaternaryName] : []),
    neutralsName,
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

  const contrastFallback = toVariableLines({
    "on-btn": luzOnColor("var(--btn-bg)"),
    "on-badge": luzOnColor("var(--badge-bg)"),
    "on-kbd": luzOnColor("var(--kbd-bg)"),
    "on-selection": luzOnColor("var(--selection-bg)"),
  });

  const style = `
  ${buildReset()}
  ${properties}
  :root {
    ${colorScheme}${variables}
  }
  @supports not (color: contrast-color(black)) {
    :root {
      ${contrastFallback}
    }
  }
  `;

  return { tokens, variables, style, properties };
}
