import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const indexEntrypoint = new URL("../dist/index.js", import.meta.url);
const reactEntrypoint = new URL("../dist/react/index.js", import.meta.url);
const distDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const indexExports = await import(
  `${indexEntrypoint.href}?verify=${Date.now()}`
);
const reactExports = await import(
  `${reactEntrypoint.href}?verify=${Date.now()}`
);

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

if (typeof indexExports.luz !== "function") {
  throw new TypeError("dist/index.js must export luz as a function");
}

if ("lui" in indexExports) {
  throw new TypeError("dist/index.js must not export lui — it was retired");
}

if (typeof reactExports.withComponentStyle !== "function") {
  throw new TypeError(
    "dist/react/index.js must export withComponentStyle as a function",
  );
}

const productionRuntime = Bun.spawnSync({
  cmd: ["node", "tests/fixtures/production-runtime.mjs"],
  cwd: repoRoot,
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
    cwd: repoRoot,
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

/**
 * Asserts `needle` appears in `css`, with a helpful failure message that
 * includes which fixture/build produced it.
 */
function assertCssContains(css: string, needle: string, context: string): void {
  if (!css.includes(needle)) {
    throw new Error(
      `${context}: expected emitted CSS to contain ${JSON.stringify(needle)}`,
    );
  }
}

/**
 * Asserts `needle` does NOT appear in `css` — used to confirm the utility
 * engine's closed vocabulary actually drops an unresolvable candidate
 * (`bg-card`, a shadcn bridge variable name, isn't a luz color token) rather
 * than silently emitting garbage.
 */
function assertCssExcludes(css: string, needle: string, context: string): void {
  if (css.includes(needle)) {
    throw new Error(
      `${context}: expected emitted CSS NOT to contain ${JSON.stringify(needle)}`,
    );
  }
}

// --- Astro consumer fixture: end-to-end luzAstro() coverage -----------------
// Builds a minimal Astro project registering `luzAstro(...)`, then asserts
// the emitted CSS contains resolved utility classes, a resolved variant, and
// the shadcn bridge aliases — proving scan -> resolve -> emit -> real file
// works through the actual Astro integration hooks, not just at the unit
// level. `--bun` forces the Bun runtime for the spawned `astro` CLI: its bin
// script's `#!/usr/bin/env node` shebang otherwise makes Bun re-exec it under
// real Node, where the utility scanner's `Bun.Glob` call is unavailable.
{
  const astroFixtureDir = join(repoRoot, "tests/fixtures/astro-consumer");
  const generatedCssPath = join(astroFixtureDir, "luz.generated.css");

  try {
    const astro = Bun.spawnSync({
      cmd: [
        "bun",
        "--bun",
        "x",
        "astro",
        "build",
        "--root",
        "tests/fixtures/astro-consumer",
      ],
      cwd: repoRoot,
      stdout: "inherit",
      stderr: "inherit",
    });

    if (!astro.success) {
      throw new Error(
        `Astro consumer build failed with exit code ${astro.exitCode}`,
      );
    }

    const css = await readFile(generatedCssPath, "utf8");
    const context = "Astro consumer fixture";

    assertCssContains(css, ".p-4 { padding: var(--size-4); }", context);
    assertCssContains(
      css,
      ".rounded { border-radius: var(--border-radius); }",
      context,
    );
    assertCssContains(
      css,
      ".open\\:bg-primary-600[data-open] { background-color: var(--primary-600, var(--primary)); }",
      context,
    );
    assertCssContains(css, "--card: var(--element-background);", context);
    assertCssContains(css, "--card-foreground: var(--foreground);", context);
    // `bg-card`/`text-card-foreground` are shadcn bridge variable names, not
    // luz color tokens — the closed-vocabulary utility engine must drop them.
    assertCssExcludes(css, ".bg-card {", context);
    assertCssExcludes(css, ".text-card-foreground {", context);
  } finally {
    await rm(join(astroFixtureDir, "dist"), { recursive: true, force: true });
    await rm(join(astroFixtureDir, ".astro"), { recursive: true, force: true });
    // Astro/Vite's own dep-optimization cache — written under
    // `node_modules/.vite` and `node_modules/.astro` inside this fixture's
    // root (already covered by the repo's blanket `node_modules` ignore,
    // cleaned here too just to keep repeat local runs tidy).
    await rm(join(astroFixtureDir, "node_modules"), {
      recursive: true,
      force: true,
    });
    await rm(generatedCssPath, { force: true });
  }
}

// --- Vite consumer fixture: end-to-end luzVite() coverage -------------------
// Same shape as the Astro fixture above, but for the Vite plugin.
{
  const viteFixtureDir = join(repoRoot, "tests/fixtures/vite-consumer");
  const generatedCssPath = join(viteFixtureDir, "luz.generated.css");

  try {
    const vite = Bun.spawnSync({
      cmd: [
        "bun",
        "--bun",
        "x",
        "vite",
        "build",
        "tests/fixtures/vite-consumer",
      ],
      cwd: repoRoot,
      stdout: "inherit",
      stderr: "inherit",
    });

    if (!vite.success) {
      throw new Error(
        `Vite consumer (luzVite) build failed with exit code ${vite.exitCode}`,
      );
    }

    const css = await readFile(generatedCssPath, "utf8");
    const context = "Vite consumer fixture";

    assertCssContains(css, ".p-4 { padding: var(--size-4); }", context);
    assertCssContains(
      css,
      ".rounded { border-radius: var(--border-radius); }",
      context,
    );
    assertCssContains(
      css,
      ".open\\:bg-primary-600[data-open] { background-color: var(--primary-600, var(--primary)); }",
      context,
    );
    assertCssContains(css, "--card: var(--element-background);", context);
    assertCssContains(css, "--card-foreground: var(--foreground);", context);
    assertCssExcludes(css, ".bg-card {", context);
    assertCssExcludes(css, ".text-card-foreground {", context);
  } finally {
    await rm(join(viteFixtureDir, "dist"), { recursive: true, force: true });
    await rm(generatedCssPath, { force: true });
  }
}
