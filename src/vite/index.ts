import type { Plugin } from "vite";
import { writeFileSync } from "node:fs";
import { transform } from "lightningcss";
import { luz, type LuzConfig } from "../luz";
import { base } from "../tools/base";
import { shadcnBridgeCSS } from "../tools/shadcn-bridge";
import { scanAndEmitUtilities } from "../tools/utilities";

/** `LuzConfig` with `path` required — only the Vite plugin writes a file. */
export type LuzViteConfig = LuzConfig & { path: string };

/**
 * Vite plugin: generates the static CSS file (`style` + shadcn bridge +
 * base + scanned utility classes), minifies it with `lightningcss` when
 * `config.minify` is set, and writes it to `config.path`.
 *
 * Generation is one-shot — on `buildStart` (before Vite resolves/transforms
 * modules, so a plain `import "./luz.css"` in app code sees the file) and
 * again on `configureServer` (mirrors Astro's `astro:server:start`). There's
 * no file watcher / incremental re-scan in v1, matching `luzAstro`.
 *
 * `transform` is deliberately not used — there are no arbitrary values to
 * rewrite per-module, class names are emitted and consumed verbatim.
 */
export const luzVite = (config: LuzViteConfig): Plugin => {
  let root: string | undefined;

  const generateFile = () => {
    const { style, tokens } = luz(config);
    const bridgeCss = shadcnBridgeCSS(tokens);
    const utilityCss = scanAndEmitUtilities({ root: root!, tokens });
    const cssContent = `${style}\n${bridgeCss}\n${base(tokens)}\n${utilityCss}`;
    const outputPath = config.path;

    if (!outputPath) {
      throw new Error("luzVite: `path` is required in config");
    }

    const output = (config.minify ?? false)
      ? transform({
          filename: outputPath,
          code: Buffer.from(cssContent),
          minify: true,
        }).code.toString()
      : cssContent;

    writeFileSync(outputPath, output, {
      encoding: "utf-8",
    });
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
