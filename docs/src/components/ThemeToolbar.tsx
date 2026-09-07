import { useMemo, type CSSProperties } from "react";
import { luz, type LuzConfig } from "../../../src/luz";
import { config as siteConfig } from "../../luz.config";
import {
  resetThemeState,
  THEME_SCOPE_SELECTOR,
  useThemeState,
  type ToolbarState,
} from "../lib/theme-state";

function resolveHex(color: string): string {
  const probe = document.createElement("div");
  probe.style.color = color;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color;
  probe.remove();
  const m = rgb.match(/\d+/g);
  if (!m) return "#000000";
  const [r, g, b] = m.map(Number);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function formatConfig(state: ToolbarState): string {
  return `luz({
  primary: "${state.primary}",${state.background ? `\n  background: "${state.background}",` : ""}
  mode: "${state.mode}",
  harmony: "${state.harmony}",
  preset: "${state.preset}",
  neutralTint: ${state.neutralTint},
  depth: ${state.depth},
  depthMax: ${state.depthMax},
  depthDecay: ${state.depthDecay},
  depthSign: ${state.depthSign},
  density: ${state.density},
  contrastThreshold: ${state.contrastThreshold},
  schemeChroma: ${state.schemeChroma},
})`;
}

export function ThemeToolbar() {
  const [state, update, ready] = useThemeState();

  const config: LuzConfig = useMemo(
    () => ({
      ...siteConfig,
      ...state,
      background: state.background || undefined,
    }),
    [state],
  );
  const variables = useMemo(() => luz(config).variables, [config]);

  if (!ready) return null;

  return (
    <>
      <style precedence="high">{`${THEME_SCOPE_SELECTOR} { ${variables} }`}</style>
      <div className="components-toolbar-body">
        <div className="components-toolbar-controls">
          <label>
            Primary
            <input
              type="color"
              value={resolveHex(state.primary)}
              onChange={(e) => update({ primary: e.target.value })}
            />
          </label>
          <label>
            Background
            <input
              type="color"
              value={resolveHex(state.background || "var(--background)")}
              onChange={(e) => update({ background: e.target.value })}
            />
          </label>
          <label>
            Mode
            <select
              value={state.mode}
              onChange={(e) =>
                update({ mode: e.target.value as ToolbarState["mode"] })
              }
            >
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </label>
          <label>
            Harmony
            <select
              value={state.harmony}
              onChange={(e) =>
                update({ harmony: e.target.value as ToolbarState["harmony"] })
              }
            >
              <option value="complementary">complementary</option>
              <option value="analogous">analogous</option>
              <option value="triad">triad</option>
              <option value="monochrome">monochrome</option>
            </select>
          </label>
          <label>
            Preset
            <select
              value={state.preset}
              onChange={(e) =>
                update({ preset: e.target.value as ToolbarState["preset"] })
              }
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
              max={0.8}
              step={0.1}
              value={state.neutralTint}
              onChange={(e) => update({ neutralTint: Number(e.target.value) })}
            />
            <span>{state.neutralTint.toFixed(1)}</span>
          </label>
          <label>
            Depth max
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.025}
              value={state.depthMax}
              onChange={(e) => update({ depthMax: Number(e.target.value) })}
            />
            <span>{state.depthMax.toFixed(3)}</span>
          </label>
          <label>
            Depth decay
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={state.depthDecay}
              onChange={(e) => update({ depthDecay: Number(e.target.value) })}
            />
            <span>{state.depthDecay.toFixed(2)}</span>
          </label>
          <label>
            Depth sign
            <input
              type="range"
              min={-1}
              max={1}
              step={0.1}
              value={state.depthSign}
              onChange={(e) => update({ depthSign: Number(e.target.value) })}
            />
            <span>{state.depthSign.toFixed(1)}</span>
          </label>
          <label>
            Density
            <input
              type="range"
              min={0.7}
              max={1.75}
              step={0.1}
              data-ticks
              style={{ "--range-steps": 10 } as CSSProperties}
              value={state.density}
              onChange={(e) => update({ density: Number(e.target.value) })}
            />
            <span>{state.density.toFixed(1)}</span>
          </label>
          <label>
            Contrast threshold
            <input
              type="range"
              min={0.3}
              max={0.8}
              step={0.05}
              data-ticks
              style={{ "--range-steps": 10 } as CSSProperties}
              value={state.contrastThreshold}
              onChange={(e) =>
                update({ contrastThreshold: Number(e.target.value) })
              }
            />
            <span>{state.contrastThreshold.toFixed(2)}</span>
          </label>
          <label>
            Scheme chroma
            <input
              type="range"
              min={0.2}
              max={1}
              step={0.1}
              data-ticks
              style={{ "--range-steps": 8 } as CSSProperties}
              value={state.schemeChroma}
              onChange={(e) => update({ schemeChroma: Number(e.target.value) })}
            />
            <span>{state.schemeChroma.toFixed(2)}</span>
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
