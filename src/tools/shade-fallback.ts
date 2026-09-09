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
