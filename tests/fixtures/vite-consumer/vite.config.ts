import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { luzVite } from "@d00m-gui/luz/vite";

// Absolute path so the emitted CSS always lands next to this config file,
// regardless of the cwd the `vite build` process is spawned with
// (verify-dist.ts spawns it from the repo root, not from this directory).
const outputPath = fileURLToPath(
  new URL("./luz.generated.css", import.meta.url),
);

export default defineConfig({
  plugins: [luzVite({ primary: "#007dea", path: outputPath })],
  build: {
    // Keep this fixture's own bundle output out of the way of the CSS file
    // luzVite writes above.
    outDir: "dist",
  },
});
