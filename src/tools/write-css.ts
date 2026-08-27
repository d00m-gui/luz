import { mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { DESIGN, RESET, STRUCTURE } from "./reset-css.generated";

export interface CssSections {
  theme: string;
  bridge: string;
  utilities: string;
}

export type LuzCssOutput = "file" | "split" | "virtual";
export function composeCss(sections: CssSections): string {
  return `${sections.theme}\n${sections.bridge}\n${sections.utilities}`;
}

export function virtualCssIds(path: string): {
  id: string;
  resolvedId: string;
} {
  const id = `virtual:${basename(path)}`;
  return { id, resolvedId: `\0${id}` };
}

export function writeCss(
  outputPath: string,
  sections: CssSections,
  output: Extract<LuzCssOutput, "file" | "split">,
): void {
  mkdirSync(dirname(outputPath), { recursive: true });

  if (output === "file") {
    writeFileSync(outputPath, composeCss(sections), { encoding: "utf-8" });
    return;
  }

  const dir = dirname(outputPath);
  const ext = extname(outputPath) || ".css";
  const base = basename(outputPath, ext);
  const files: Array<[name: string, content: string]> = [
    [`${base}.theme${ext}`, sections.theme],
    [`${base}.bridge${ext}`, sections.bridge],
    [`${base}.utilities${ext}`, sections.utilities],
  ];

  for (const [name, content] of files) {
    writeFileSync(join(dir, name), content, { encoding: "utf-8" });
  }

  const staticLayers: Array<[name: string, content: string]> = [
    [`${base}.reset${ext}`, RESET],
    [`${base}.structure${ext}`, STRUCTURE],
    [`${base}.design${ext}`, DESIGN],
  ];
  for (const [name, content] of staticLayers) {
    writeFileSync(join(dir, name), content, { encoding: "utf-8" });
  }

  const aggregator = files
    .map(([name]) => `@import url("./${name}");`)
    .join("\n");
  writeFileSync(outputPath, `${aggregator}\n`, { encoding: "utf-8" });
}
