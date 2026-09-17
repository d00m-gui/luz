import type { LuzTokens } from "../luz";

export function shadcnBridgeCSS(tokens: LuzTokens): string {
  const aliases: Record<string, string> = {
    card: "var(--element-background)",
    "card-foreground": "var(--foreground)",
    popover: "var(--element-background)",
    "popover-foreground": "var(--foreground)",
    "primary-foreground": "var(--on-primary)",
    "secondary-foreground": "var(--on-secondary)",
    border: "var(--element-border-color)",
    input: "var(--element-border-color)",
    radius: "var(--border-radius)",
    muted: "var(--neutral-800)",
    "muted-foreground": "var(--neutral-400)",
    accent: "var(--neutral-700)",
    "accent-foreground": "var(--foreground)",
    destructive: "var(--red)",
    "destructive-foreground": "oklch(from var(--red) 88% 0 h)",
    ring: "var(--primary-500)",
  };

  const lines = Object.entries(aliases)
    .map(([name, value]) => `--${name}: ${value};`)
    .join("\n");

  return `${tokens.settings.selector} {\n${lines}\n}`;
}
