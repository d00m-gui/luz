import { luzHarmonyColorNames } from "../../../src/tools/hue";
import { useThemeState } from "../lib/theme-state";
import { Swatches } from "./Swatches";

export function BrandColors() {
  const [state, , ready] = useThemeState();

  if (!ready) return null;

  const names = ["primary", ...luzHarmonyColorNames(state.harmony)];

  return (
    <div className="hue components-toolbar-brand">
      <Swatches names={names} />
    </div>
  );
}
