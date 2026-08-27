import type { Plugin } from "vite";
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

/** `LuzConfig` with `path` required — only the Vite plugin writes a file. */
export type LuzViteConfig = LuzConfig & {
  path: string;
  /**
   * How the composed CSS is delivered — `"file"` (default), `"split"`, or
   * `"virtual"`. See `LuzCssOutput` in `tools/write-css.ts` for what each
   * one does; in `"virtual"` mode `path` is still required (used only to
   * name the virtual module, via its basename) but nothing is written to
   * disk under it.
   */
  output?: LuzCssOutput;
};

/**
 * Vite plugin: generates the composed CSS (`style` + shadcn bridge +
 * scanned utility classes) and delivers it per `config.output` — written
 * to `config.path` for `"file"`/`"split"` (see `writeCss`), or exposed as
 * a Vite virtual module for `"virtual"` (see `virtualCssIds`).
 *
 * Generation is one-shot — on `buildStart` (before Vite resolves/transforms
 * modules, so a plain `import "./luz.css"` in app code sees the file) and
 * again on `configureServer` (mirrors Astro's `astro:server:start`). There's
 * no file watcher / incremental re-scan in v1, matching `luzAstro`.
 *
 * `"file"`/`"split"` output is always written unminified — `config.minify`
 * is dropped before calling `luz()` (see the destructure below) rather
 * than forwarded, so it has no effect through this plugin. `config.path`
 * is imported as a normal `.css` file (see README), so Vite's own CSS
 * pipeline already minifies it on build — minifying it again here just
 * duplicated that work. `"virtual"` output goes through that same Vite
 * CSS pipeline natively (see `LuzCssOutput`'s doc comment), which is the
 * whole point of that mode.
 */
export const luzVite = (config: LuzViteConfig): Plugin => {
  let root: string | undefined;
  let cached: CssSections | undefined;

  const mode: LuzCssOutput = config.output ?? "file";
  const { id: virtualId, resolvedId: resolvedVirtualId } = virtualCssIds(
    config.path,
  );

  const generate = (): CssSections => {
    // `path` is vite-only (see `LuzViteConfig`) — `luz()` takes plain
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
    // plugin delivers what `luz()` returns.
    const { path: _path, minify: _minify, output: _output, ...luzConfig } =
      config;
    const { style, tokens } = luz(luzConfig);
    const bridgeCss = shadcnBridgeCSS(tokens);
    const utilityCss = scanAndEmitUtilities({ root: root!, tokens });
    return { theme: style, bridge: bridgeCss, utilities: utilityCss };
  };

  const generateFile = () => {
    if (!config.path) {
      throw new Error("luzVite: `path` is required in config");
    }
    cached = generate();
    if (mode !== "virtual") {
      writeCss(config.path, cached, mode);
    }
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
    resolveId(id) {
      if (mode === "virtual" && id === virtualId) return resolvedVirtualId;
    },
    load(id) {
      if (mode === "virtual" && id === resolvedVirtualId) {
        // `cached` is always populated by this point — `resolveId`/`load`
        // only fire once Vite starts resolving/transforming modules, which
        // happens after `buildStart` (or `configureServer` in dev) already
        // ran `generateFile()`.
        //
        // `moduleType: "css"` is required, not cosmetic: without it, Vite's
        // CSS detection (`isCSSRequest`) only recognizes a module as CSS by
        // matching the id's extension against a fixed set of suffixes —
        // fine for the client build (our id ends in `.css`, so it matches),
        // but SSR/prerender module handling doesn't apply that same
        // extension check the same way, and treats a plain string `load()`
        // result as JS source to execute. Declaring the type explicitly
        // sidesteps that guesswork entirely and works in both.
        return { code: composeCss(cached!), moduleType: "css" };
      }
    },
  };
};
