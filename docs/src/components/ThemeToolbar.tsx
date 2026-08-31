import { useEffect, useMemo, useState } from "react";
import { luz, type LuzConfig } from "../../../src/luz";
import { config as siteConfig } from "../../luz.config";

const STORAGE_KEY = "luz-docs-toolbar";
const SCOPE_SELECTOR = ".components-index-grid";

interface ToolbarState {
  primary: string;
  mode: "light" | "dark" | "auto";
  preset: "app" | "content" | "landing";
  neutralTint: number;
}

const DEFAULT_STATE: ToolbarState = {
  primary: siteConfig.primary,
  mode: siteConfig.mode ?? "dark",
  preset: siteConfig.preset ?? "content",
  neutralTint: siteConfig.neutralTint ?? 0,
};

function loadState(): ToolbarState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: ToolbarState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function formatConfig(state: ToolbarState): string {
  return `luz({
  primary: "${state.primary}",
  mode: "${state.mode}",
  preset: "${state.preset}",
  neutralTint: ${state.neutralTint},
})`;
}

export function ThemeToolbar() {
  const [state, setState] = useState<ToolbarState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [ready, state]);

  const config: LuzConfig = useMemo(() => ({ ...siteConfig, ...state }), [state]);
  const variables = useMemo(() => luz(config).variables, [config]);

  function update<K extends keyof ToolbarState>(key: K, value: ToolbarState[K]): void {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function reset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    location.reload();
  }

  if (!ready) return null;

  return (
    <div className="components-toolbar-body">
      <style>{`${SCOPE_SELECTOR} { ${variables} }`}</style>
      <div className="components-toolbar-controls">
        <label>
          Primary
          <input
            type="color"
            value={state.primary}
            onChange={(e) => update("primary", e.target.value)}
          />
        </label>
        <label>
          Mode
          <select
            value={state.mode}
            onChange={(e) => update("mode", e.target.value as ToolbarState["mode"])}
          >
            <option value="light">light</option>
            <option value="dark">dark</option>
            <option value="auto">auto</option>
          </select>
        </label>
        <label>
          Preset
          <select
            value={state.preset}
            onChange={(e) => update("preset", e.target.value as ToolbarState["preset"])}
          >
            <option value="app">app</option>
            <option value="content">content</option>
            <option value="landing">landing</option>
          </select>
        </label>
        <label>
          Neutral tint
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={state.neutralTint}
            onChange={(e) => update("neutralTint", Number(e.target.value))}
          />
          <span>{state.neutralTint.toFixed(1)}</span>
        </label>
        <button type="button" className="ghost" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="component-code">
        <pre>
          <code>{formatConfig(state)}</code>
        </pre>
      </div>
    </div>
  );
}
