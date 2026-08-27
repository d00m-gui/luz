import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { fileURLToPath } from "node:url";
import { luz, type LuzConfig } from "../luz";
import { shadcnBridgeCSS } from "../tools/shadcn-bridge";
import { scanAndEmitUtilities } from "../tools/utilities";
import {
  composeCss,
  type CssSections,
  type LuzCssOutput,
  virtualCssIds,
  writeCss,
} from "../tools/write-css";

/** `LuzConfig` with `path` optional — only the Astro adapter writes a file. */
export type LuzAstroConfig = LuzConfig & {
  /**
   * Where the composed CSS is written (or, for `output: "virtual"`, just
   * the basename used to name the virtual module — nothing is written to
   * disk in that mode). Defaults to `styles/luz.css` under the project's
   * `srcDir` (i.e. `src/styles/luz.css` for a default Astro layout) —
   * Astro's own conventional home for a hand-written global stylesheet —
   * when omitted.
   */
  path?: string;
  /**
   * How the composed CSS is delivered — `"file"` (default), `"split"`, or
   * `"virtual"`. See `LuzCssOutput` in `tools/write-css.ts` for what each
   * one does.
   */
  output?: LuzCssOutput;
};

/**
 * Astro integration: on both `astro:build:start` and `astro:server:start`,
 * strips `path` and calls `luz(luzConfig)`, composes reset + setup +
 * `:root{variables}` + shadcn bridge aliases + scanned utility classes, and
 * delivers the result per `config.output` — written to `config.path`
 * (defaulting to `src/styles/luz.css`, creating that directory if it
 * doesn't exist yet) for `"file"`/`"split"`, or exposed as a Vite virtual
 * module for `"virtual"` (registered as a raw Vite plugin via
 * `updateConfig` in `astro:config:setup`, since Astro runs on Vite and
 * integrations can inject Vite plugins directly — see `vite.plugins` in
 * Astro's own config docs).
 *
 * The default path (and the virtual module id, in `"virtual"` mode) can
 * only be resolved once `srcDir` is known, so — unlike `mode`, which
 * doesn't depend on anything Astro provides — `outputPath`/`virtualId`/
 * `resolvedVirtualId` are computed inside `astro:config:setup`, not at
 * `luzAstro(config)` call time.
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
 * `"virtual"` output sidesteps this class of timing bug entirely — a
 * virtual module is resolved on demand against Vite's module graph, not
 * written ahead of time, so there's no "does the file exist yet" question.
 *
 * `"file"`/`"split"` output is always written unminified — `config.minify`
 * is dropped before calling `luz()` (see the destructure below) rather
 * than forwarded, so it has no effect through this integration. Whole-file
 * minification is left to the consuming project's own build: `config.path`
 * is imported as a normal `.css` file (see README), so Astro's CSS
 * pipeline already minifies it on `astro build` — running a minifier here
 * just duplicated that work and pulled in `lightningcss` as a runtime
 * dependency for it. `"virtual"` output goes through that same Astro/Vite
 * CSS pipeline natively (see `LuzCssOutput`'s doc comment), which is the
 * whole point of that mode.
 */
export const luzAstro = (config: LuzAstroConfig): AstroIntegration => {
  let srcDir: URL | undefined;
  let outputPath: string | undefined;
  let virtualId: string | undefined;
  let resolvedVirtualId: string | undefined;
  let cached: CssSections | undefined;

  const mode: LuzCssOutput = config.output ?? "file";

  const generate = (logger: AstroIntegrationLogger): CssSections => {
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
    // `minify` is dropped too — file/split output is always written
    // unminified (see the doc comment above), so forwarding it to `luz()`
    // would just collapse whitespace in the `style` block while leaving
    // the rest untouched, a half-minified result that means nothing here.
    // `output` isn't a `luz()` field either — it only controls how *this*
    // integration delivers what `luz()` returns.
    const { path: _path, minify: _minify, output: _output, ...luzConfig } =
      config;
    const { style, tokens } = luz(luzConfig);
    const bridgeCss = shadcnBridgeCSS(tokens);
    const utilityCss = scanAndEmitUtilities({
      root: fileURLToPath(srcDir),
      tokens,
    });
    return { theme: style, bridge: bridgeCss, utilities: utilityCss };
  };

  const generateFile = (logger: AstroIntegrationLogger) => {
    cached = generate(logger);
    if (mode === "virtual") return;

    if (!outputPath) {
      logger.error(
        "luzAstro: no output path resolved — this shouldn't happen (astro:config:setup always sets one, defaulting to src/styles/luz.css)",
      );
      throw new Error("luzAstro: `path` could not be resolved");
    }
    writeCss(outputPath, cached, mode);
    logger.info(`Static CSS generated @ ${outputPath}`);
  };

  return {
    name: "luz",
    hooks: {
      "astro:config:setup": ({ config: astroConfig, updateConfig }): void => {
        srcDir = astroConfig.srcDir;
        outputPath =
          config.path ?? fileURLToPath(new URL("styles/luz.css", srcDir));
        ({ id: virtualId, resolvedId: resolvedVirtualId } =
          virtualCssIds(outputPath));

        if (mode !== "virtual") return;
        updateConfig({
          vite: {
            plugins: [
              {
                name: "luz-virtual-css",
                resolveId(id: string) {
                  if (id === virtualId) return resolvedVirtualId;
                },
                load(id: string) {
                  if (id === resolvedVirtualId) {
                    // `cached` is always populated by this point —
                    // resolveId/load only fire once Vite starts
                    // resolving/transforming modules, which happens after
                    // astro:build:start (or astro:server:start in dev)
                    // already ran generateFile().
                    //
                    // `moduleType: "css"` is required, not cosmetic — see
                    // the matching comment in `vite/index.ts`'s `load()`.
                    // Astro's own SSR/prerender step (used even for
                    // `output: "static"` — every page still renders through
                    // an SSR-like pass to produce its HTML) is exactly the
                    // case that needs it: without an explicit type, that
                    // pass ran the returned CSS text as JavaScript instead
                    // of routing it through Vite's CSS transform, throwing
                    // on the first bare identifier CSS produced (e.g.
                    // `family` from `font-family: ...`) — confirmed by
                    // reproducing it locally before adding this field.
                    return { code: composeCss(cached!), moduleType: "css" };
                  }
                },
              },
            ],
          },
        });
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
