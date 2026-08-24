// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { config } from "./luz.config.mjs";
import { luzAstro } from "../src/astro/index.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), luzAstro(config)],
});
