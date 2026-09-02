import { luzHarmonyColorNames } from "../../../src/tools/hue";
import { useThemeState } from "../lib/theme-state";

const WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function BrandColors() {
  const [state, , ready] = useThemeState();

  if (!ready) return null;

  const names = ["primary", ...luzHarmonyColorNames(state.harmony)];

  return (
    <div className="hue components-toolbar-brand">
      {names.map((name) => (
        <div className="swatch-row" key={name}>
          <div
            className="swatch-row-label"
            style={{ color: `var(--${name}-500)` }}
          >
            {name}
          </div>
          {WEIGHTS.map((weight, idx) => (
            <div className="swatch-list" key={idx}>
              <div
                key={weight}
                className="swatch"
                style={{backgroundColor: `var(--${name}-${weight})`, color: `contrast-color(var(--${name}-${weight}))`}}
              >
                {weight}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
