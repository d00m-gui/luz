import { gzipSync } from "node:zlib";
import { createServerFn } from "@tanstack/react-start";
import { luz } from "@d00m-gui/luz";
import { config } from "../../luz.config";

const RUNS = 24;

export interface LuzStats {
  runs: Array<{ run: number; ms: number }>;
  sizes: Array<{ section: string; bytes: number }>;
  totals: {
    avgMs: number;
    minMs: number;
    cssBytes: number;
    gzipBytes: number;
    colorTokens: number;
    sizeTokens: number;
    hues: number;
  };
}

export const getLuzStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<LuzStats> => {
    const runs: LuzStats["runs"] = [];
    let result = luz(config);
    for (let run = 1; run <= RUNS; run++) {
      const start = performance.now();
      result = luz(config);
      runs.push({ run, ms: performance.now() - start });
    }

    const cssBytes = Buffer.byteLength(result.theme, "utf-8");
    const gzipBytes = gzipSync(result.theme).length;

    return {
      runs,
      sizes: [
        {
          section: "variables",
          bytes: Buffer.byteLength(result.variables, "utf-8"),
        },
        {
          section: "properties",
          bytes: Buffer.byteLength(result.properties, "utf-8"),
        },
      ],
      totals: {
        avgMs: runs.reduce((sum, r) => sum + r.ms, 0) / runs.length,
        minMs: Math.min(...runs.map((r) => r.ms)),
        cssBytes,
        gzipBytes,
        colorTokens: Object.keys(result.tokens.colors).length,
        sizeTokens: Object.keys(result.tokens.sizes).length,
        hues: 12,
      },
    };
  },
);
