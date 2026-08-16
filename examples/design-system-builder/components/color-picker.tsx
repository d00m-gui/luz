import { Popover } from "@base-ui/react/popover";
import { useDraggable } from "./use-draggable";

/** hex "#rrggbb" → {h,s,l} (0-360, 0-100, 0-100). Returns null for non-hex values (e.g. `oklch(...)`). */
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const int = parseInt(match[1] as string, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) =>
    lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (n: number) =>
    Math.round(f(n) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

/**
 * A color swatch that opens a small HSL-slider popover on click — built on
 * `@base-ui/react`'s `Popover` (headless) with plain range inputs, so the
 * sliders pick up luz's own `input[type="range"]` styling for free instead
 * of pulling in a picker library.
 */
export function ColorPicker({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  children: React.ReactNode;
}) {
  const hsl = hexToHsl(value) ?? { h: 0, s: 0, l: 50 };
  const drag = useDraggable();

  function set(patch: Partial<typeof hsl>) {
    const next = { ...hsl, ...patch };
    onChange(hslToHex(next.h, next.s, next.l));
  }

  return (
    <Popover.Root>
      {/* render as a <div>, not the default <button>: a `display:contents`
          trigger (or one wrapping block content like a swatch card) reports
          a zero-size rect, so the popup anchored at the wrong spot */}
      <Popover.Trigger
        className="picker-trigger"
        aria-label={label}
        render={<div />}
        nativeButton={false}
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup
            className="color-picker-popup"
            ref={drag.targetRef as never}
          >
            <Popover.Title
              className="picker-title"
              onPointerDown={drag.onPointerDown}
            >
              {label}
            </Popover.Title>
            <div className="color-picker-preview" style={{ backgroundColor: value }} />
            <label>
              Hue
              <input
                type="range"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(event) => set({ h: Number(event.target.value) })}
              />
            </label>
            <label>
              Saturation
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(event) => set({ s: Number(event.target.value) })}
              />
            </label>
            <label>
              Lightness
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(event) => set({ l: Number(event.target.value) })}
              />
            </label>
            <input
              type="text"
              className="color-picker-hex"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
