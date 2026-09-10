import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import { DashboardShell } from "../dashboard/shell";

export const Route = createFileRoute("/content")({ component: Notes });

type Section = { id: string; label: string; children?: readonly Section[] };

const SECTIONS: readonly Section[] = [
  { id: "whats-new", label: "What's new" },
  {
    id: "migration",
    label: "Migration",
    children: [
      { id: "migration-vite", label: "Vite" },
      { id: "migration-astro", label: "Astro" },
    ],
  },
  { id: "breaking", label: "Breaking changes" },
  { id: "fixed", label: "Fixed" },
  { id: "credits", label: "Credits" },
];

const HEADING_IDS = SECTIONS.flatMap((s) => [
  s.id,
  ...(s.children ?? []).map((c) => c.id),
]);

const TAGS = ["release", "css", "vite", "astro"];

function useActiveHeading() {
  const [active, setActive] = useState(HEADING_IDS[0]);

  useEffect(() => {
    const headings = HEADING_IDS.map((id) =>
      document.getElementById(id),
    ).filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const top = headings.find((h) => visible.has(h.id));
        if (top) setActive(top.id);
      },
      { rootMargin: "0px 0px -55% 0px" },
    );
    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, []);

  return active;
}

function TocList({
  items,
  active,
}: {
  items: readonly Section[];
  active: string;
}) {
  return (
    <div className="list">
      {items.map((item) => (
        <Fragment key={item.id}>
          <a
            href={`#${item.id}`}
            className="list-row"
            aria-current={active === item.id ? "page" : undefined}
          >
            <span className="list-col-grow">{item.label}</span>
          </a>
          {item.children ? (
            <TocList items={item.children} active={active} />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

function NotesAside({ active, editing }: { active: string; editing: boolean }) {
  return (
    <>
      <div className="card background-raised">
        <div className="card-meta">
          <strong>On this page</strong>
          <span className="space" />
          <span className="badge ghost pill">{SECTIONS.length}</span>
        </div>
        <nav aria-label="On this page">
          <TocList items={SECTIONS} active={active} />
        </nav>
      </div>
      <div className="card background-raised">
        <div className="card-meta">
          <strong>Meta</strong>
          <span className="space" />
          {editing ? (
            <span className="badge">editing</span>
          ) : (
            <span className="badge ghost">read only</span>
          )}
        </div>
        <dl className="card-content text-sm">
          <dt className="text-muted-foreground">Author</dt>
          <dd>Carlos</dd>
          <dt className="text-muted-foreground">Updated</dt>
          <dd>
            <code>2026-09-10</code>
          </dd>
          <dt className="text-muted-foreground">Version</dt>
          <dd>
            <code>0.2.0</code>
          </dd>
          <dt className="text-muted-foreground">Tags</dt>
          <dd className="flex flex-wrap gap-1">
            {TAGS.map((tag) => (
              <span key={tag} className="badge ghost">
                {tag}
              </span>
            ))}
          </dd>
        </dl>
      </div>
    </>
  );
}

function Notes() {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const active = useActiveHeading();

  async function share() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <DashboardShell
      title="Notes"
      description="Release notes for the luz build this dashboard runs on."
      actions={
        <>
          <button
            type="button"
            className="btn outline"
            onClick={() => setEditing((e) => !e)}
          >
            <span className="icon" aria-hidden="true">
              {editing ? "✓" : "✎"}
            </span>
            {editing ? "Done" : "Edit"}
          </button>
          <button type="button" className="btn ghost" onClick={share}>
            <span className="icon" aria-hidden="true">
              ↗
            </span>
            {copied ? "Copied" : "Share"}
          </button>
        </>
      }
      aside={<NotesAside active={active} editing={editing} />}
    >
      <section className="card background-raised">
        <div className="card-meta">
          <strong>release-notes.md</strong>
          <span className="space" />
          <span className="badge">v0.2.0</span>
        </div>
        <div className="card-content">
          <article
            className="prose"
            contentEditable={editing}
            suppressContentEditableWarning
            aria-label="Release notes"
          >
            <h1>luz 0.2 — one import, any Vite framework</h1>
            <p className="text-muted-foreground">
              <small>Published 2026-09-10 · @d00m-gui/luz@0.2.0</small>
            </p>
            <p>
              <strong>luz 0.2</strong> is the release where the build story gets
              boring, on purpose. You register <code>luzVite(config)</code>{" "}
              once, write a single <code>@import</code> in your own stylesheet,
              and the plugin expands the theme, the shadcn bridge and the
              utilities scanned from your source{" "}
              <em>right where the import sits</em> — nothing is written to disk.
              If you are upgrading from 0.1, jump straight to the{" "}
              <a className="success" href="#migration">
                upgrade guide
              </a>{" "}
              and skim the{" "}
              <a className="warning" href="#breaking">
                breaking changes
              </a>
              ; everything else is additive.
            </p>
            <blockquote>
              luz doesn't try to be a full Tailwind replacement, and it doesn't
              try to be a component library either.
              <cite>
                —{" "}
                <a
                  href="https://github.com/d00m-gui/luz#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  README
                </a>
              </cite>
            </blockquote>

            <h2 id="whats-new">What's new</h2>
            <ul>
              <li>
                <b>One import.</b>{" "}
                <mark>
                  @import "@d00m-gui/luz/luz.css" is now the only line you need
                </mark>{" "}
                — the plugin turns it into reset, components, theme, bridge and
                utilities, Tailwind v4 style.
              </li>
              <li>
                <b>Per-component CSS.</b>{" "}
                <code>components/&lt;name&gt;.css</code> ships one
                self-contained file per pattern (<code>button.css</code>,{" "}
                <code>card.css</code>, <code>tabs.css</code>…), so you can
                compose your own bundle instead of taking the everything bundle.
              </li>
              <li>
                <b>Directives.</b> <code>@luz theme;</code>,{" "}
                <code>@luz bridge;</code> and <code>@luz utilities;</code> can
                be placed anywhere in your CSS when you want lower-level control
                over where each block lands.
              </li>
              <li>
                <b>Layers honored.</b> <code>@import … layer(name)</code> keeps
                working through the expansion, so luz can sit under your own
                layers without <i>any</i> specificity games.
              </li>
              <li>
                <b>Generic variant parsing.</b> The utility engine understands
                Tailwind's <code>data-[attr=value]:</code> and{" "}
                <code>aria-[attr=value]:</code> syntax, so component source
                copied from Radix- or Base UI-based kits matches without luz
                knowing where it came from.
              </li>
            </ul>
            <p>
              The whole thing is still a closed vocabulary:{" "}
              <abbr title="Cascading Style Sheets">CSS</abbr> is emitted only
              for classes that actually appear in your source, with zero
              arbitrary values and zero runtime JavaScript. The{" "}
              <Link to="/" className="secondary">
                Overview
              </Link>{" "}
              page measures the result on every server run — for this dashboard
              it currently reports something like{" "}
              <samp>css 41.2 KB · gzip 7.8 KB · 0.412 ms</samp>.
            </p>

            <hr />

            <h2 id="migration">Migration</h2>
            <p>
              Both integrations share the same core; the only difference is
              where you register the plugin.
              <code>luz(config)</code> itself stays pure and runs anywhere —
              browser, edge, a script — if all you need are the tokens.
            </p>

            <h3 id="migration-vite">Vite</h3>
            <h4>One import</h4>
            <p>
              Replace whatever you were composing by hand with the everything
              bundle. Restart the dev server afterwards (<kbd>Ctrl</kbd> +{" "}
              <kbd>C</kbd>, then <code>bun run dev</code>) so the scanner picks
              up the new entry:
            </p>
            <pre>
              <code>{`/* app.css */\n@import "@d00m-gui/luz/luz.css";`}</code>
            </pre>
            <h4>À la carte</h4>
            <p>
              When you want less, pick pieces. <code>reset.css</code>,{" "}
              <code>components.css</code> and{" "}
              <code>components/&lt;name&gt;.css</code> are static files;{" "}
              <code>theme.css</code>, <code>bridge.css</code> and{" "}
              <code>utilities.css</code> are generated from your config and
              code.
            </p>
            <pre>
              <code>{`@import "@d00m-gui/luz/reset.css";\n@import "@d00m-gui/luz/theme.css";\n@import "@d00m-gui/luz/components/button.css";\n@import "@d00m-gui/luz/components/card.css";\n@import "@d00m-gui/luz/utilities.css";`}</code>
            </pre>
            <h5>Cascade layers</h5>
            <p>
              Every import above accepts a <code>layer(name)</code> suffix and
              luz will keep the generated blocks inside that layer.
            </p>
            <h6>Layer order</h6>
            <p>
              Declare <code>@layer reset, components, theme, utilities;</code>{" "}
              before the imports so the order is fixed regardless of how the
              plugin expands them. <small>Recommended, not required.</small>
            </p>

            <h3 id="migration-astro">Astro</h3>
            <p>
              Swap <code>luzVite</code> for <code>luzAstro</code> in{" "}
              <code>astro.config.mjs</code>; it wraps the same Vite plugin and
              needs no extra configuration. The <code>@import</code> line in
              your stylesheet is identical. If you want to see the pieces
              working together in a real app, the{" "}
              <Link to="/layout" className="tertiary">
                Projects
              </Link>{" "}
              page is built entirely from <code>components/</code> classes.
            </p>
            <dl>
              <dt>
                <code>@luz theme;</code>
              </dt>
              <dd className="text-muted-foreground">
                Custom properties under <code>:root</code>, derived from{" "}
                <code>primary</code>.
              </dd>
              <dt>
                <code>@luz bridge;</code>
              </dt>
              <dd className="text-muted-foreground">
                The shadcn alias block (<code>--border</code>,{" "}
                <code>--muted-foreground</code>, <code>--ring</code>).
              </dd>
              <dt>
                <code>@luz utilities;</code>
              </dt>
              <dd className="text-muted-foreground">
                Only the utility classes found in your source.
              </dd>
            </dl>

            <hr />

            <h2 id="breaking">Breaking changes</h2>
            <ol>
              <li>
                <b>
                  <code>design/</code> is now <code>components/</code>.
                </b>{" "}
                Update any deep import:{" "}
                <code>@d00m-gui/luz/design/button.css</code> →{" "}
                <code>@d00m-gui/luz/components/button.css</code>.
              </li>
              <li>
                <b>Utilities are scan-only.</b> A class that never appears in
                your source is never emitted; anything built at runtime from
                string concatenation has to be spelled out somewhere the scanner
                can see.
              </li>
              <li>
                <b>No bracket values.</b> <code>p-[13px]</code>-style arbitrary
                values are ignored on purpose — use the numbered{" "}
                <code>space-N</code> scale or a token.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Something else broke?{" "}
              <a
                className="danger"
                href="https://github.com/d00m-gui/luz/issues"
                target="_blank"
                rel="noreferrer"
              >
                Open an issue
              </a>{" "}
              with the import line and the plugin version.
            </p>

            <h2 id="fixed">Fixed</h2>
            <ul>
              <li>
                <code>@import</code> with <code>layer(name)</code> no longer
                drops the layer when the plugin expands the bundle.
              </li>
              <li>
                <abbr title="Hot Module Replacement">HMR</abbr> re-scans
                utilities when a file that only changed class names is saved.
              </li>
              <li>
                Dark/light inversion keeps <code>mark</code> and{" "}
                <code>::selection</code> readable at both ends of the oklch
                ramp.
              </li>
            </ul>

            <hr className="dashed" />

            <h2 id="credits">Credits</h2>
            <p>
              Written and maintained by <strong>d00m-gui</strong>. Type scale,
              spacing scale and the utility engine follow Tailwind's
              nomenclature so existing muscle memory transfers; the palette is
              oklch throughout. Jump back to the{" "}
              <a className="contrast" href="#whats-new">
                top of the page
              </a>
              .
            </p>
            <address className="text-sm text-muted-foreground">
              Carlos · <a href="mailto:hola@d00m.gui">hola@d00m.gui</a> ·{" "}
              <a
                href="https://github.com/d00m-gui/luz"
                target="_blank"
                rel="noreferrer"
              >
                github.com/d00m-gui/luz
              </a>
            </address>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="icon" aria-hidden="true">
                ⎙
              </span>
              Print this page — menus, drawers and popovers are dropped and the
              scheme switches to light.
              <button
                type="button"
                className="btn ghost"
                onClick={() => window.print()}
              >
                Print
              </button>
            </p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
