import chroma from "chroma-js";
import { reset, setup } from "./setup";
import { luzContrast, luzShade, luzSizes, luzWheel } from "./utils";

const defaultTheme = {
  font: "sans-serif",
  "line-height": "130%",
  "font-bold-weight": 800,
  "font-weight": 400,
  "font-monospace": "monospace",
  "font-headings": "sans-serif",
  "font-emphasis": "serif",
  base: 16,
  power: 0.2,
  primary: chroma.random(),
  name: "primary",
  mode: "dark",
  neutrals: "gray",
  prefix: "",
  transition: "all ease 200ms",
  "box-shadow": "none",
  "scale-factor": 1,
  spacing: "5vw",
};

export function luzGenerator(tokens?: any): any {
  const settings = { ...defaultTheme, ...tokens };
  let {
    primary,
    name,
    mode,
    base,
    prefix,
    neutrals,
    power,
    components,
    ...config
  } = settings;
  const normalName = name && name.length > 0 ? name : "primary";
  const isDark = mode === "dark";
  const primaryShades = luzShade(primary, `${prefix}${normalName}`, isDark);
  const secondary = chroma(primary).set("hsl.h", "+180").hex();
  const secondaryShades = luzShade(secondary, `${prefix}secondary`, isDark);
  const onSecondary = luzContrast(secondary);
  const onPrimary = luzContrast(primary);
  const neutral = chroma(primary).shade(0.5).desaturate(2.1).hex();
  const neutralShades = luzShade(neutral, `${prefix}${neutrals}`, isDark);
  const wheel = luzWheel(primary, prefix);
  console.log("BASE", base);
  const sizes = luzSizes(base, power);

  const theme = {
    settings: {
      name,
      prefix,
      neutrals,
    },
    config,
    colors: {
      ...primaryShades,
      ...secondaryShades,
      ...neutralShades,
      background: `var(--${prefix}${normalName}-950)`,
      foreground: `var(--${prefix}${normalName}-50)`,
      [`on-${prefix}secondary`]: onSecondary,
      [`on-${prefix}${normalName}`]: onPrimary,
      ...wheel,
      "element-background": `var(--${prefix}${neutrals}-950)`,
      "element-border-color": `var(--${prefix}${neutrals}-900)`,
      "element-active-border-color": `var(--${prefix}${normalName}-500)`,
      "element-color": `var(--${prefix}${normalName}-100)`,
      "element-active-color": `var(--${prefix}${normalName}-100)`,
      "element-placeholder-color": `var(--${prefix}${normalName}-100)`,
    },
    sizes,
  };

  const tokensList = { ...theme.sizes, ...theme.config, ...theme.colors };

  let variables = Object.entries(tokensList)
    .map(([key, value]) => {
      return `\n--${key}:${value};`;
    })
    .join("");

  return { theme, variables, components };
}

export function luz(tokens?: any): void {
  const { theme, variables, components } = luzGenerator(tokens);
  const luzSheet = new CSSStyleSheet({ media: "all" });
  luzSheet.replaceSync(`
    ${reset}
    ${setup(theme)}
    :root {
      ${variables}
    }
  `);
  console.log(`[luz] 🏗️ CSS StyleSheet`);
  document.adoptedStyleSheets = [luzSheet];
  document.addEventListener("DOMContentLoaded", (event) => {
    console.log(`[luz] 🏗️ Ready to Show`, document.readyState);
    document.querySelector("body")?.classList.add("luz-loaded");
  });
}
