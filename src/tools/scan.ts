import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

export const DEFAULT_EXTENSIONS = ["astro", "tsx", "jsx", "ts"];

const EXCLUDED_DIRS = new Set(["node_modules", "dist", ".astro"]);

const CANDIDATE_RE = /[^\s"'`<>]+/g;

interface CacheEntry {
  mtimeMs: number;
  candidates: Set<string>;
}

const fileCache = new Map<string, CacheEntry>();

function extractCandidates(text: string): Set<string> {
  const found = new Set<string>();
  for (const match of text.matchAll(CANDIDATE_RE)) {
    found.add(match[0]);
  }
  return found;
}

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
    } else if (
      entry.isFile() &&
      extensionSet.has(extname(entry.name).slice(1))
    ) {
      out.push(join(dir, entry.name));
    }
  }
}

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
