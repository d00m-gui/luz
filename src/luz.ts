/**
 * Luz - Lightweight theming library.
 */

import { luzShadesByHue } from "./tools/hue";
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

/** Also accepts any of luz's 10 wheel hue names (`sky`, `blue`, `cyan`, `teal`, `emerald`, `green`, `yellow`, `orange`, `copper`, `red`) as a raw CSS color. */
export interface LuzConfig extends Partial<Record<WheelHueName, string>> {
  /** Body font stack. Default `"sans-serif"`. */
  font?: string;
  /** Default `"line-height"` for body text. Default `"130%"`. */
  "line-height"?: string;
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
  /** Base color for the secondary palette. Default: primary hue rotated 180°. */
  secondary?: string;
  /**
   * Color scheme the generated palette ships as.
   * @default "dark"
   * @param "light" fixed light palette
   * @param "dark" fixed dark palette
   * @param "auto" light palette in `:root`, dark override under `@media (prefers-color-scheme: dark)`
   */
  mode?: "light" | "dark" | "auto";
  /** Custom-property name for the neutral/gray palette. Default `"neutral"`. */
  neutrals?: string;
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
  neutrals: "neutral",
  prefix: "",
  transition: "all ease 200ms",
  "box-shadow": "none",
  colorSteps: 11,
  sizeRelativeToBase: false,
  sizeFluidRange: "fixed",
  spaceSteps: 24,
};

/** Tones down a shade's chroma — inline text (links) reads calmer than the raw peak-chroma shade. */
function muted(cssVar: string): string {
  return `oklch(from ${cssVar} l calc(c * 0.6) h)`;
}

