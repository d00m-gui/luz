import { memo, useMemo, useRef, useState } from "react";
import { luz, type LuzConfig } from "../../src/luz";
import { LuzReact } from "../../src/react";
import { lui } from "../../src/components";
import logoUrl from "./luz-logo.svg";
import { PRESETS, type Preset } from "./presets";
import { ColorPicker } from "./components/color-picker";
import { FontPicker } from "./components/font-picker";
import { FloatingPanel } from "./components/floating-panel";
import { Editable } from "./components/editable";

/** Renders the logo tinted with `var(--foreground)` via a CSS mask, instead of the SVG's own colors. */
function Logo({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`logo-mark${className ? ` ${className}` : ""}`}
      style={{
        ...(size ? { width: size, height: size } : {}),
        maskImage: `url(${logoUrl})`,
        WebkitMaskImage: `url(${logoUrl})`,
      }}
    />
  );
}

/**
 * The magazine title, edited in place via `contentEditable`. Deliberately
 * uncontrolled and memoized with no reactive props besides the (referentially
 * stable) `onChange` setter: feeding React-rendered text back into a focused
 * contentEditable element resets the caret to the start on every keystroke
 * (typed text comes out reversed) — so this component never re-renders after
 * mount, and reports edits upward via a ref instead of `value`/`children`.
 */
const EditableTitle = memo(function EditableTitle({
  onChange,
}: {
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  return (
    <h1
      ref={ref}
      className="cover-title"
      contentEditable
      suppressContentEditableWarning
      onInput={() => onChange(ref.current?.textContent ?? "")}
      onBlur={() => {
        if (!ref.current?.textContent?.trim()) {
          if (ref.current) ref.current.textContent = "Untitled";
          onChange("Untitled");
        }
      }}
    >
      Untitled
    </h1>
  );
});

const initialConfig: LuzConfig = {
  primary: "#D44541",
  secondary: "#94F6D8",
  font: `"DM Sans", sans-serif`,
  "font-headings": `"DM Serif Display", serif`,
  "font-monospace": `"Datatype", monospace`,
  mode: "dark",
  neutrals: "neutral",
};

type FieldType = "text" | "number" | "color" | "select" | "switch";

interface FieldDef {
  key: keyof LuzConfig;
  label: string;
  type: FieldType;
  options?: string[];
  step?: number;
  min?: number;
  max?: number;
}

// Only fields with no natural inline home in the magazine layout — the rest
// (name, primary/secondary/background/foreground, fonts) are edited directly
// in the content via contentEditable, `ColorPicker`, and `FontPicker`.
const SECTIONS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Identity",
    fields: [
      { key: "prefix", label: "Variable prefix", type: "text" },
      { key: "neutrals", label: "Neutral name", type: "text" },
      { key: "colorSteps", label: "Shade steps", type: "number", min: 2, max: 11 },
    ],
  },
  {
    title: "Typography",
    fields: [
      { key: "font-weight", label: "Weight", type: "number", min: 100, max: 900, step: 100 },
      { key: "font-bold-weight", label: "Bold weight", type: "number", min: 100, max: 900, step: 100 },
      { key: "line-height", label: "Line height", type: "text" },
    ],
  },
  {
    title: "Sizing",
    fields: [
      { key: "base", label: "Base size (px)", type: "number", min: 10, max: 24 },
      { key: "power", label: "Fluid power", type: "number", step: 0.01, min: 1, max: 2 },
      { key: "spacing", label: "Spacing", type: "text" },
      { key: "sizeSteps", label: "Size steps", type: "number", min: 4, max: 22 },
      { key: "sizeDynamicFrom", label: "Dynamic from step", type: "number", min: 1, max: 22 },
      { key: "sizeRelativeToBase", label: "Scale by base", type: "switch" },
    ],
  },
  {
    title: "Behavior",
    fields: [
      { key: "transition", label: "Transition", type: "text" },
      { key: "box-shadow", label: "Box shadow", type: "text" },
      { key: "minify", label: "Minify output", type: "switch" },
    ],
  },
];

const WHEEL_HUES = [
  "red",
  "copper",
  "orange",
  "yellow",
  "green",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "sky",
];

/** Reads generated `--{name}-NN` shades from `colors`, in ascending weight order. */
function shadeRamp(
  colors: Record<string, string>,
  name: string,
): { weight: string; value: string }[] {
  const re = new RegExp(`^${name}-(\\d{2,3})$`);
  return Object.keys(colors)
    .map((key) => ({ key, match: key.match(re) }))
    .filter((entry): entry is { key: string; match: RegExpMatchArray } => !!entry.match)
    .map((entry) => ({
      weight: entry.match[1] as string,
      value: `var(--${entry.key})`,
    }))
    .sort((a, b) => Number(a.weight) - Number(b.weight));
}

