import { extname } from "node:path";
import { isCSSRequest, type Plugin } from "vite";
import { luz, type LuzConfig, type LuzTokens } from "../luz";
import { expandLuzCss, type LuzSection } from "../tools/css";
import { DEFAULT_EXTENSIONS, scanSources } from "../tools/scan";
import { shadcnBridgeCSS } from "../tools/shadcn-bridge";
import { emitUtilitiesCSS } from "../tools/utilities";

export interface LuzViteOptions {
  /** Directory scanned for utility candidates. Default Vite `root`. */
  root?: string;
}

interface Generated {
  theme: string;
  bridge: string;
  tokens: LuzTokens;
}

const RAW_QUERY_RE = /[?&]raw(?:[=&]|$)/;

export const luzVite = (
  config: LuzConfig,
  options?: LuzViteOptions,
): Plugin => {
  let root: string | undefined;
  let generated: Generated | undefined;
  const utilityModules = new Set<string>();

  const generate = (): Generated => {
    const { theme, tokens } = luz(config);
    return { theme, bridge: shadcnBridgeCSS(tokens), tokens };
  };

  return {
    name: "luz",
    enforce: "pre",
    configResolved(resolved) {
      root = options?.root ?? resolved.root;
    },
    buildStart() {
      generated = generate();
    },
    configureServer(server) {
      const onFileListChange = (file: string): void => {
        if (
          !file.startsWith(root!) ||
          !DEFAULT_EXTENSIONS.includes(extname(file).slice(1))
        )
          return;
        for (const id of utilityModules) {
          const mod = server.moduleGraph.getModuleById(id);
          if (mod) void server.reloadModule(mod);
        }
      };
      server.watcher.on("add", onFileListChange);
      server.watcher.on("unlink", onFileListChange);
    },
    transform(code, id) {
      if (!isCSSRequest(id) || RAW_QUERY_RE.test(id)) return undefined;
      if (!code.includes("@d00m-gui/luz/") && !code.includes("@luz "))
        return undefined;

      const { theme, bridge, tokens } = (generated ??= generate());
      let files: string[] = [];
      const provide = (section: LuzSection): string => {
        if (section === "theme") return theme;
        if (section === "bridge") return bridge;
        const scanned = scanSources(root!);
        files = scanned.files;
        return emitUtilitiesCSS(scanned.candidates, tokens);
      };

      const expanded = expandLuzCss(code, provide);
      if (expanded === undefined) return undefined;
      if (expanded.sections.has("utilities")) {
        utilityModules.add(id);
        for (const file of files) this.addWatchFile(file);
      }
      return { code: expanded.code, map: null };
    },
  };
};
