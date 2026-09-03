import { useEffect, type CSSProperties } from "react";
import { oklchGamut, parseOklch } from "../lib/gamut";

export const SWATCH_WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function markGamut(): void {
  for (const el of document.querySelectorAll<HTMLElement>(".swatch[data-name]")) {
    const parsed = parseOklch(getComputedStyle(el).getPropertyValue("--current-bg"));
    if (!parsed) continue;
    const { srgb, p3 } = oklchGamut(...parsed);
    if (!srgb) el.dataset.gamut = p3 ? "p3" : "wide";
    else delete el.dataset.gamut;
  }
}

function swatchStyle(name: string, weight: number): CSSProperties {
  return {
    backgroundColor: `var(--${name}-${weight})`,
    "--current-bg": `var(--${name}-${weight})`,
    color: "var(--current-color)",
  } as CSSProperties;
}

export function Swatches({
  names,
  weights = SWATCH_WEIGHTS,
}: {
  names: string[];
  weights?: number[];
}) {
  useEffect(markGamut, [names, weights]);

  return (
    <>
      {names.map((name) => (
        <div className="swatch-row" key={name}>
          <div
            className="swatch-row-label"
            style={{ background: `var(--${name}-500)`, "--current-bg": `var(--${name}-500)`, color: "var(--current-color)" } as CSSProperties}
          >
            {name}
          </div>
          {weights.map((weight) => (
            <div className="swatch-list" key={weight}>
              <div className="swatch" data-name={name} style={swatchStyle(name, weight)}>
                {weight}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
