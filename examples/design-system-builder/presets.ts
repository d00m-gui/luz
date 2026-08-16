import type { LuzConfig } from "../../src/luz";

/**
 * Known terminal/editor color schemes, translated into luz config.
 * `primary`/`secondary`/`background`/`foreground` map to real `LuzConfig`
 * fields; `overrides` re-labels luz's hue wheel (`--red`, `--green`, …) to
 * match each scheme's actual accent colors — applied via the same
 * `:root` override mechanism as the sidebar's manual "Color overrides" list.
 */
export interface Preset {
  name: string;
  mode: NonNullable<LuzConfig["mode"]>;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  overrides: Record<string, string>;
}

export const PRESETS: Preset[] = [
  {
    name: "Dracula",
    mode: "dark",
    primary: "#bd93f9",
    secondary: "#ff79c6",
    background: "#282a36",
    foreground: "#f8f8f2",
    overrides: {
      red: "#ff5555",
      orange: "#ffb86c",
      yellow: "#f1fa8c",
      green: "#50fa7b",
      cyan: "#8be9fd",
    },
  },
  {
    name: "Nord",
    mode: "dark",
    primary: "#88c0d0",
    secondary: "#5e81ac",
    background: "#2e3440",
    foreground: "#d8dee9",
    overrides: {
      red: "#bf616a",
      orange: "#d08770",
      yellow: "#ebcb8b",
      green: "#a3be8c",
      cyan: "#88c0d0",
      blue: "#5e81ac",
    },
  },
  {
    name: "Tokyo Night",
    mode: "dark",
    primary: "#7aa2f7",
    secondary: "#bb9af7",
    background: "#1a1b26",
    foreground: "#c0caf5",
    overrides: {
      red: "#f7768e",
      orange: "#ff9e64",
      yellow: "#e0af68",
      green: "#9ece6a",
      cyan: "#7dcfff",
      blue: "#7aa2f7",
    },
  },
  {
    name: "One Dark",
    mode: "dark",
    primary: "#61afef",
    secondary: "#c678dd",
    background: "#282c34",
    foreground: "#abb2bf",
    overrides: {
      red: "#e06c75",
      orange: "#d19a66",
      yellow: "#e5c07b",
      green: "#98c379",
      cyan: "#56b6c2",
      blue: "#61afef",
    },
  },
  {
    name: "Catppuccin",
    mode: "dark",
    primary: "#cba6f7",
    secondary: "#f5c2e7",
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    overrides: {
      red: "#f38ba8",
      orange: "#fab387",
      yellow: "#f9e2af",
      green: "#a6e3a1",
      teal: "#94e2d5",
      cyan: "#89dceb",
      blue: "#89b4fa",
    },
  },
  {
    name: "Gruvbox",
    mode: "dark",
    primary: "#fe8019",
    secondary: "#b16286",
    background: "#282828",
    foreground: "#ebdbb2",
    overrides: {
      red: "#fb4934",
      orange: "#fe8019",
      yellow: "#fabd2f",
      green: "#b8bb26",
      cyan: "#8ec07c",
      blue: "#83a598",
    },
  },
  {
    name: "Monokai",
    mode: "dark",
    primary: "#f92672",
    secondary: "#66d9ef",
    background: "#272822",
    foreground: "#f8f8f2",
    overrides: {
      red: "#f92672",
      orange: "#fd971f",
      yellow: "#e6db74",
      green: "#a6e22e",
      cyan: "#66d9ef",
    },
  },
  {
    name: "Solarized Dark",
    mode: "dark",
    primary: "#268bd2",
    secondary: "#2aa198",
    background: "#002b36",
    foreground: "#839496",
    overrides: {
      red: "#dc322f",
      orange: "#cb4b16",
      yellow: "#b58900",
      green: "#859900",
      cyan: "#2aa198",
      blue: "#268bd2",
    },
  },
  {
    name: "Solarized Light",
    mode: "light",
    primary: "#268bd2",
    secondary: "#2aa198",
    background: "#fdf6e3",
    foreground: "#657b83",
    overrides: {
      red: "#dc322f",
      orange: "#cb4b16",
      yellow: "#b58900",
      green: "#859900",
      cyan: "#2aa198",
      blue: "#268bd2",
    },
  },
];
