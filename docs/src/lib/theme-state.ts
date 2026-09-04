import { useEffect, useState } from "react";
import { LUZ_DEFAULT_CONFIG, type LuzConfig } from "../../../src/luz";
import { config as siteConfig } from "../../luz.config";

const STORAGE_KEY = "luz-docs-toolbar";
const EVENT = "luz-theme-change";

export const THEME_SCOPE_SELECTOR = ":root";

export interface ToolbarState {
  primary: string;
  mode: "light" | "dark" | "auto";
  preset: "app" | "content" | "landing";
  neutralTint: number;
  harmony: NonNullable<LuzConfig["harmony"]>;
  depth: number;
  depthMax: number;
  depthDecay: number;
  depthSign: number;
  density: number;
  contrastThreshold: number;
  schemeChroma: number;
}

export const DEFAULT_STATE: ToolbarState = {
  primary: siteConfig.primary,
  mode: siteConfig.mode ?? LUZ_DEFAULT_CONFIG.mode ?? "dark",
  preset: siteConfig.preset ?? "content",
  neutralTint: siteConfig.neutralTint ?? LUZ_DEFAULT_CONFIG.neutralTint ?? 0,
  harmony: siteConfig.harmony ?? LUZ_DEFAULT_CONFIG.harmony ?? "complementary",
  depth: siteConfig.depth ?? LUZ_DEFAULT_CONFIG.depth ?? 0,
  depthMax: siteConfig.depthMax ?? LUZ_DEFAULT_CONFIG.depthMax ?? 0.125,
  depthDecay: siteConfig.depthDecay ?? LUZ_DEFAULT_CONFIG.depthDecay ?? 0.6,
  depthSign: siteConfig.depthSign ?? -0.3,
  density: siteConfig.density ?? LUZ_DEFAULT_CONFIG.density ?? 1,
  contrastThreshold:
    siteConfig.contrastThreshold ?? LUZ_DEFAULT_CONFIG.contrastThreshold ?? 0.6,
  schemeChroma: siteConfig.schemeChroma ?? LUZ_DEFAULT_CONFIG.schemeChroma ?? 1,
};

const CONFIG_SNAPSHOT = JSON.stringify(DEFAULT_STATE);

export function loadThemeState(): ToolbarState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (parsed.configSnapshot !== CONFIG_SNAPSHOT) {
      localStorage.removeItem(STORAGE_KEY);
      return DEFAULT_STATE;
    }
    return { ...DEFAULT_STATE, ...parsed.state };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveThemeState(state: ToolbarState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ configSnapshot: CONFIG_SNAPSHOT, state }),
    );
  } catch {}
  window.dispatchEvent(new CustomEvent<ToolbarState>(EVENT, { detail: state }));
}

export function resetThemeState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  location.reload();
}

export function useThemeState(): [
  ToolbarState,
  (patch: Partial<ToolbarState>) => void,
  boolean,
] {
  const [state, setState] = useState<ToolbarState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadThemeState());
    setReady(true);
    function onChange(e: Event) {
      setState((e as CustomEvent<ToolbarState>).detail);
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  function update(patch: Partial<ToolbarState>): void {
    setState((prev) => {
      const next = { ...prev, ...patch };
      saveThemeState(next);
      return next;
    });
  }

  return [state, update, ready];
}
