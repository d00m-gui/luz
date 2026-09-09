import type { LuzTokens } from "../luz";

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
