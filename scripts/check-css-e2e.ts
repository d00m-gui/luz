import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer, build, type ViteDevServer } from "vite";
import { luzVite } from "../src/vite";

const root = await mkdtemp(join(tmpdir(), "luz-css-e2e-"));
const packageRoot = resolve(import.meta.dir, "..");
const chromium = process.env.CHROMIUM ?? "chromium";
let server: ViteDevServer | undefined;
try {
  await writeFile(
    join(root, "index.html"),
    `<link rel="stylesheet" href="/app.css">
<div class="card" id="included"></div>
<div class="card" data-luz-off id="boundary"><div class="card p-4" id="excluded"></div></div>
<div class="card p-4" id="portal"></div><div class="knob" id="controls"></div>
<script type="module">
const style = id => getComputedStyle(document.getElementById(id));
const check = (value, name) => { if (!value) throw Error(name); };
try {
check(style('included').display === 'flex', 'included component');
check(style('boundary').display === 'block', 'scope boundary');
check(style('excluded').display === 'block' && style('excluded').padding === '0px', 'excluded subtree');
check(style('portal').display === 'flex' && style('portal').padding === '16px', 'outside portal');
check(style('controls').display === 'block', 'excluded controls');
document.documentElement.className = 'card p-4';
check(getComputedStyle(document.documentElement).display === 'flex', 'root component');
check(getComputedStyle(document.documentElement).padding === '16px', 'root utility');
document.documentElement.setAttribute('data-luz-off', '');
check(style('included').display === 'block', 'root opt-out');
document.documentElement.removeAttribute('data-luz-off');
const manifest = await (await fetch('/manifest.css?direct')).text();
check(!manifest.includes('.knob') && !manifest.includes('.wizard'), 'filtered manifest');
check(manifest.includes('@layer custom'), 'import layer');
const explicit = await (await fetch('/explicit.css?direct')).text();
check(explicit.includes('.knob'), 'explicit import');
document.body.dataset.result = 'passed';
} catch (error) { document.body.dataset.result = 'failed: ' + error.message; }
</script>`,
  );
  await writeFile(
    join(root, "app.css"),
    '@import "@d00m-gui/luz/luz.css" layer(custom);',
  );
  await writeFile(
    join(root, "manifest.css"),
    '@import "@d00m-gui/luz/components.css" layer(custom);',
  );
  await writeFile(
    join(root, "explicit.css"),
    '@import "@d00m-gui/luz/components/controls.css";',
  );
  const config = {
    root,
    configFile: false as const,
    plugins: [luzVite({ exclude: ["controls", "wizard", "bridge"] })],
    resolve: { alias: { "@d00m-gui/luz": join(packageRoot, "dist") } },
    server: { host: "127.0.0.1", port: 0, fs: { allow: [root, packageRoot] } },
  };
  await build(config);
  server = await createServer(config);
  await server.listen();
  const url = server.resolvedUrls!.local[0]!;
  const profile = join(root, "chromium");
  await mkdir(profile);
  const browser = Bun.spawn(
    [
      chromium,
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      `--user-data-dir=${profile}`,
      "--virtual-time-budget=5000",
      "--dump-dom",
      url,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  const html = await new Response(browser.stdout).text();
  const errors = await new Response(browser.stderr).text();
  if ((await browser.exited) !== 0 || !html.includes('data-result="passed"'))
    throw Error(html + errors);
  console.log(
    "Vite: exclusions, explicit imports, layers, root classes and scope boundaries passed.",
  );
} finally {
  await server?.close();
  await rm(root, { recursive: true, force: true });
}
