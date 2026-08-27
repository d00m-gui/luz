import { mkdirSync, writeFileSync } from "node:fs";
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
 * How `luzAstro`/`luzVite` deliver the composed CSS to the consuming
 * project. Default `"file"`.
 *
 * - `"file"` — one flat file at `path`: `theme` + `bridge` + `utilities`
 *   concatenated, matching every version of luz before this option existed.
 * - `"split"` — each section written to its own sibling file next to
 *   `path` (`<name>.theme.css`, `<name>.bridge.css`,
 *   `<name>.utilities.css`), with `path` itself reduced to a small
 *   `@import` aggregator. Each section is then its own
 *   cacheable/inspectable file — useful once the combined output gets
 *   large enough that "which section changed" or "how big is just the
 *   utility-class output" are questions worth answering without grepping
 *   one big file.
 * - `"virtual"` — nothing is written to disk. The composed CSS is exposed
 *   as a Vite virtual module instead (see `virtualModuleId`) — `import
 *   "virtual:<basename of path>"` in place of `@import url("./luz.css")`.
 *   Because it's a real module in Vite's own graph rather than a static
 *   file referenced by URL, it goes through Vite's own CSS pipeline
 *   directly — autoprefixing/minification apply the same way they would
 *   to any other `.css` the project imports, with no extra minifier
 *   dependency on luz's side, and no "does the file exist on disk yet"
 *   timing to get right (see the `astro:build:start` doc comment in
 *   `astro/index.ts` for the file-mode version of that problem).
 */
export type LuzCssOutput = "file" | "split" | "virtual";

/** Flattens `sections` into the same single-string shape `"file"` writes. */
export function composeCss(sections: CssSections): string {
  return `${sections.theme}\n${sections.bridge}\n${sections.utilities}`;
}

/**
 * The `virtual:` module id a consumer imports in `"virtual"` output mode,
 * and its resolved form (`\0`-prefixed, the Rollup/Vite convention marking
 * a module id as virtual — not a real file path — so other plugins don't
 * try to resolve it on disk).
 */
export function virtualCssIds(path: string): {
  id: string;
  resolvedId: string;
} {
  const id = `virtual:${basename(path)}`;
  return { id, resolvedId: `\0${id}` };
}

/**
 * Writes the composed CSS to `outputPath` for `"file"`/`"split"` output.
 * Creates `outputPath`'s directory first (recursively) if it doesn't
 * exist yet — a fresh project's `src/styles/` (the default `path` in
 * `LuzAstroConfig`) usually doesn't, until something else creates it.
 */
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

  const aggregator = files
    .map(([name]) => `@import url("./${name}");`)
    .join("\n");
  writeFileSync(outputPath, `${aggregator}\n`, { encoding: "utf-8" });
}
