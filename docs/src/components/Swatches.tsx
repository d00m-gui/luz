export const SWATCH_WEIGHTS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function swatchStyle(name: string, weight: number) {
  return {
    backgroundColor: `var(--${name}-${weight})`,
    color: `contrast-color(var(--${name}-${weight}))`,
  };
}

export function Swatches({
  names,
  weights = SWATCH_WEIGHTS,
}: {
  names: string[];
  weights?: number[];
}) {
  return (
    <>
      {names.map((name) => (
        <div className="swatch-row" key={name}>
          <div className="swatch-row-label" style={{ color: `var(--${name}-500)` }}>
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
