import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import type { LuzConfig } from "../luz";
import { luzVite } from "../vite";

export const luzAstro = (config: LuzConfig): AstroIntegration => ({
  name: "luz",
  hooks: {
    "astro:config:setup": ({ config: astroConfig, updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [
            luzVite(config, { root: fileURLToPath(astroConfig.srcDir) }),
          ],
        },
      });
    },
  },
});
