import { describe, expect, test } from "bun:test";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { scanCandidates } from "../src/tools/scan";

/** Creates a fresh temp directory for one test, auto-removed after. */
function withTempDir(run: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "luz-scan-"));
  try {
    run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("scanCandidates() — file discovery", () => {
  test("finds candidates across the default extensions (.astro/.tsx/.jsx/.ts)", () => {
    withTempDir((dir) => {
      writeFileSync(join(dir, "a.astro"), `<div class="p-4"></div>`);
      writeFileSync(join(dir, "b.tsx"), `<div className="bg-red" />`);
      writeFileSync(join(dir, "c.jsx"), `<div className="gap-4" />`);
      writeFileSync(join(dir, "d.ts"), `const x = "rounded";`);
      writeFileSync(join(dir, "e.css"), `.ignored-extension { color: red; }`);

      const candidates = scanCandidates(dir);
      expect(candidates.has("p-4")).toBe(true);
      expect(candidates.has("bg-red")).toBe(true);
      expect(candidates.has("gap-4")).toBe(true);
      expect(candidates.has("rounded")).toBe(true);
      expect(candidates.has("ignored-extension")).toBe(false);
    });
  });

  test("excludes node_modules, dist, and .astro directories anywhere in the tree", () => {
    withTempDir((dir) => {
      mkdirSync(join(dir, "node_modules"), { recursive: true });
      mkdirSync(join(dir, "dist"), { recursive: true });
      mkdirSync(join(dir, ".astro"), { recursive: true });
      mkdirSync(join(dir, "src"), { recursive: true });

      writeFileSync(
        join(dir, "node_modules", "vendor.tsx"),
        `<div className="vendor-only" />`,
      );
      writeFileSync(join(dir, "dist", "built.ts"), `const x = "dist-only";`);
      writeFileSync(join(dir, ".astro", "types.ts"), `const x = "astro-only";`);
      writeFileSync(join(dir, "src", "real.tsx"), `<div className="real-file" />`);

      const candidates = scanCandidates(dir);
      expect(candidates.has("real-file")).toBe(true);
      expect(candidates.has("vendor-only")).toBe(false);
      expect(candidates.has("dist-only")).toBe(false);
      expect(candidates.has("astro-only")).toBe(false);
    });
  });

  test("respects a custom extensions list", () => {
    withTempDir((dir) => {
      writeFileSync(join(dir, "a.mdx"), `class="mdx-only"`);
      writeFileSync(join(dir, "b.ts"), `const x = "ts-only";`);

      const mdxOnly = scanCandidates(dir, ["mdx"]);
      expect(mdxOnly.has("mdx-only")).toBe(true);
      expect(mdxOnly.has("ts-only")).toBe(false);
    });
  });

  test("aggregates candidates across every matched file", () => {
    withTempDir((dir) => {
      writeFileSync(join(dir, "one.ts"), `const a = "p-4";`);
      writeFileSync(join(dir, "two.ts"), `const b = "bg-red";`);

      const candidates = scanCandidates(dir);
      expect(candidates.has("p-4")).toBe(true);
      expect(candidates.has("bg-red")).toBe(true);
    });
  });
});

describe("scanCandidates() — candidate extraction", () => {
  test("splits on whitespace and strips quote/tag delimiters, not on other punctuation", () => {
    withTempDir((dir) => {
      writeFileSync(
        join(dir, "a.tsx"),
        `<div className="open:bg-primary-600 rounded-none">{'literal'}</div>`,
      );
      const candidates = scanCandidates(dir);
      expect(candidates.has("open:bg-primary-600")).toBe(true);
      expect(candidates.has("rounded-none")).toBe(true);
      // No stray quote/tag characters carried into a candidate.
      for (const c of candidates) {
        expect(c).not.toMatch(/["'`<>]/);
      }
    });
  });
});

describe("scanCandidates() — mtime cache", () => {
  test("an unchanged file is served from cache on a repeated scan", () => {
    withTempDir((dir) => {
      const file = join(dir, "cached.ts");
      writeFileSync(file, `const a = "p-4";`);
      // Pin the mtime to a whole-millisecond Date up front: statSync can
      // return sub-millisecond fractions the filesystem tracks natively,
      // which a `Date` (millisecond resolution) can't round-trip exactly
      // through utimesSync below — pinning first means both reads land on
      // the same already-integer value.
      const pinned = new Date(Date.now());
      utimesSync(file, pinned, pinned);
      const originalMtimeMs = statSync(file).mtimeMs;

      const first = scanCandidates(dir);
      expect(first.has("p-4")).toBe(true);

      // Rewrite the file on disk with different content but restore the
      // exact same pinned mtime — the cache must still serve the stale
      // (correct, since nothing "really" changed from its perspective)
      // candidate set rather than re-reading.
      writeFileSync(file, `const a = "bg-red";`);
      utimesSync(file, pinned, pinned);
      expect(statSync(file).mtimeMs).toBe(originalMtimeMs);

      const second = scanCandidates(dir);
      expect(second.has("p-4")).toBe(true);
      expect(second.has("bg-red")).toBe(false);
    });
  });

  test("a file with an updated mtime is re-read and its new candidates picked up", () => {
    withTempDir((dir) => {
      const file = join(dir, "updated.ts");
      writeFileSync(file, `const a = "p-4";`);
      scanCandidates(dir);

      // Bump mtime forward so the cache treats it as changed, regardless of
      // filesystem mtime-resolution granularity.
      const future = new Date(Date.now() + 60_000);
      writeFileSync(file, `const a = "bg-red";`);
      utimesSync(file, future, future);

      const second = scanCandidates(dir);
      expect(second.has("bg-red")).toBe(true);
      expect(second.has("p-4")).toBe(false);
    });
  });
});