/** hex → { hsl, rgb } display strings for the color spec card. Falls back to the raw value. */
function hexBreakdown(hex: string): { hex: string; rgb: string; hsl: string } | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const int = parseInt(match[1] as string, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rN) h = ((gN - bN) / d + (gN < bN ? 6 : 0)) * 60;
    else if (max === gN) h = ((bN - rN) / d + 2) * 60;
    else h = ((rN - gN) / d + 4) * 60;
  }
  return {
    hex: hex.toUpperCase(),
    rgb: `RGB ${r}, ${g}, ${b}`,
    hsl: `HSL ${h.toFixed(0)}, ${(s * 100).toFixed(0)}%, ${(l * 100).toFixed(0)}%`,
  };
}

interface ColorOverride {
  id: number;
  name: string;
  value: string;
}

export function App() {
  const [title, setTitle] = useState("Untitled");
  const [config, setConfig] = useState<LuzConfig>(initialConfig);
  const [overrides, setOverrides] = useState<ColorOverride[]>([]);
  const nextOverrideId = useRef(0);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const { tokens } = useMemo(() => luz(config), [config]);
  const { name, prefix = "", neutrals = "neutral" } = tokens.settings;
  const primaryName = `${prefix}${name}`;
  const secondaryName = `${prefix}secondary`;
  const neutralsName = `${prefix}${neutrals}`;
  const primarySpec = hexBreakdown(config.primary);

  function set<K extends keyof LuzConfig>(key: K, value: LuzConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function addOverride() {
    setOverrides((current) => [
      ...current,
      { id: nextOverrideId.current++, name: "", value: "" },
    ]);
  }

  function updateOverride(id: number, patch: Partial<ColorOverride>) {
    setOverrides((current) =>
      current.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    );
  }

  function removeOverride(id: number) {
    setOverrides((current) => current.filter((o) => o.id !== id));
  }

  function applyPreset(preset: Preset) {
    setActivePreset(preset.name);
    setConfig((current) => ({
      ...current,
      primary: preset.primary,
      secondary: preset.secondary,
      mode: preset.mode,
      background: preset.background,
      foreground: preset.foreground,
    }));
    setOverrides(
      Object.entries(preset.overrides).map(([name, value]) => ({
        id: nextOverrideId.current++,
        name,
        value,
      })),
    );
  }

  // Redefines any generated token by name — rendered after LuzReact's own
  // `:root` block, so plain CSS cascade order (not JS) makes it win.
  const overrideCSS = overrides
    .filter((o) => o.name.trim() && o.value.trim())
    .map((o) => `--${o.name.trim()}: ${o.value.trim()};`)
    .join("\n");

  return (
    <LuzReact config={config}>
      {overrideCSS && <style>{`:root { ${overrideCSS} }`}</style>}
      <datalist id="luz-color-tokens">
        {Object.keys(tokens.colors).map((key) => (
          <option key={key} value={key} />
        ))}
      </datalist>
      <FloatingPanel>
        <fieldset className="floating-section">
          <legend>Mode</legend>
          <div className="mode-pills">
            {(["light", "dark", "auto"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`mode-pill${config.mode === m ? " active" : ""}`}
                onClick={() => set("mode", m)}
              >
                {m}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="floating-section">
          <legend>Presets</legend>
          <div className="preset-grid">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className={`preset${activePreset === preset.name ? " active" : ""}`}
                onClick={() => applyPreset(preset)}
                title={preset.name}
              >
                <span className="preset-swatches">
                  <span style={{ backgroundColor: preset.background }} />
                  <span style={{ backgroundColor: preset.primary }} />
                  <span style={{ backgroundColor: preset.secondary }} />
                </span>
                {preset.name}
              </button>
            ))}
          </div>
        </fieldset>

        {SECTIONS.map((section) => (
            <fieldset className="floating-section" key={section.title}>
              <legend>{section.title}</legend>
              {section.fields.map((field) => (
                <Field
                  key={field.key}
                  field={field}
                  value={config[field.key]}
                  onChange={(value) => set(field.key, value as never)}
                />
              ))}
            </fieldset>
          ))}

          <fieldset className="floating-section overrides">
            <legend>Color overrides</legend>
            <datalist id="luz-color-tokens">
              {Object.keys(tokens.colors).map((key) => (
                <option key={key} value={key} />
              ))}
            </datalist>
            {overrides.length === 0 && (
              <p className="hint">
                Redefine any generated token (e.g. <code>red</code>,{" "}
                <code>on-primary</code>, <code>secondary-500</code>).
              </p>
            )}
            {overrides.map((o) => (
              <div className="override-row" key={o.id}>
                <input
                  type="text"
                  list="luz-color-tokens"
                  placeholder="token name"
                  value={o.name}
                  onChange={(event) =>
                    updateOverride(o.id, { name: event.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="value"
                  value={o.value}
                  onChange={(event) =>
                    updateOverride(o.id, { value: event.target.value })
                  }
                />
                <button
                  type="button"
                  className="ghost remove"
                  aria-label="Remove"
                  onClick={() => removeOverride(o.id)}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="ghost" onClick={addOverride}>
              + Add color
            </button>
          </fieldset>
      </FloatingPanel>

      <div className="builder">
        <main className="preview">
          {/* 00 — Cover */}
          <section className="doc-section cover">
            <div className="eyebrow">
              <span className="dot" />
              <Editable as="span" defaultText="Brand spectrum" />
            </div>
            <Logo className="cover-logo" />
            <EditableTitle onChange={setTitle} />
            <p className="cover-sub">
              Generated live from a single primary color with{" "}
              <a href="https://github.com/d00m-gui/luz" target="_blank" rel="noreferrer">
                luz
              </a>
              . Mode: <code>{config.mode}</code>
            </p>
          </section>

          {/* 01 — Colors */}
          <section className="doc-section">
            <SectionHeading index="01" title="Colors" badge="Core design system" />

            <div className="panel">
              <div className="panel-grid">
                <div className="panel-block">
                  <Editable as="h4" defaultText="Primary" />
                  <Editable
                    as="p"
                    className="hint"
                    defaultText="The color that represents the brand, used for primary actions and accents."
                  />
                  <div className="spec-row">
                    <ColorPicker
                      label="Primary"
                      value={config.primary}
                      onChange={(hex) => set("primary", hex)}
                    >
                      <div className="cube" style={{ backgroundColor: "var(--primary-500)" }} />
                    </ColorPicker>
                    {primarySpec && (
                      <dl className="spec">
                        <dt>{primarySpec.hex}</dt>
                        <dd>{primarySpec.hsl}</dd>
                        <dd>{primarySpec.rgb}</dd>
                      </dl>
                    )}
                  </div>
                </div>

                <div className="panel-block">
                  <Editable as="h4" defaultText="Text & background" />
                  <Editable
                    as="p"
                    className="hint"
                    defaultText="Grayscale that makes up the background and text color."
                  />
                  <div className="pair-row">
                    <div className="pair">
                      <ColorPicker
                        label="Background"
                        value={config.background ?? "#000000"}
                        onChange={(hex) => set("background", hex)}
                      >
                        <div className="cube" style={{ backgroundColor: "var(--background)" }} />
                      </ColorPicker>
                      <small>Background</small>
                    </div>
                    <div className="pair">
                      <ColorPicker
                        label="Foreground"
                        value={config.foreground ?? "#ffffff"}
                        onChange={(hex) => set("foreground", hex)}
                      >
                        <div className="cube" style={{ backgroundColor: "var(--foreground)" }} />
                      </ColorPicker>
                      <small>Foreground</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel-block">
                <Editable as="h4" defaultText="System" />
                <Editable
                  as="p"
                  className="hint"
                  defaultText="A rotated hue wheel, derived from the primary, used to communicate status and direction."
                />
                <div className="wheel">
                  {WHEEL_HUES.map((hue) => (
                    <div key={hue} className="pair">
                      <div
                        className="cube small"
                        style={{ backgroundColor: `var(--${prefix}${hue})` }}
                      />
                      <small>{hue}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-block">
                <Editable as="h4" defaultText="Shade ramps" />
                <ColorRamp label={name} name={primaryName} colors={tokens.colors} />
                <ColorRamp label="secondary" name={secondaryName} colors={tokens.colors} />
                <ColorRamp label={neutrals} name={neutralsName} colors={tokens.colors} />
              </div>
            </div>
          </section>

          {/* 02 — Typography */}
          <section className="doc-section">
            <SectionHeading index="02" title="Typography" badge="Color & type style" />

            <div className="panel type-panel">
              <div className="type-swatches">
                <ColorPicker label="Primary" value={config.primary} onChange={(hex) => set("primary", hex)}>
                  <SwatchCard label="Primary" varName="primary-500" value={config.primary} light />
                </ColorPicker>
                <ColorPicker
                  label="Foreground"
                  value={config.foreground ?? "#ffffff"}
                  onChange={(hex) => set("foreground", hex)}
                >
                  <SwatchCard label="Text colour" varName="foreground" value="var(--foreground)" />
                </ColorPicker>
                <ColorPicker
                  label="Background"
                  value={config.background ?? "#000000"}
                  onChange={(hex) => set("background", hex)}
                >
                  <SwatchCard label="Background" varName="background" value="var(--background)" />
                </ColorPicker>
                <ColorPicker
                  label="Secondary"
                  value={config.secondary ?? "#888888"}
                  onChange={(hex) => set("secondary", hex)}
                >
                  <SwatchCard
                    label="Secondary"
                    varName="secondary-500"
                    value={config.secondary ?? "auto"}
                    light
                  />
                </ColorPicker>
              </div>

              <div className="type-specimen">
                <Editable as="h4" defaultText="Font family" />
                <FontPicker
                  label="Body font"
                  value={tokens.typography.font ?? ""}
                  onChange={(f) => set("font", f)}
                >
                  <p className="hint font-trigger">{tokens.typography.font}</p>
                </FontPicker>
                <div className="alphabet" style={{ fontFamily: "var(--font)" }}>
                  Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                </div>
                <div className="alphabet" style={{ fontFamily: "var(--font)" }}>
                  Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                </div>
                <FontPicker
                  label="Headings font"
                  value={tokens.typography["font-headings"] ?? ""}
                  onChange={(f) => set("font-headings", f)}
                >
                  <div className="giant" style={{ fontFamily: "var(--font-headings)" }}>
                    Aa
                  </div>
                </FontPicker>
              </div>
            </div>

            <div className="panel type-article">
              <Editable as="h1" style={{ fontFamily: "var(--font-headings)" }} defaultText="Heading one" />
              <Editable as="h2" style={{ fontFamily: "var(--font-headings)" }} defaultText="Heading two" />
              <Editable as="h3" style={{ fontFamily: "var(--font-headings)" }} defaultText="Heading three" />
              <p>
                Body text set in <em>var(--font)</em>, the default reading
                face for this design system. <strong>Bold text</strong> uses
                the configured bold weight.
              </p>
              <FontPicker
                label="Emphasis font"
                value={tokens.typography["font-emphasis"] ?? ""}
                onChange={(f) => set("font-emphasis", f)}
              >
                <blockquote className="font-trigger">
                  An emphasis / quote style, set in{" "}
                  <cite>{tokens.typography["font-emphasis"]}</cite>.
                </blockquote>
              </FontPicker>
              <FontPicker
                label="Monospace font"
                value={tokens.typography["font-monospace"] ?? ""}
                onChange={(f) => set("font-monospace", f)}
              >
                <pre className="font-trigger">
                  <code>{tokens.typography["font-monospace"]}</code>
                </pre>
              </FontPicker>
            </div>
          </section>

          {/* 03 — Sizing */}
          <section className="doc-section">
            <SectionHeading index="03" title="Sizing" badge="Fluid scale" />
            <div className="panel">
              <div className="sizes">
                {Object.entries(tokens.sizes)
                  .filter(([key]) => key.startsWith("size-"))
                  .map(([key, value]) => (
                    <div className="size-row" key={key}>
                      <small>--{key}</small>
                      <div className="size-bar" style={{ width: `var(--${key})` }} />
                      <code>{value as string}</code>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* 04 — Applied UI */}
          <section className="doc-section">
            <SectionHeading index="04" title="Applied UI" badge="Product surface" />
            <DashboardMock name={title} />

            <div className="grid">
              <lui.card>
                <Editable as="h2" defaultText="buttons" />
                <div className="card-content buttons">
                  <button>
                    <Editable as="span" defaultText="Primary" />
                  </button>
                  <button className="ghost">
                    <Editable as="span" defaultText="Ghost" />
                  </button>
                  <button className="danger">
                    <Editable as="span" defaultText="Danger" />
                  </button>
                  <button className="cancel">
                    <Editable as="span" defaultText="Cancel" />
                  </button>
                </div>
              </lui.card>

              <lui.card>
                <Editable as="h2" defaultText="form" />
                <div className="card-content">
                  <lui.field.root className="field">
                    <lui.field.label>
                      <Editable as="span" defaultText="Label" />
                    </lui.field.label>
                    <lui.field.control placeholder="Placeholder…" />
                  </lui.field.root>
                  <label className="switch-row">
                    <input type="checkbox" role="switch" defaultChecked />
                    <Editable as="span" defaultText="Enabled" />
                  </label>
                </div>
              </lui.card>

              <lui.card>
                <Editable as="h2" defaultText="elements" />
                <div className="card-content">
                  <p>
                    <mark>Highlighted</mark> text, a <kbd>Kbd</kbd>, and{" "}
                    <a href="#0">a link</a>.
                  </p>
                  <progress value={60} max={100} />
                </div>
              </lui.card>
            </div>
          </section>
        </main>
      </div>
    </LuzReact>
  );
}

function SectionHeading({
  index,
  title,
  badge,
}: {
  index: string;
  title: string;
  badge: string;
}) {
  return (
    <div className="section-heading">
      <div className="index-title">
        <span className="index">{index}</span>
        <Editable as="h2" defaultText={title} />
      </div>
      <div className="badge">
        <span className="dot" />
        <Editable as="span" defaultText={badge} />
      </div>
    </div>
  );
}

function SwatchCard({
  label,
  varName,
  value,
  light,
}: {
  label: string;
  varName: string;
  value: string;
  light?: boolean;
}) {
  return (
    <div
      className={`swatch-card${light ? " light" : ""}`}
      style={{ backgroundColor: `var(--${varName})` }}
    >
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

function DashboardMock({ name }: { name: string }) {
  return (
    <div className="dashboard">
      <nav className="dashboard-rail">
        <Logo size={22} />
        <span className="rail-dot active" />
        <span className="rail-dot" />
        <span className="rail-dot" />
        <span className="rail-dot" />
      </nav>
      <div className="dashboard-body">
        <header className="dashboard-header">
          <div>
            <Editable as="h3" defaultText="Managing your team & workflows" />
            <p className="hint">{name} · workspace overview</p>
          </div>
          <button>
            <Editable as="span" defaultText="+ New scenario" />
          </button>
        </header>
        <div className="dashboard-stats">
          <div className="stat-card">
            <Editable as="small" defaultText="OPERATIONS" />
            <Editable as="strong" defaultText="780 / 1000" />
            <Editable as="span" className="up" defaultText="+12%" />
          </div>
          <div className="stat-card">
            <Editable as="small" defaultText="DATA TRANSFER" />
            <Editable as="strong" defaultText="163 MB" />
            <Editable as="span" defaultText="Stable" />
          </div>
          <div className="stat-card highlight">
            <Editable as="small" defaultText="AI FEATURES" />
            <Editable as="strong" defaultText="Automate faster" />
            <button className="ghost">
              <Editable as="span" defaultText="Upgrade →" />
            </button>
          </div>
        </div>
        <div className="dashboard-chart">
          {[40, 65, 30, 90, 55, 20, 45].map((h, i) => (
            <div className="chart-bar" key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorRamp({
  label,
  name,
  colors,
}: {
  label: string;
  name: string;
  colors: Record<string, string>;
}) {
  const shades = shadeRamp(colors, name);
  if (shades.length === 0) return null;
  return (
    <div className="ramp">
      <small>{label}</small>
      <div className="ramp-row">
        {shades.map((shade) => (
          <div
            key={shade.weight}
            className="swatch"
            style={{ backgroundColor: shade.value }}
            title={`${name}-${shade.weight}`}
          />
        ))}
      </div>
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: string | number | boolean | undefined) => void;
}) {
  if (field.type === "switch") {
    return (
      <label className="switch-row">
        <input
          type="checkbox"
          role="switch"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <lui.field.root className="field">
        <lui.field.label>{field.label}</lui.field.label>
        <select
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </lui.field.root>
    );
  }

  if (field.type === "color") {
    return (
      <lui.field.root className="field color-field">
        <lui.field.label>{field.label}</lui.field.label>
        <div className="color-input">
          <input
            type="color"
            value={/^#[0-9a-f]{6}$/i.test((value as string) ?? "") ? (value as string) : "#888888"}
            onChange={(event) => onChange(event.target.value)}
          />
          <lui.field.control
            placeholder={
              field.key === "secondary" ? "auto (primary hue + 180°)" : undefined
            }
            value={(value as string) ?? ""}
            onChange={(event) =>
              onChange(
                field.key === "secondary"
                  ? event.target.value || undefined
                  : event.target.value,
              )
            }
          />
        </div>
      </lui.field.root>
    );
  }

  return (
    <lui.field.root className="field">
      <lui.field.label>{field.label}</lui.field.label>
      <lui.field.control
        type={field.type}
        step={field.step}
        min={field.min}
        max={field.max}
        value={(value as string | number) ?? ""}
        onChange={(event) =>
          onChange(
            field.type === "number"
              ? Number(event.target.value)
              : event.target.value,
          )
        }
      />
    </lui.field.root>
  );
}

export default App;
