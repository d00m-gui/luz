import { createContext, useContext } from "react";
import type { LuzConfig, LuzTokens } from "../luz";

/** Live theme handle: current tokens plus setters that trigger a re-render inside `<LuzReact>`. */
export interface LuzTheme {
  tokens: LuzTokens;
  setPrimary(primary: string): void;
  setMode(mode: NonNullable<LuzConfig["mode"]>): void;
}

export const LuzThemeContext: React.Context<LuzTheme | null> =
  createContext<LuzTheme | null>(null);

/** Reads the current `LuzTheme` from context. Throws if used outside `<LuzReact>`. */
export function useTheme(): LuzTheme {
  const theme = useContext(LuzThemeContext);
  if (!theme) {
    throw new Error(
      "luz: useTheme() must be called inside <LuzReact config={...}>.",
    );
  }
  return theme;
}
