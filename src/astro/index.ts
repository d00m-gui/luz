import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { fileURLToPath } from "node:url";
import { luz, type LuzConfig } from "../luz";
import { shadcnBridgeCSS } from "../tools/shadcn-bridge";
import { scanAndEmitUtilities } from "../tools/utilities";
import {
  composeCss,
  type CssSections,
  isVirtualCssLoad,
  type LuzCssOutput,
  resolveVirtualCssId,
  virtualCssIds,
  writeCss,
} from "../tools/write-css";

/** `LuzConfig` with `path` optional — only the Astro adapter writes a file. */
export type LuzAstroConfig = LuzConfig & {
  /** Where the composed CSS is written. Default `src/styles/luz.css` under `srcDir`. */
  path?: string;
  /** `"file"` (default), `"split"`, or `"virtual"` — see `LuzCssOutput`. */
  output?: LuzCssOutput;
};

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

    const { path: _path, output: _output, ...luzConfig } = config;
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
                  return resolveVirtualCssId(
                    id,
                    virtualId!,
                    resolvedVirtualId!,
                  );
                },
                load(id: string) {
                  if (isVirtualCssLoad(id, resolvedVirtualId!)) {
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
