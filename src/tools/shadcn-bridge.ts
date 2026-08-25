/**
 * shadcn token bridge — maps shadcn/ui's expected CSS variable names to
 * luz's own tokens, purely by aliasing (`var(--luz-token)`), so shadcn
 * components can drop into a luz-themed page without forking their source
 * or duplicating any color computation.
 *
 * `--border` already exists under that exact name in luz's own output
 * (see `buildColors()` in `../luz`), so it's intentionally not aliased here.
 */

import type { LuzTokens } from "../luz";

/**
 * Builds the `:root { ... }` block of shadcn variable aliases for a given
 * `LuzTokens` set. Pure aliasing — the only new computation is
 * `--destructive-foreground`, which mirrors the same `oklch(from ... 88% 0 h)`
 * formula `buildColors()` uses for every other `on-{name}` contrast color,
 * applied here to the wheel's `red` hue since luz has no `on-red` token.
 */
export function shadcnBridgeCSS(tokens: LuzTokens): string {
  const prefix = tokens.settings.prefix ?? "";
  const primaryName = `${prefix}${tokens.settings.name}`;
  const secondaryName = `${prefix}secondary`;
  const neutralsName = `${prefix}${tokens.settings.neutrals}`;
  const redName = `${prefix}red`;

  const aliases: Record<string, string> = {
    card: "var(--element-background)",
    "card-foreground": "var(--foreground)",
    popover: "var(--element-background)",
    "popover-foreground": "var(--foreground)",
    "primary-foreground": `var(--on-${primaryName})`,
    "secondary-foreground": `var(--on-${secondaryName})`,
    input: "var(--element-border-color)",
    radius: "var(--border-radius)",
    muted: `var(--${neutralsName}-800)`,
    "muted-foreground": `var(--${neutralsName}-400)`,
    accent: `var(--${neutralsName}-700)`,
    "accent-foreground": "var(--foreground)",
    destructive: `var(--${redName})`,
    "destructive-foreground": `oklch(from var(--${redName}) 88% 0 h)`,
    ring: `var(--${primaryName}-500)`,
  };

  const lines = Object.entries(aliases)
    .map(([name, value]) => `--${name}: ${value};`)
    .join("\n");

  return `:root {\n${lines}\n}`;
}
