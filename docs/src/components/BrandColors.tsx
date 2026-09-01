import { luzHarmonyColorNames } from "../../../src/tools/hue";
import { useThemeState } from "../lib/theme-state";

const WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function swatchStyle(name: string, weight: number) {
  return { background: `var(--${name}-${weight})` };
}

export function BrandColors() {
  const [state, , ready] = useThemeState();

  if (!ready) return null;

  const names = ["primary", ...luzHarmonyColorNames(state.harmony)];

  return (
    <div className="hue components-toolbar-brand">
      <p className="components-toolbar-brand-title">Brand colors</p>
      {names.map((name) => (
        <div className="swatch-row" key={name}>
          <div className="swatch-row-label" style={{ color: `var(--${name}-500)` }}>
            {name}
          </div>
          <div className="swatch-list">
            {WEIGHTS.map((weight) => (
              <div
                key={weight}
                className="swatch"
                style={swatchStyle(name, weight)}
                data-tooltip={weight}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
