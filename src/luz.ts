import { luzShadesByHue } from "./tools/hue";
import { luzSizes } from "./tools/sizes";
import { luzWheel } from "./tools/wheel";

const defaultConfig = {
  font: "sans-serif",
  "line-height": "130%",
  "font-bold-weight": 800,
  "font-weight": 400,
  "font-monospace": "monospace",
  "font-headings": "sans-serif",
  "font-emphasis": "serif",
  base: 16,
  power: 2,
  primary: `#007dea`,
  name: "primary",
  mode: "dark",
  neutrals: "neutral",
  prefix: "",
  transition: "all ease 200ms",
  "box-shadow": "none",
  spacing: "5vw",
};

export function luz(config?: any): any {
  const settings = { ...defaultConfig, ...config };
  let {
    primary,
    name,
    mode,
    base,
    prefix,
    neutrals,
    power,
    secondary,
    path,
    ...typography
  } = settings;
  if (path) {
    console.log(`[luz] Static generation`);
  }
  const normalBase = base ?? 16;
  const isDark = mode === "dark";

  const normalName = name && name.length > 0 ? name : "primary";
  const primaryName = `${prefix}${normalName}`;
  const primaryCSSVar = `var(--${primaryName})`;

  const secondaryColor =
    secondary ?? `oklch(from ${primaryCSSVar} l c calc(h + 180))`;

  const secondaryName = `${prefix}secondary`;
  const secondaryCSSVar = `var(--${secondaryName})`;

  const neutralsName = `${prefix}${neutrals}`;
  const neutralCSSVar = `var(--${neutralsName})`;
  const neutralColor = `oklch(from ${primaryCSSVar} l 0 h)`;
  const primaryShades = luzShadesByHue({
    color: primaryCSSVar,
    name: primaryName,
    reverse: isDark,
  });
  const secondaryShades = luzShadesByHue({
    color: secondaryCSSVar,
    name: secondaryName,
    reverse: isDark,
  });
  const neutralShades = luzShadesByHue({
    color: neutralCSSVar,
    name: neutralsName,
    base: 0.05,
    reverse: isDark,
  });

  const wheel = luzWheel(`var(--${primaryName})`, prefix);
  const sizes = luzSizes(normalBase, power);

  const tokens = {
    settings: {
      name,
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
    sizes,
    typography,
  };
  const tokensList = {
    ...tokens.sizes,
    ...tokens.colors,
    ...tokens.typography,
  };
  const variables = Object.entries(tokensList)
    .map(([key, value]) => {
      return `\n--${key}:${value};`;
    })
    .join("");

  return { tokens, variables };
}
