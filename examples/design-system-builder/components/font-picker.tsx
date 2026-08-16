import { useMemo, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { useDraggable } from "./use-draggable";

interface FontEntry {
  id: string;
  family: string;
  weights: number[];
  category: string;
  variable: boolean;
}

const FALLBACK: Record<string, string> = {
  "sans-serif": "sans-serif",
  serif: "serif",
  monospace: "monospace",
  display: "serif",
  handwriting: "cursive",
};

// Fetched once, shared by every FontPicker instance on the page.
let fontListPromise: Promise<FontEntry[]> | null = null;
function fetchFontList(): Promise<FontEntry[]> {
  fontListPromise ??= fetch("https://api.fontsource.org/v1/fonts")
    .then((res) => res.json())
    .catch(() => []);
  return fontListPromise;
}

// Dedupe injected <link> stylesheets across pickers/re-renders.
const loadedStylesheets = new Set<string>();
function loadFont(id: string, weight: number) {
  const href = `https://cdn.jsdelivr.net/npm/@fontsource/${id}@latest/${weight}.css`;
  if (loadedStylesheets.has(href)) return;
  loadedStylesheets.add(href);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * A font-family label that opens a searchable popover sourced from the
 * [Fontsource API](https://fontsource.org/docs/api/introduction) — self-hosted
 * font files via jsdelivr, not a Google Fonts `<link>`. Picking a font injects
 * its stylesheet on demand and writes `'Family', <generic fallback>` into config.
 */
export function FontPicker({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (fontFamily: string) => void;
  children: React.ReactNode;
}) {
  const [fonts, setFonts] = useState<FontEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const drag = useDraggable();

  function handleOpenChange(open: boolean) {
    if (open && fonts.length === 0 && !loading) {
      setLoading(true);
      fetchFontList().then((list) => {
        setFonts(list);
        setLoading(false);
      });
    }
  }

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? fonts.filter((f) => f.family.toLowerCase().includes(q)) : fonts;
    return pool.slice(0, 40);
  }, [fonts, query]);

  function pick(font: FontEntry) {
    loadFont(font.id, font.weights.includes(400) ? 400 : (font.weights[0] as number));
    if (font.weights.includes(700)) loadFont(font.id, 700);
    onChange(`'${font.family}', ${FALLBACK[font.category] ?? "sans-serif"}`);
  }

  return (
    <Popover.Root onOpenChange={handleOpenChange}>
      <Popover.Trigger
        className="picker-trigger"
        aria-label={label}
        render={<div />}
        nativeButton={false}
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="font-picker-popup" ref={drag.targetRef as never}>
            <Popover.Title className="picker-title" onPointerDown={drag.onPointerDown}>
              {label}
            </Popover.Title>
            <input
              type="text"
              autoFocus
              placeholder="Search fonts…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="font-picker-list">
              {loading && <p className="hint">Loading Fontsource catalog…</p>}
              {!loading && matches.length === 0 && (
                <p className="hint">No matches.</p>
              )}
              {matches.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  className="font-picker-item"
                  onClick={() => pick(font)}
                >
                  {font.family}
                  <small>{font.category}</small>
                </button>
              ))}
            </div>
            <p className="hint font-picker-current">{value}</p>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
