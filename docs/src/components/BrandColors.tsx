import { useThemeState } from "../lib/theme-state";
import { Swatches } from "./Swatches";

const NAMES = ["primary", "secondary", "tertiary", "quaternary"];

export function BrandColors() {
  const [, , ready] = useThemeState();

  if (!ready) return null;

  return (
    <div className="hue components-toolbar-brand">
      <Swatches names={NAMES} />
    </div>
  );
}
