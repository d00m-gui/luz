import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const entrypoint = new URL("../dist/index.js", import.meta.url);
const exports = await import(`${entrypoint.href}?verify=${Date.now()}`);

if (typeof exports.luz !== "function") {
  throw new TypeError("dist/index.js must export luz as a function");
}

if (typeof exports.lui !== "object" || exports.lui === null) {
  throw new TypeError("dist/index.js must export lui as an object");
}

const outDir = await mkdtemp(join(tmpdir(), "luz-vite-consumer-"));

try {
  const vite = Bun.spawnSync({
    cmd: [
      "bun",
      "x",
      "vite",
      "build",
      "tests/fixtures/consumer",
      "--outDir",
      outDir,
      "--emptyOutDir",
    ],
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdout: "inherit",
    stderr: "inherit",
  });

  if (!vite.success) {
    throw new Error(`Vite consumer build failed with exit code ${vite.exitCode}`);
  }
} finally {
  await rm(outDir, { recursive: true, force: true });
}
