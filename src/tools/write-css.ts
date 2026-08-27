import { writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

/** The three top-level pieces `luzAstro`/`luzVite` compose into one file. */
export interface CssSections {
  /** `luz()`'s own `style` — reset + `@property` rules + `:root { … }`. */
  theme: string;
  /** shadcn/ui token-alias `:root` block from `shadcnBridgeCSS`. */
  bridge: string;
  /** Scanned utility-class CSS from `scanAndEmitUtilities`. */
  utilities: string;
}

/**
 * Writes the composed CSS to `outputPath`.
 *
 * By default (`split: false`) this is one flat file — `theme` + `bridge` +
 * `utilities` concatenated, matching every version of luz before this
 * option existed.
 *
 * With `split: true`, each section is written to its own sibling file
 * (`<name>.theme.css`, `<name>.bridge.css`, `<name>.utilities.css` next to
 * `outputPath`) and `outputPath` itself becomes a small `@import`
 * aggregator instead of the full concatenated content. Each section is
 * then its own cacheable/inspectable file — useful once the combined
 * output gets large enough that "which section changed" or "how big is
 * just the utility-class output" are questions worth answering without
 * grepping one big file.
 */
export function writeCss(
  outputPath: string,
  sections: CssSections,
  split: boolean,
): void {
  if (!split) {
    writeFileSync(
      outputPath,
      `${sections.theme}\n${sections.bridge}\n${sections.utilities}`,
      { encoding: "utf-8" },
    );
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

  const aggregator = files
    .map(([name]) => `@import url("./${name}");`)
    .join("\n");
  writeFileSync(outputPath, `${aggregator}\n`, { encoding: "utf-8" });
}
