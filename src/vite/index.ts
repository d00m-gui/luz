import type { Plugin } from "vite";
import { luz, type LuzConfig } from "../luz";
import { shadcnBridgeCSS } from "../tools/shadcn-bridge";
import { scanAndEmitUtilities } from "../tools/utilities";
import { writeCss } from "../tools/write-css";

/** `LuzConfig` with `path` required — only the Vite plugin writes a file. */
export type LuzViteConfig = LuzConfig & {
  path: string;
  /**
   * Write `theme`/`bridge`/`utilities` as separate sibling files next to
   * `path`, with `path` itself reduced to an `@import` aggregator, instead
   * of one flat concatenated file. Default `false`. See `writeCss` in
   * `tools/write-css.ts` for the exact file names.
   */
  splitCss?: boolean;
};

/**
 * Vite plugin: generates the static CSS file (`style` + shadcn bridge +
 * scanned utility classes) and writes it to `config.path`.
 *
 * Generation is one-shot — on `buildStart` (before Vite resolves/transforms
 * modules, so a plain `import "./luz.css"` in app code sees the file) and
 * again on `configureServer` (mirrors Astro's `astro:server:start`). There's
 * no file watcher / incremental re-scan in v1, matching `luzAstro`.
 *
 * The file is always written unminified — `config.minify` is dropped
 * before calling `luz()` (see the destructure below) rather than forwarded,
 * so it has no effect through this plugin. `config.path` is imported as a
 * normal `.css` file (see README), so Vite's own CSS pipeline already
 * minifies it on build — minifying it again here just duplicated that work.
 */
export const luzVite = (config: LuzViteConfig): Plugin => {
  let root: string | undefined;

  const generateFile = () => {
    // `path` is vite-only (see `LuzViteConfig`) — `luz()` takes plain
    // `LuzConfig`. Structural typing lets the superset object through
    // silently (no excess-property error on a variable, only on a literal),
    // so without stripping it here it falls into `luz()`'s `...typography`
    // catch-all and gets serialized straight into the generated CSS as
    // `--path: <the absolute filesystem path>;` — a real path disclosure
    // into whatever consumes the stylesheet.
    //
    // `minify` is dropped too — this plugin always writes the composed
    // file unminified (see the doc comment above), so forwarding it to
    // `luz()` would just collapse whitespace in the `style` block while
    // leaving the rest of the file untouched, a half-minified result that
    // means nothing here now that whole-file minification isn't this
    // plugin's job. `splitCss` isn't a `luz()` field either — it only
    // controls how *this* plugin writes what `luz()` returns.
    const { path: _path, minify: _minify, splitCss, ...luzConfig } = config;
    const { style, tokens } = luz(luzConfig);
    const bridgeCss = shadcnBridgeCSS(tokens);
    const utilityCss = scanAndEmitUtilities({ root: root!, tokens });
    const outputPath = config.path;

    if (!outputPath) {
      throw new Error("luzVite: `path` is required in config");
    }

    writeCss(
      outputPath,
      { theme: style, bridge: bridgeCss, utilities: utilityCss },
      splitCss ?? false,
    );
  };

  return {
    name: "luz",
    configResolved(resolved) {
      root = resolved.root;
    },
    buildStart() {
      generateFile();
    },
    configureServer(_server) {
      generateFile();
    },
  };
};
