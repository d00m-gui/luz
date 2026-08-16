const WHEEL_HUES = {
  sky: 270,
  blue: 240,
  cyan: 210,
  teal: 180,
  emerald: 150,
  green: 120,
  yellow: 90,
  orange: 60,
  copper: 30,
  red: 0,
} as const;

export function luzWheel(
  color: string,
  prefix?: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(WHEEL_HUES).map(([name, rotation]) => {
      const key = prefix ? `${prefix}${name}` : name;
      return [key, `oklch(from ${color} l c ${rotation})`];
    }),
  );
}
