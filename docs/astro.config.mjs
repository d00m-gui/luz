// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import { luzAstro } from "../src/astro/index.ts";
import { config } from "./luz.config.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://d00m-gui.github.io",
  base: "/luz",
  integrations: [react(), luzAstro({ ...config })],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "DM Sans",
      cssVariable: "--dm-sans",
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.fontsource(),
      name: "DM Mono",
      cssVariable: "--dm-mono",
      weights: [400, 500],
    },
    {
      provider: fontProviders.fontsource(),
      name: "EB Garamond",
      cssVariable: "--eb-serif",
      weights: [400, 500],
    },
  ],
  vite: {
    resolve: {
      alias: [
        {
          find: /^@d00m-gui\/luz\/(.+\.css)$/,
          replacement: fileURLToPath(
            new URL("../src/tools/$1", import.meta.url),
          ),
        },
      ],
    },
    server: {
      fs: {
        allow: [".."],
      },
    },
  },
});
