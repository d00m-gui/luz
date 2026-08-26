// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import { luzAstro } from "../src/astro/index.ts";
import { config } from "./luz.config.ts";



// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    luzAstro({ ...config }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "DM Sans",
      cssVariable: "--dm-sans",
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.google(),
      name: "DM Mono",
      cssVariable: "--dm-mono",
      weights: [400, 500],
    },
  ],
});
