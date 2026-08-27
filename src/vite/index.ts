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

export type LuzViteConfig = LuzConfig & {
  path: string;
  output?: LuzCssOutput;
};

export const luzVite = (config: LuzViteConfig): Plugin => {
  let root: string | undefined;
  let cached: CssSections | undefined;

  const mode: LuzCssOutput = config.output ?? "file";
  const { id: virtualId, resolvedId: resolvedVirtualId } = virtualCssIds(
    config.path,
  );

  const generate = (): CssSections => {
    const { path: _path, output: _output, ...luzConfig } = config;
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
        return { code: composeCss(cached!), moduleType: "css" };
      }
    },
  };
};
