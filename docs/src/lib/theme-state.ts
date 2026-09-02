import { useEffect, useState } from "react";
import type { LuzConfig } from "../../../src/luz";
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
}

export const DEFAULT_STATE: ToolbarState = {
  primary: siteConfig.primary,
  mode: siteConfig.mode ?? "dark",
  preset: siteConfig.preset ?? "content",
  neutralTint: siteConfig.neutralTint ?? 0,
  harmony: siteConfig.harmony ?? "complementary",
  depth: siteConfig.depth ?? 0,
  depthMax: siteConfig.depthMax ?? 0.125,
  depthDecay: siteConfig.depthDecay ?? 0.6,
  depthSign: siteConfig.depthSign ?? -0.3,
};

export function loadThemeState(): ToolbarState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveThemeState(state: ToolbarState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  window.dispatchEvent(new CustomEvent<ToolbarState>(EVENT, { detail: state }));
}

export function resetThemeState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  location.reload();
}

export function useThemeState(): [ToolbarState, (patch: Partial<ToolbarState>) => void, boolean] {
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
