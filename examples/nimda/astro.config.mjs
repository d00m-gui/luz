// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import { luzAstro } from "../../src/astro";
import { config } from "./luz.config";

export default defineConfig({
  integrations: [luzAstro(config)],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Monaspace Neon",
      cssVariable: "--mona",
      weights: ["100 900"],
    },
  ],
});
