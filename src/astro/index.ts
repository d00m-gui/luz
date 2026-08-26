import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { transform } from "lightningcss";
import { luz, type LuzConfig } from "../luz";
import { base } from "../tools/base";
import { shadcnBridgeCSS } from "../tools/shadcn-bridge";
import { scanAndEmitUtilities } from "../tools/utilities";

/** `LuzConfig` with `path` required — only the Astro adapter writes a file. */
export type LuzAstroConfig = LuzConfig & { path: string };

/**
 * Minifies a fully composed CSS string via `lightningcss`. Unlike `luz.ts`'s
 * hand-rolled `minifyCss` (kept there because that file is also imported by
 * browser bundles, where `lightningcss`'s native binding doesn't belong),
 * this integration runs 100% in Node, so a real CSS-aware minifier is used
 * for its own final output instead.
 */
const minifyWithLightningCss = (css: string): string =>
  transform({
    filename: "luz.css",
    code: Buffer.from(css),
    minify: true,
  }).code.toString();

/**
 * Astro integration: on both `astro:build:done` and `astro:server:start`,
 * strips `path` and calls `luz(luzConfig)`, composes reset + setup +
 * `:root{variables}` + shadcn bridge aliases + base CSS + scanned utility
 * classes, minifies with `lightningcss`, and writes the result to
 * `config.path` (required — throws via the Astro logger if it's missing).
 */
export const luzAstro = (config: LuzAstroConfig): AstroIntegration => {
  let srcDir: URL | undefined;

  const generateFile = (logger: AstroIntegrationLogger) => {
    if (!srcDir) {
      logger.error(
        "luzAstro: `astro:config:setup` did not run before file generation — unable to determine the project's source root",
      );
      throw new Error(
        "luzAstro: source root is unavailable (`astro:config:setup` did not fire)",
      );
    }

    // `path` is astro-only (see `LuzAstroConfig`) — `luz()` takes plain
    // `LuzConfig`. Structural typing lets the superset object through
    // silently (no excess-property error on a variable, only on a literal),
    // so without stripping it here it falls into `luz()`'s `...typography`
    // catch-all and gets serialized straight into the generated CSS as
    // `--path: <the absolute filesystem path>;` — a real path disclosure
    // into whatever consumes the stylesheet.
    const { path: _path, ...luzConfig } = config;
    const { style, tokens } = luz(luzConfig);
    const bridgeCss = shadcnBridgeCSS(tokens);
    const utilityCss = scanAndEmitUtilities({
      root: fileURLToPath(srcDir),
      tokens,
    });
    const cssContent = `${style}\n${bridgeCss}\n${base(tokens)}\n${utilityCss}`;
    const outputPath = config.path;
    const isMinified = config.minify ?? false;
    if (!outputPath) {
      logger.error(
        "A path in config luz must be provided for the static generation",
      );
      throw new Error("luzAstro: `path` is required in config");
    }

    const output = isMinified ? minifyWithLightningCss(cssContent) : cssContent;
    writeFileSync(outputPath, output, {
      encoding: "utf-8",
    });
    logger.info(`Static CSS generated @ ${outputPath}`);
  };

  return {
    name: "luz",
    hooks: {
      "astro:config:setup": ({ config: astroConfig }): void => {
        srcDir = astroConfig.srcDir;
      },
      "astro:build:done": ({ logger }): void | Promise<void> => {
        generateFile(logger);
      },
      "astro:server:start": ({ logger }): void | Promise<void> => {
        generateFile(logger);
      },
    },
  };
};
