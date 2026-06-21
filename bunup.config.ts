import { defineConfig } from "bunup";
import { exports, unused } from "bunup/plugins";
import { luzPlugin } from "./src/bun";
import { config } from "./luz.config";

export default defineConfig({
  exports: true,
  plugins: [exports(), unused(), luzPlugin(config)],
  entry: [
    "src/index.ts",
    "src/react/index.ts",
    "src/bun/index.ts",
    "src/astro/index.ts",
    "src/style/sheet.ts",
  ],
  format: ["esm"],
  unused: true,
  minify: true,
});
