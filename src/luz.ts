/**
 * Luz - Lightweight CSS-in-TypeScript theming library.
 */

import { luzShadesByHue } from "./tools/hue";
import { luzProperty, luzPropertyAsArray } from "./tools/props";
import { luzSizes } from "./tools/sizes";
import { luzWheel } from "./tools/wheel";

/**
 * Full configuration for the `luz()` function.
 */
export interface LuzConfig {
  font?: string;
  "line-height"?: string;
  "font-bold-weight"?: number;
  "font-weight"?: number;
  "font-monospace"?: string;
  "font-headings"?: string;
  "font-emphasis"?: string;
  base?: number;
  power?: number;
  primary: string;
  name?: string;
  secondary?: string;
  mode?: "light" | "dark";
  neutrals?: string;
  prefix?: string;
  transition?: string;
  "box-shadow"?: string;
  spacing?: string;
  path?: string;
}

/** Settings sub-object within tokens (metadata only). */
export interface TokenSettings {
  name: string;
  prefix?: string;
  neutrals?: string;
}

/** Generated size variable map (`--size-1` → `0.1rem`, etc.). */
export type TokenSizes = Record<string, string>;

/** Full token set used by all downstream consumers. */
export interface LuzTokens {
  settings: TokenSettings;
  colors: Record<string, string>;
  sizes: TokenSizes;
  typography: Partial<LuzConfig>;
}

/** Return value of the `luz()` function. */
export interface LuzResult {
  /** Raw tokens object (structured). */
  tokens: LuzTokens;
  /** CSS custom property declarations as a single string. */
  variables: string;
  /** CSS @property generated via tokens */
  propierties: string;
}

//  Internal Default Config
const defaultConfig: LuzConfig = {
  font: "sans-serif",
  "line-height": "130%",
  "font-bold-weight": 800,
  "font-weight": 400,
  "font-monospace": "monospace",
  "font-headings": "sans-serif",
  "font-emphasis": "serif",
  base: 16,
  power: 1.33,
  primary: "#007dea",
  name: "primary",
  mode: "dark",
  neutrals: "neutral",
  prefix: "",
  transition: "all ease 200ms",
  "box-shadow": "none",
  spacing: "5vw",
};

/**
 * Generate theme tokens and CSS custom properties from configuration.
 *
 * @param config - Optional override of default settings (typography, colors, sizing).
 * @returns Object containing structured `tokens` and a string of CSS variables.
 */
export function luz(config?: LuzConfig): LuzResult {
  const settings: LuzConfig = { ...defaultConfig, ...config };

  // Destructure top-level config fields (all optional after spread)
  const {
    primary,
    name,
    mode,
    base,
    prefix,
    neutrals,
    power,
    secondary,
    path: _path,
    ...typography
  } = settings;

  // Normalise with defaults for fields that may be undefined after spread
  const normalBase: number = (base ?? defaultConfig.base) as number;
  const isDark: boolean = mode === "dark";

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

  //  Shade arrays (hue-based oklch)
  const primaryShades: Record<string, string> = luzShadesByHue({
    color: primaryCSSVar,
    name: primaryName,
    reverse: isDark,
  });
  const secondaryShades: Record<string, string> = luzShadesByHue({
    color: secondaryCSSVar,
    name: secondaryName,
    reverse: isDark,
  });
  const neutralShades: Record<string, string> = luzShadesByHue({
    color: neutralCSSVar,
    name: neutralsName,
    base: 0.05,
    reverse: isDark,
  });

  //  Hue wheel (rotated hues from primary)
  const wheel: Record<string, string> = luzWheel(
    `var(--${primaryName})`,
    prefix,
  );

  //  Size tokens + derived sizing variables
  const sizeTokens: TokenSizes & Record<string, string> = luzSizes(
    normalBase,
    power,
  );

  //  Compose token set
  const tokens: LuzTokens = {
    settings: {
      name: normalName,
      prefix,
      neutrals,
    },
    colors: {
      primary,
      ...primaryShades,
      ...secondaryShades,
      secondary: secondaryColor,
      [neutralsName]: neutralColor,
      ...neutralShades,
      background: `var(--${neutralsName}-900)`,
      foreground: `var(--${neutralsName}-100)`,
      [`on-${secondaryName}`]: `var(--${secondaryName}-100)`,
      [`on-${primaryName}`]: `oklch(from var(--${primaryName}) 88% 0 h)`,
      ...wheel,
      border: `var(--border-width) solid var(--element-border-color)`,
      "element-background": `var(--${neutralsName}-950)`,
      "element-border-color": `oklch(from var(--${neutralsName}-600) l c h / 50%)`,
      "element-active-border-color": `oklch(from var(--${primaryName}-200) l c h / 50%)`,
      "element-color": `var(--${primaryName}-100)`,
      "element-active-color": `var(--${primaryName}-900)`,
      "element-placeholder-color": `oklch(from var(--foreground) l c h / 50%)`,
    },
    sizes: sizeTokens,
    typography: { ...typography } as Partial<LuzConfig>,
  };

  const CSSProps = luzProperty(tokens);

  //  Flatten to variables string
  const tokensList = {
    ...tokens.sizes,
    ...tokens.colors,
    ...tokens.typography,
  } as LuzTokens;

  const variableLines: string[] = [];
  for (const [key, value] of Object.entries(tokensList)) {
    if (value !== undefined && value !== null) {
      variableLines.push(`--${key}: ${value};`);
    }
  }

  return { tokens, variables: variableLines.join("\n"), propierties: CSSProps };
}