function themeVariables(tokens: LuzTokens): Record<string, string> {
  const { name, prefix, neutrals } = { ...tokens.settings };
  return {
    anchor: muted(`var(--${prefix}blue-500)`),
    "anchor-secondary": muted(`var(--${prefix}secondary-500)`),
    "anchor-contrast": `var(--${prefix}${neutrals}-500)`,
    "anchor-danger": muted(`var(--${prefix}red-500)`),
    "anchor-success": muted(`var(--${prefix}emerald-500)`),
    "anchor-warning": muted(`var(--${prefix}yellow-500)`),
    "hr-color": `var(--${prefix}${name}-500)`,
    "kbd-border-color": `var(--${prefix}${name}-900)`,
    "kbd-bg": `var(--${prefix}${name}-900)`,
    "kbd-color": `var(--on-${prefix}${name})`,
    "kbd-shadow": `var(--${prefix}${name}-500)`,
    "table-hover-bg": `var(--${prefix}${name}-800)`,
    "table-hover-color": `var(--${prefix}${name}-300)`,
    "selection-bg": `var(--${prefix}${name}-500)`,
    "selection-color": `var(--on-${prefix}${name})`,
    "file-input-border-top": `var(--${prefix}${name}-200)`,
    "range-track-bg": `var(--${prefix}${neutrals}-900)`,
    "range-track-shadow": `var(--${prefix}${name}-500)`,
    "range-thumb-active-bg": `var(--${prefix}${name}-500)`,
    accent: `var(--${prefix}${name}-500)`,
    "progress-shadow": `var(--${prefix}${name}-500)`,
    "progress-fill": `var(--${prefix}${name}-500)`,
    "checkbox-color": `var(--${prefix}${name}-100)`,
    "checkbox-checked-bg": `var(--${prefix}${name}-500)`,
    "checkbox-checked-border": `transparent`,
    "switch-bg": `var(--${prefix}${name}-500)`,
    "radio-dot-bg": `var(--${prefix}green-500)`,
    "radio-checked-bg": `var(--${prefix}${name}-500)`,
    "radio-checked-border": `var(--${prefix}${name}-500)`,
    "blockquote-border": `var(--${prefix}${name}-200)`,
    "blockquote-footer-color": `var(--${prefix}${name}-500)`,
    "btn-bg": `var(--${prefix}${name}-500)`,
    "btn-color": `var(--on-${prefix}${name})`,
    "btn-shadow-color": `var(--${prefix}${name}-700)`,
    "btn-bg-secondary": `var(--${prefix}secondary-500)`,
    "btn-color-secondary": `var(--on-${prefix}secondary)`,
    "btn-bg-neutral": `var(--${prefix}${neutrals}-500)`,
    "btn-bg-success": `var(--${prefix}green-500)`,
    "btn-bg-danger": `var(--${prefix}red-500)`,
    "btn-bg-warning": `var(--${prefix}yellow-500)`,
    "btn-color-ghost": `var(--${prefix}${name}-400)`,
    "input-valid": `var(--${prefix}green-500)`,
    "input-invalid": `var(--${prefix}red-500)`,
    "tooltip-bg": `var(--${prefix}${name}-900)`,
    "tooltip-color": `var(--${prefix}${name}-100)`,
    "badge-bg": `var(--${prefix}${name}-500)`,
    "badge-color": `var(--on-${prefix}${name})`,
    "badge-bg-success": `var(--${prefix}green-500)`,
    "badge-bg-danger": `var(--${prefix}red-500)`,
    "badge-bg-warning": `var(--${prefix}yellow-500)`,
    "badge-bg-neutral": `var(--${prefix}${neutrals}-500)`,
    "badge-color-ghost": `var(--${prefix}${name}-400)`,
    "alert-bg": `oklch(from var(--${prefix}${neutrals}-600) l c h / 12%)`,
    "alert-border": `var(--${prefix}${neutrals}-600)`,
    "alert-color": `var(--foreground)`,
    "alert-bg-success": `oklch(from var(--${prefix}green-500) l c h / 12%)`,
    "alert-border-success": `var(--${prefix}green-500)`,
    "alert-color-success": `var(--${prefix}green-300)`,
    "alert-bg-danger": `oklch(from var(--${prefix}red-500) l c h / 12%)`,
    "alert-border-danger": `var(--${prefix}red-500)`,
    "alert-color-danger": `var(--${prefix}red-300)`,
    "alert-bg-warning": `oklch(from var(--${prefix}yellow-500) l c h / 12%)`,
    "alert-border-warning": `var(--${prefix}yellow-500)`,
    "alert-color-warning": `var(--${prefix}yellow-300)`,
    "alert-bg-info": `oklch(from var(--${prefix}blue-500) l c h / 12%)`,
    "alert-border-info": `var(--${prefix}blue-500)`,
    "alert-color-info": `var(--${prefix}blue-300)`,
    "tab-color": `var(--${prefix}${neutrals}-400)`,
    "tab-color-active": `var(--foreground)`,
    "tab-border-active": `var(--${prefix}${name}-500)`,
    "modal-backdrop": `oklch(from var(--${prefix}${neutrals}-950) l c h / 60%)`,
    "breadcrumb-color": `var(--${prefix}${neutrals}-400)`,
    "breadcrumb-separator": `var(--${prefix}${neutrals}-600)`,
    "skeleton-bg": `var(--${prefix}${neutrals}-800)`,
    "skeleton-shine": `var(--${prefix}${neutrals}-700)`,
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
    power,
    secondary,
    properties: generateProperties,
    preset: _preset,
    colorSteps,
    sizeRelativeToBase,
    sizeFluidRange,
    spaceSteps,
    spacing,
    vars,
    ...typography
  } = settings;
  for (const hueName of WHEEL_HUE_NAMES) delete typography[hueName];

  const normalBase = base as number;
  const isAuto = mode === "auto";
  const isDark: boolean = isAuto ? false : mode === "dark";

  const normalName: string = name && name.length > 0 ? name : "primary";
  const primaryName: string = `${prefix}${normalName}`;
  const primaryCSSVar: string = `var(--${primaryName})`;

  const secondaryColor: string =
    secondary ?? `oklch(from ${primaryCSSVar} l c calc(h + 180))`;

  const secondaryName: string = `${prefix}secondary`;
  const secondaryCSSVar: string = `var(--${secondaryName})`;

  const neutralsName: string = `${prefix}${neutrals}`;
  const neutralCSSVar: string = `var(--${neutralsName})`;
  const neutralColor: string = `oklch(from ${primaryCSSVar} l 0 h)`;

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

    const neutralShades = luzShadesByHue({
      color: neutralCSSVar,
      name: neutralsName,
      base: 0.05,
      amplitude: 0.02,
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
      [neutralsName]: neutralColor,
      ...neutralShades,
      background: `var(--${neutralsName}-900)`,
      foreground: `var(--${neutralsName}-100)`,
      [`on-${secondaryName}`]: `oklch(from ${secondaryCSSVar} 88% 0 h)`,
      [`on-${secondaryName}-inverse`]: `oklch(from ${secondaryCSSVar} 20% 0 h)`,
      [`on-${primaryName}`]: `oklch(from var(--${primaryName}) 88% 0 h)`,
      [`on-${primaryName}-inverse`]: `oklch(from var(--${primaryName}) 20% 0 h)`,
      [`on-${neutralsName}`]: `oklch(from ${neutralCSSVar} 88% 0 h)`,
      [`on-${neutralsName}-inverse`]: `oklch(from ${neutralCSSVar} 20% 0 h)`,
      ...wheel,
      border: `var(--border-width) solid var(--element-border-color)`,
      "element-background": `var(--${neutralsName}-950)`,
      "element-border-color": `oklch(from var(--${neutralsName}-600) l c h / 50%)`,
      "border-color": `oklch(from var(--${neutralsName}-600) l c h / 50%)`,
      "element-active-border-color": `oklch(from var(--${primaryName}-200) l c h / 50%)`,
      "element-color": `var(--${primaryName}-100)`,
      "element-active-color": `var(--${primaryName}-50)`,
      "element-placeholder-color": `oklch(from var(--foreground) l c h / 50%)`,
    };
  }

  const colors = buildColors(isDark);

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


  const shadedNames = [primaryName, secondaryName, neutralsName];

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

  let darkOverrideBlock = "";
  if (isAuto) {
    const darkColors = buildColors(true);
    const changed: Record<string, string> = {};
    for (const [key, value] of Object.entries(darkColors)) {
      if (colors[key] !== value) changed[key] = value;
    }
    const darkVariables = withShadeFallback(
      toVariableLines(changed),
      shadedNames,
    );
    if (darkVariables) {
      darkOverrideBlock = `
  @media (prefers-color-scheme: dark) {
    :root {
      ${darkVariables}
    }
  }`;
    }
  }

  let style = `
  ${buildReset()}
  ${properties}
  :root {
    ${variables}
  }
  ${darkOverrideBlock}
  `;

  return { tokens, variables, style, properties };
}
