/**
 * Adds a `var(--name)` fallback to `var(--name-N)` shade references, so a
 * theme generated with fewer `colorSteps` (missing that weight) still
 * resolves to the base color instead of an undefined custom property.
 */
export function withShadeFallback(css: string, names: string[]): string {
  return names.reduce(
    (acc, name) =>
      acc.replace(
        new RegExp(`var\\(--${name}-(\\d{2,3})\\)`, "g"),
        `var(--${name}-$1, var(--${name}))`,
      ),
    css,
  );
}
