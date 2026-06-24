export function luzShadesByHue({
  color,
  name,
  base = 0.0,
  reverse = false,
}: {
  color: string;
  name: string;
  base?: number;
  reverse?: boolean;
}) {
  const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  let percents = [14.5, 20.5, 26.9, 37.1, 43.9, 55.6, 88, 88.8, 92.2, 98, 99.9];
  if (reverse) {
    percents.reverse();
  }

  let shades = {};
  for (let step = 0; step < weights.length; step++) {
    const perIndex = (step + 1) / 10;
    const sin = `clamp(0, calc(${base} + (sin(${perIndex} * pi) * c)), 0.4)`;
    let percentages = percents;
    const percent = percentages[step];
    const key = `${name}-${weights[step]}`;
    const value = `oklch(from ${color} ${percent}% ${sin} h)`;
    const pair = { [key]: value };
    shades = { ...pair, ...shades };
  }

  return shades;
}
