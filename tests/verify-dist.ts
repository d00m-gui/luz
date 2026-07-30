import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const entrypoint = new URL("../dist/index.js", import.meta.url);
const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const exports = await import(`${entrypoint.href}?verify=${Date.now()}`);

async function listJavaScriptFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? listJavaScriptFiles(path)
        : Promise.resolve(path.endsWith(".js") ? [path] : []);
    }),
  );
  return files.flat();
}

for (const file of await listJavaScriptFiles(distDirectory)) {
  const source = await readFile(file, "utf8");
  if (source.includes("react/jsx-dev-runtime") || /\bjsxDEV\b/.test(source)) {
    throw new Error(`${file} contains the React development JSX runtime`);
  }
}

if (typeof exports.luz !== "function") {
  throw new TypeError("dist/index.js must export luz as a function");
}

if (typeof exports.lui !== "object" || exports.lui === null) {
  throw new TypeError("dist/index.js must export lui as an object");
}

const productionRuntime = Bun.spawnSync({
  cmd: ["node", "tests/fixtures/production-runtime.mjs"],
  cwd: fileURLToPath(new URL("..", import.meta.url)),
  env: { ...process.env, NODE_ENV: "production" },
  stdout: "inherit",
  stderr: "inherit",
});

if (!productionRuntime.success) {
  throw new Error(
    `Production React runtime check failed with exit code ${productionRuntime.exitCode}`,
  );
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
    throw new Error(
      `Vite consumer build failed with exit code ${vite.exitCode}`,
    );
  }
} finally {
  await rm(outDir, { recursive: true, force: true });
}
