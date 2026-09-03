import { useEffect, useState } from "react";
import { supportsP3Display } from "../lib/gamut";

export function GamutLegend() {
  const [p3, setP3] = useState<boolean | null>(null);

  useEffect(() => {
    setP3(supportsP3Display());
  }, []);

  if (p3 === null) return null;

  return (
    <p className="gamut-legend">
      Tu pantalla {p3 ? "soporta" : "no soporta"} Display P3.{" "}
      <span className="gamut-legend-dot" /> marca shades fuera de sRGB.
    </p>
  );
}
