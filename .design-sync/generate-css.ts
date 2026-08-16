// design-sync static-CSS generator — luz ships no static stylesheet by
// design (LuzReact injects `luz(config).style` into a <style> tag at
// runtime, and the Astro integration writes the same output to a file via
// its own build hook). This script calls the exact same functions the
// Astro integration calls (`luz()` + `base()`, see src/astro/index.ts) —
// no Astro build needed, no reimplementation — to produce a real cfg.cssEntry
// file for the design-sync converter. Default (no-arg) config: luz's own
// `defaultConfig` (primary #007dea, dark mode) — the library's out-of-the-box
// look, not any example app's theme.
import { mkdirSync, writeFileSync } from "node:fs";
import { luz } from "../src/luz";
import { base } from "../src/tools/base";

const { style, tokens } = luz();
const css = `${style}\n${base(tokens)}`;

const outDir = new URL("../.ds-sync/generated/", import.meta.url);
mkdirSync(outDir, { recursive: true });
writeFileSync(new URL("luz.css", outDir), css, "utf-8");
console.log("wrote .ds-sync/generated/luz.css");
