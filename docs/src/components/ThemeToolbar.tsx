import { useMemo } from "react";
import { luz, type LuzConfig } from "../../../src/luz";
import { config as siteConfig } from "../../luz.config";
import {
  resetThemeState,
  THEME_SCOPE_SELECTOR,
  useThemeState,
  type ToolbarState,
} from "../lib/theme-state";

function formatConfig(state: ToolbarState): string {
  return `luz({
  primary: "${state.primary}",
  mode: "${state.mode}",
  preset: "${state.preset}",
  neutralTint: ${state.neutralTint},
})`;
}

export function ThemeToolbar() {
  const [state, update, ready] = useThemeState();

  const config: LuzConfig = useMemo(() => ({ ...siteConfig, ...state }), [state]);
  const variables = useMemo(() => luz(config).variables, [config]);

  if (!ready) return null;

  return (
    <>
<style precedence="high">{`${THEME_SCOPE_SELECTOR} { ${variables} }`}</style>
      <p className="lib-name">luz</p>
    <h4>Un estilo, todo el espectro.</h4>
    <hr />

    <div className="components-toolbar-body">
      <div className="components-toolbar-controls">
        <label>
          Primary
          <code>{state.primary}</code>
        </label>
        <label>
          Mode
          <select
            value={state.mode}
            onChange={(e) => update({ mode: e.target.value as ToolbarState["mode"] })}
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
            onChange={(e) => update({ preset: e.target.value as ToolbarState["preset"] })}
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
            onChange={(e) => update({ neutralTint: Number(e.target.value) })}
          />
          <span>{state.neutralTint.toFixed(1)}</span>
        </label>
        <button type="button" className="ghost" onClick={resetThemeState}>
          Reset
        </button>
      </div>
      <div className="component-code">
        <pre>
          <code>{formatConfig(state)}</code>
        </pre>
      </div>
      </div>
    </>
  );
}
