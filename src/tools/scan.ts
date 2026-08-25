/**
 * File discovery + candidate extraction for the utility-class engine.
 * Pure `node:fs` (no `Bun.*` globals) and deliberately kept free of any
 * Astro/Vite import — both integrations (and a future `luz add` CLI) call
 * `scanCandidates` the same way. Runtime-agnostic on purpose: Astro's and
 * Vite's own dev servers frequently run under a re-spawned Node child
 * process (their CLI bins carry a `#!/usr/bin/env node` shebang) even when
 * the outer command was invoked via `bun run` — code reachable from
 * `astro:server:start`/`configureServer` cannot assume a `Bun` global is
 * present, only `node:fs`.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

/** Extensions scanned when the caller doesn't override them. */
export const DEFAULT_EXTENSIONS = ["astro", "tsx", "jsx", "ts"];

/** Directory names never descended into, wherever they appear in the tree. */
const EXCLUDED_DIRS = new Set(["node_modules", "dist", ".astro"]);

// Broad, delimiter-based candidate extraction — not a JSX/Astro parser.
// Matches any run of characters not containing whitespace or the
// quote/tag delimiters that would otherwise pull markup/string punctuation
// into a "class name". This mirrors how real JIT utility engines do a fast
// text scan instead of parsing an AST.
const CANDIDATE_RE = /[^\s"'`<>]+/g;

interface CacheEntry {
  mtimeMs: number;
  candidates: Set<string>;
}

/** In-memory cache keyed by absolute file path, invalidated by `mtimeMs` — repeated calls skip re-reading unchanged files. */
const fileCache = new Map<string, CacheEntry>();

/** Extracts the raw text-token candidates from one file's contents. */
function extractCandidates(text: string): Set<string> {
  const found = new Set<string>();
  for (const match of text.matchAll(CANDIDATE_RE)) {
    found.add(match[0]);
  }
  return found;
}

/** Recursively collects absolute paths of files under `dir` whose extension is in `extensionSet`, never descending into `EXCLUDED_DIRS`. */
function walk(dir: string, extensionSet: Set<string>, out: string[]): void {
  let entries: import("node:fs").Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // unreadable/missing directory, skip
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), extensionSet, out);
    } else if (entry.isFile() && extensionSet.has(extname(entry.name).slice(1))) {
      out.push(join(dir, entry.name));
    }
  }
}

/**
 * Scans `root` for files matching `extensions` (default
 * `.astro/.tsx/.jsx/.ts`), skipping `node_modules`/`dist`/`.astro`
 * directories, and returns the aggregated set of raw text candidates found
 * across all of them. Each file's candidates are cached in memory by
 * absolute path + `mtimeMs`, so a repeated call over an unchanged tree only
 * re-reads files that actually changed since the last scan.
 */
export function scanCandidates(
  root: string,
  extensions: string[] = DEFAULT_EXTENSIONS,
): Set<string> {
  const files: string[] = [];
  walk(root, new Set(extensions), files);
  const all = new Set<string>();

  for (const absolutePath of files) {
    let mtimeMs: number;
    try {
      mtimeMs = statSync(absolutePath).mtimeMs;
    } catch {
      continue; // file disappeared between the walk and the stat call
    }

    const cached = fileCache.get(absolutePath);
    let candidates: Set<string>;
    if (cached && cached.mtimeMs === mtimeMs) {
      candidates = cached.candidates;
    } else {
      candidates = extractCandidates(readFileSync(absolutePath, "utf8"));
      fileCache.set(absolutePath, { mtimeMs, candidates });
    }

    for (const candidate of candidates) all.add(candidate);
  }

  return all;
}
