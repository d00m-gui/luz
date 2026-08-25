import { describe, expect, test } from "bun:test";
import { transform } from "lightningcss";
import { luz } from "../src/luz";
import type { LuzTokens } from "../src/luz";
import { shadcnBridgeCSS } from "../src/tools/shadcn-bridge";

/** Builds a minimal LuzTokens fixture, mirroring the `tests/props.test.ts` pattern. */
function tokens(settings: LuzTokens["settings"]): LuzTokens {
  return {
    settings,
    colors: {},
    sizes: {},
    typography: {},
  };
}

/** All shadcn variable names the bridge must emit. */
const REQUIRED_ALIASES = [
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary-foreground",
  "secondary-foreground",
  "input",
  "radius",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "ring",
];

/** Extracts the raw value of one `--name: value;` declaration, or undefined. */
function value(css: string, name: string): string | undefined {
  return css.match(new RegExp(`--${name}: ([^;]+);`))?.[1];
}

describe("shadcnBridgeCSS()", () => {
  test("emits a single :root block", () => {
    const css = shadcnBridgeCSS(tokens({ name: "primary", neutrals: "neutral" }));
    expect(css.trim().startsWith(":root {")).toBe(true);
    expect(css.match(/:root\s*\{/g)).toHaveLength(1);
  });

  test("every required alias is present", () => {
    const css = shadcnBridgeCSS(tokens({ name: "primary", neutrals: "neutral" }));
    for (const alias of REQUIRED_ALIASES) {
      expect(value(css, alias)).toBeDefined();
    }
  });

  test("does not alias --border (luz already emits it under that name)", () => {
    const css = shadcnBridgeCSS(tokens({ name: "primary", neutrals: "neutral" }));
    expect(css).not.toContain("--border:");
  });

  describe("aliasing, no prefix", () => {
    const css = shadcnBridgeCSS(tokens({ name: "primary", neutrals: "neutral" }));

    test("card/popover point at element-background and foreground", () => {
      expect(value(css, "card")).toBe("var(--element-background)");
      expect(value(css, "card-foreground")).toBe("var(--foreground)");
      expect(value(css, "popover")).toBe("var(--element-background)");
      expect(value(css, "popover-foreground")).toBe("var(--foreground)");
    });

    test("primary/secondary foreground point at luz's on-{name} contrast tokens", () => {
      expect(value(css, "primary-foreground")).toBe("var(--on-primary)");
      expect(value(css, "secondary-foreground")).toBe("var(--on-secondary)");
    });

    test("input/radius point at luz's element border and border-radius tokens", () => {
      expect(value(css, "input")).toBe("var(--element-border-color)");
      expect(value(css, "radius")).toBe("var(--border-radius)");
    });

    test("muted/accent point at neutral shade steps", () => {
      expect(value(css, "muted")).toBe("var(--neutral-800)");
      expect(value(css, "muted-foreground")).toBe("var(--neutral-400)");
      expect(value(css, "accent")).toBe("var(--neutral-700)");
      expect(value(css, "accent-foreground")).toBe("var(--foreground)");
    });

    test("destructive points at the wheel's red hue, foreground computed via the on-{name} formula", () => {
      expect(value(css, "destructive")).toBe("var(--red)");
      expect(value(css, "destructive-foreground")).toBe(
        "oklch(from var(--red) 88% 0 h)",
      );
    });

    test("ring points at primary-500", () => {
      expect(value(css, "ring")).toBe("var(--primary-500)");
    });
  });

  describe("aliasing, with prefix + custom names", () => {
    const css = shadcnBridgeCSS(
      tokens({ name: "brand", prefix: "lz-", neutrals: "gray" }),
    );

    test("primary/secondary/neutral/wheel var references carry the resolved prefix", () => {
      expect(value(css, "primary-foreground")).toBe("var(--on-lz-brand)");
      expect(value(css, "secondary-foreground")).toBe("var(--on-lz-secondary)");
      expect(value(css, "muted")).toBe("var(--lz-gray-800)");
      expect(value(css, "accent")).toBe("var(--lz-gray-700)");
      expect(value(css, "destructive")).toBe("var(--lz-red)");
      expect(value(css, "destructive-foreground")).toBe(
        "oklch(from var(--lz-red) 88% 0 h)",
      );
      expect(value(css, "ring")).toBe("var(--lz-brand-500)");
    });

    test("unprefixed aliases (card/popover/foreground/input/radius) stay unprefixed", () => {
      // luz itself never prefixes `background`/`foreground`/`element-*`/
      // `border-radius` keys — see buildColors()/luzSizes() — so the
      // bridge must not invent a prefixed reference for them either.
      expect(value(css, "card")).toBe("var(--element-background)");
      expect(value(css, "input")).toBe("var(--element-border-color)");
      expect(value(css, "radius")).toBe("var(--border-radius)");
    });
  });

  test("resolves against a real luz() token set without dangling var() references", () => {
    const { tokens: realTokens } = luz({ primary: "#D44541", prefix: "lz-" });
    const css = shadcnBridgeCSS(realTokens);
    // Every var(--xxx) referenced by the bridge should exist as a real key
    // in either luz's colors or sizes bucket.
    const referenced = [...css.matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]);
    const known = new Set([
      ...Object.keys(realTokens.colors),
      ...Object.keys(realTokens.sizes),
    ]);
    for (const name of referenced) {
      expect(known.has(name as string)).toBe(true);
    }
  });

  test("output parses cleanly through lightningcss", () => {
    const { tokens: realTokens } = luz({ primary: "#D44541" });
    const css = shadcnBridgeCSS(realTokens);
    expect(() =>
      transform({
        filename: "shadcn-bridge.css",
        code: Buffer.from(css),
        minify: false,
      }),
    ).not.toThrow();
  });
});
