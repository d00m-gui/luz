export function luzWheel(color: string, prefix?: string) {
  let initWheel: any = {
    sky: luzHue(color, 270),
    blue: luzHue(color, 240),
    cyan: luzHue(color, 210),
    teal: luzHue(color, 180),
    emerald: luzHue(color, 150),
    green: luzHue(color, 120),
    yellow: luzHue(color, 90),
    orange: luzHue(color, 60),
    copper: luzHue(color, 30),
    red: luzHue(color, 0),
  };
  let luzStep = {};
  Object.entries(initWheel).map(([key, value]) => {
    let keyp = prefix ? `${prefix}${key}` : key;
    let item = { [keyp]: value };
    luzStep = { ...item, ...luzStep };
  });

  return luzStep;
}

function luzHue(color: string, rotation: number): string {
  return `oklch(from ${color} l c ${rotation})`;
}
