import { Fragment, type CSSProperties } from "react";
import { useThemeState } from "../lib/theme-state";

const WHEEL_STEP = 30;
const WHEEL_OFFSET = 25;
const WHEEL_CHROMA = 0.19;
const WHEEL_LIGHTNESS = 0.68;

const PRESETS = [
  "red",
  "copper",
  "orange",
  "yellow",
  "green",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "sky",
  "violet",
  "pink",
].map((name, i) => ({
  name,
  color: `oklch(${WHEEL_LIGHTNESS} ${WHEEL_CHROMA} ${i * WHEEL_STEP + WHEEL_OFFSET})`,
}));

export function ColorPicker() {
  const [state, update, ready] = useThemeState();

  if (!ready) return null;

  return (
    <div
      className="colorpicker"
      style={{ "--n": PRESETS.length } as CSSProperties}
    >
      <div className="colorpicker-bg" />
      {PRESETS.map(({ name, color }, i) => (
        <Fragment key={name}>
          <input
            type="radio"
            id={`cp-${name}`}
            name="luz-primary"
            className="colorpicker-input"
            checked={state.primary === color}
            onChange={() => update({ primary: color })}
          />
          <label
            htmlFor={`cp-${name}`}
            className="colorpicker-swatch"
            style={{ "--i": i, "--swatch": color } as CSSProperties}
          />
          <span className="colorpicker-ring" />
        </Fragment>
      ))}
    </div>
  );
}
