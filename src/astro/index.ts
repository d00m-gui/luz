import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { luz, type LuzConfig } from "../luz";
import { shadcnBridgeCSS } from "../tools/shadcn-bridge";
import { scanAndEmitUtilities } from "../tools/utilities";

/** `LuzConfig` with `path` required — only the Astro adapter writes a file. */
export type LuzAstroConfig = LuzConfig & { path: string };

/**
 * Astro integration: on both `astro:build:start` and `astro:server:start`,
 * strips `path` and calls `luz(luzConfig)`, composes reset + setup +
 * `:root{variables}` + shadcn bridge aliases + scanned utility classes, and
 * writes the result to `config.path` (required — throws via the Astro
 * logger if it's missing).
 *
 * Deliberately `astro:build:start`, not `astro:build:done`: Astro/Vite
 * copies `publicDir` into `outDir` as part of the Vite build it runs
 * internally, which completes before `astro:build:done` fires — so on a
 * clean build (no `config.path` file left over from a previous run),
 * writing on `astro:build:done` means the file exists on disk *after*
 * `outDir` was already populated, and never makes it into that build's
 * output at all (confirmed empirically: a clean `rm -rf` of both `dist`
 * and `config.path` followed by one `astro build` shipped a `dist/`
 * missing the CSS entirely — a real regression on any CI that does clean
 * checkouts). `astro:build:start` fires before Astro even invokes Vite's
 * build, so the file is on disk well before the `publicDir` copy happens.
 *
 * The output is always written unminified — `config.minify` is dropped
 * before calling `luz()` (see the destructure below) rather than forwarded,
 * so it has no effect through this integration. Whole-file minification is
 * left to the consuming project's own build: `config.path` is imported as
 * a normal `.css` file (see README), so Astro's CSS pipeline already
 * minifies it on `astro build` — running a minifier here just duplicated
 * that work and pulled in `lightningcss` as a runtime dependency for it.
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
    //
    // `minify` is dropped too — this integration always writes the
    // composed file unminified (see the doc comment above), so forwarding
    // it to `luz()` would just collapse whitespace in the `style` block
    // while leaving the rest of the file untouched, a half-minified result
    // that means nothing here now that whole-file minification isn't this
    // integration's job.
    const { path: _path, minify: _minify, ...luzConfig } = config;
    const { style, tokens } = luz(luzConfig);
    const bridgeCss = shadcnBridgeCSS(tokens);
    const utilityCss = scanAndEmitUtilities({
      root: fileURLToPath(srcDir),
      tokens,
    });
    const cssContent = `${style}\n${bridgeCss}\n${utilityCss}`;
    const outputPath = config.path;
    if (!outputPath) {
      logger.error(
        "A path in config luz must be provided for the static generation",
      );
      throw new Error("luzAstro: `path` is required in config");
    }

    writeFileSync(outputPath, cssContent, {
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
      "astro:build:start": ({ logger }): void | Promise<void> => {
        generateFile(logger);
      },
      "astro:server:start": ({ logger }): void | Promise<void> => {
        generateFile(logger);
      },
    },
  };
};
