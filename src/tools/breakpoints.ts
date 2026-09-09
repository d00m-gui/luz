/** Default named breakpoints (rem), `min-width`-based. */
export const DEFAULT_BREAKPOINTS: Record<string, number> = {
  sm: 40,
  md: 48,
  lg: 64,
  xl: 80,
  "2xl": 96,
};

/** Config shape for `LuzConfig["breakpoints"]`. */
export type BreakpointsConfig =
  | Partial<Record<string, string | number>>
  | false;

/** Renders `@custom-media --breakpoint-{name} (min-width: ...);` for each entry, merging `config` over `DEFAULT_BREAKPOINTS`. `false` disables emission. */
export function luzCustomMedia(config: BreakpointsConfig | undefined): string {
  if (config === false) return "";
  const merged: Record<string, string | number | undefined> = {
    ...DEFAULT_BREAKPOINTS,
    ...config,
  };
  return Object.entries(merged)
    .filter(
      (entry): entry is [string, string | number] => entry[1] !== undefined,
    )
    .map(([name, value]) => {
      const size = typeof value === "number" ? `${value}rem` : value;
      return `@custom-media --breakpoint-${name} (min-width: ${size});`;
    })
    .join("\n");
}
