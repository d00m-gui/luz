import { createContext, useContext } from "react";
import type { LuzConfig, LuzTokens } from "../luz";
import type { SoundEvent } from "../tools/sound";

/** Sound handle exposed on `LuzTheme` — opt-in, driven by `config.sound`. */
export interface LuzThemeSound {
  enabled: boolean;
  setEnabled(enabled: boolean): void;
  toggle(): void;
  /** `pitch` is a frequency multiplier (1 = unchanged) for variant sounds, e.g. by className. */
  play(event: SoundEvent, pitch?: number): void;
}

/** Live theme handle: current tokens plus setters that trigger a re-render inside `<LuzReact>`. */
export interface LuzTheme {
  tokens: LuzTokens;
  sound: LuzThemeSound;
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
