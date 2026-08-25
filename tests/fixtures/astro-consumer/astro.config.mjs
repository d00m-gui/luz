import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import { luzAstro } from "@d00m-gui/luz/astro";

// Absolute path so the emitted CSS always lands next to this config file,
// regardless of the cwd the `astro build` process is spawned with (verify-dist.ts
// spawns it from the repo root, not from this fixture directory). No
// subdirectory — `luzAstro` writes via a plain `writeFileSync`, which does
// not create missing parent directories.
const outputPath = fileURLToPath(
  new URL("./luz.generated.css", import.meta.url),
);

export default defineConfig({
  integrations: [luzAstro({ primary: "#007dea", path: outputPath })],
});
