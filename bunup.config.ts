import { defineConfig } from "bunup";
import { exports, unused } from "bunup/plugins";

export default defineConfig({
  exports: true,
  plugins: [exports(), unused()],
  entry: [
    "src/index.ts",
    "src/react/index.ts",
    "src/astro/index.ts",
    "src/style/sheet.ts",
  ],
  format: ["esm"],
  unused: true,
  minify: true,
});
