import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { DashboardShell } from "../dashboard/shell";

export const Route = createFileRoute("/layout")({ component: Projects });

type Health = "on track" | "at risk" | "archived";

type Project = {
  id: string;
  name: string;
  scheme: "primary" | "secondary" | "tertiary" | "quaternary" | "neutral";
  health: Health;
  description: string;
  team: string[];
  progress: number;
};

const PROJECTS: readonly Project[] = [
  {
    id: "aurora",
    name: "Aurora",
    scheme: "primary",
    health: "on track",
    description: "Marketing site rebuild on the new token pipeline.",
    team: ["CS", "MR", "AL"],
    progress: 72,
  },
  {
    id: "atlas",
    name: "Atlas",
    scheme: "secondary",
    health: "on track",
    description: "Internal admin console; shell, tables and filters.",
    team: ["JP", "CS"],
    progress: 41,
  },
  {
    id: "beacon",
    name: "Beacon",
    scheme: "tertiary",
    health: "at risk",
    description: "Status page with live incident timeline.",
    team: ["MR", "AL", "TK", "JP"],
    progress: 18,
  },
  {
    id: "cinder",
    name: "Cinder",
    scheme: "quaternary",
    health: "on track",
    description: "Email templates rendered from the same config.",
    team: ["TK"],
    progress: 88,
  },
  {
    id: "quill",
    name: "Quill",
    scheme: "neutral",
    health: "archived",
    description: "Docs theme v1. Superseded by Aurora.",
    team: ["CS", "MR"],
    progress: 100,
  },
  {
    id: "harbor",
    name: "Harbor",
    scheme: "neutral",
    health: "archived",
    description: "Legacy customer portal, frozen since Q1.",
    team: ["JP"],
    progress: 100,
  },
];

type Filter = "all" | "active" | "archived";

const FILTERS: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
];

function matches(project: Project, filter: Filter) {
  if (filter === "all") return true;
  return filter === "archived"
    ? project.health === "archived"
    : project.health !== "archived";
}

type FileNode = {
  path: string;
  name: string;
  lang: string;
  content: string;
};

const FILES: readonly FileNode[] = [
  {
    path: "luz.config.ts",
    name: "luz.config.ts",
    lang: "ts",
    content: `import type { LuzConfig } from "@d00m-gui/luz";

export const config: LuzConfig = {
  primary: "#5b7cfa",
  harmony: "triad",
  mode: "dark",
  power: "major-third",
  font: '"DM Sans", system-ui, sans-serif',
  "font-headings": '"DM Sans", system-ui, sans-serif',
  "font-monospace": '"DM Mono", ui-monospace, monospace',
  "font-bold-weight": 600,
  density: 0.9,
  vars: {
    "border-width": "0.0625rem",
    "border-radius": "0.375rem",
  },
};`,
  },
  {
    path: "vite.config.ts",
    name: "vite.config.ts",
    lang: "ts",
    content: `import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { luzVite } from "@d00m-gui/luz/vite";
import { config as luzConfig } from "./luz.config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [nitro(), luzVite(luzConfig), tanstackStart(), viteReact()],
});`,
  },
  {
    path: "src/styles.css",
    name: "styles.css",
    lang: "css",
    content: `@import "@d00m-gui/luz/luz.css";

body {
  overflow: hidden;
}`,
  },
  {
    path: "src/routes/index.tsx",
    name: "index.tsx",
    lang: "tsx",
    content: `export const Route = createFileRoute("/")({
  component: Dashboard,
  loader: () => getLuzStats(),
});`,
  },
  {
    path: "src/routes/layout.tsx",
    name: "layout.tsx",
    lang: "tsx",
    content: `export const Route = createFileRoute("/layout")({ component: Projects });`,
  },
];

function FileRow({
  path,
  selected,
  onSelect,
}: {
  path: string;
  selected: string;
  onSelect: (path: string) => void;
}) {
  const node = FILES.find((f) => f.path === path)!;
  return (
    <a
      href="#files"
      className="list-row"
      aria-current={selected === path ? "page" : undefined}
      onClick={(event) => {
        event.preventDefault();
        onSelect(path);
      }}
    >
      <span className="icon" aria-hidden="true">
        ·
      </span>
      <span className="list-col-grow">{node.name}</span>
      <span className="badge ghost">{node.lang}</span>
    </a>
  );
}

function Folder({ name, children }: { name: string; children: ReactNode }) {
  return (
    <details className="list-row" open>
      <summary>
        <span className="icon" aria-hidden="true">
          ▸
        </span>
        <span className="list-col-grow">{name}</span>
      </summary>
      <div className="list">{children}</div>
    </details>
  );
}

function Files() {
  const [selected, setSelected] = useState("luz.config.ts");
  const current = FILES.find((f) => f.path === selected)!;
  const lines = current.content.split("\n").length;

  return (
    <section
      id="files"
      className="shell responsive app-files"
      aria-label="Files"
    >
      <div className="shell-pane fixed">
        <div className="panel-header top">
          <span className="panel-header-title">
            <strong>Files</strong>
          </span>
          <span className="badge ghost pill">{FILES.length}</span>
        </div>
        <div className="list filetree">
          <Folder name="src">
            <Folder name="routes">
              <FileRow
                path="src/routes/index.tsx"
                selected={selected}
                onSelect={setSelected}
              />
              <FileRow
                path="src/routes/layout.tsx"
                selected={selected}
                onSelect={setSelected}
              />
            </Folder>
            <FileRow
              path="src/styles.css"
              selected={selected}
              onSelect={setSelected}
            />
          </Folder>
          <FileRow
            path="luz.config.ts"
            selected={selected}
            onSelect={setSelected}
          />
          <FileRow
            path="vite.config.ts"
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </div>
      <div className="shell-pane">
        <div className="panel-header top">
          <span className="panel-header-title">
            <code>{current.path}</code>
          </span>
          <span className="badge ghost">{current.lang}</span>
          <button
            className="btn ghost icon panel-shrink"
            type="button"
            aria-label="Copy file contents"
            onClick={() => navigator.clipboard?.writeText(current.content)}
          >
            ⧉
          </button>
        </div>
        <div className="shell-body">
          <pre>
            <code>{current.content}</code>
          </pre>
        </div>
        <div className="panel-header bottom">
          <span className="panel-auto">
            {lines} lines · {current.content.length} bytes
          </span>
          <span className="panel-shrink">utf-8</span>
          <span className="panel-shrink">LF</span>
        </div>
      </div>
    </section>
  );
}

function Block({
  scheme,
  className,
  label,
}: {
  scheme: string;
  className?: string;
  label: string;
}) {
  return <div className={`soft ${scheme} ${className ?? ""}`}>{label}</div>;
}

function Composer() {
  const [split, setSplit] = useState(true);

  return (
    <section className="card app-composer" aria-label="Layout composer">
      <div className="card-meta">
        <strong>Layout composer</strong>
        <span className="space" />
        <button
          className={split ? "btn pill" : "btn ghost pill"}
          type="button"
          aria-pressed={split}
          onClick={() => setSplit(true)}
        >
          Split hero
        </button>
        <button
          className={split ? "btn ghost pill" : "btn pill"}
          type="button"
          aria-pressed={!split}
          onClick={() => setSplit(false)}
        >
          Stacked hero
        </button>
      </div>
      <div className="card-content">
        <div className="element column">
          <div className="element row wire">
            <Block scheme="primary" className="w-24" label="Logo" />
            <Block
              scheme="neutral"
              className="element auto"
              label="Navigation"
            />
            <Block scheme="primary" className="w-24" label="Sign in" />
          </div>
          <div className={split ? "element pair wire" : "element column wire"}>
            <Block scheme="secondary" label="Headline, subtitle, two buttons" />
            <Block scheme="secondary" label="Product screenshot" />
          </div>
          <div className="element row wire">
            <Block scheme="tertiary" className="element auto" label="Feature" />
            <Block scheme="tertiary" className="element auto" label="Feature" />
            <Block scheme="tertiary" className="element auto" label="Feature" />
          </div>
          <div className="element row wire">
            <Block
              scheme="quaternary"
              className="element auto"
              label="Testimonials"
            />
            <Block scheme="quaternary" className="w-24" label="CTA" />
          </div>
          <div className="element row wire">
            <Block scheme="neutral" className="element auto" label="Footer" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Every block is a <code>.element.wire</code> child: <code>.auto</code>{" "}
          fills, a <code>w-*</code> utility pins the width. Select any text on
          this page to see the theme's <mark>selection color</mark>.
        </p>
      </div>
    </section>
  );
}

const TEAM_VISIBLE = 3;

function ProjectCard({ project }: { project: Project }) {
  const extra = project.team.length - TEAM_VISIBLE;
  return (
    <div className="card background-raised">
      <div className={`card-cover ${project.scheme}`} aria-hidden="true" />
      <div className="card-meta">
        <span className={`status ${project.scheme}`} aria-hidden="true" />
        <strong>{project.name}</strong>
        <span className="space" />
        <span
          className={
            project.health === "archived"
              ? "badge ghost"
              : project.health === "at risk"
                ? "badge warning"
                : "badge success"
          }
        >
          {project.health}
        </span>
      </div>
      <div className="card-content">
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex items-center gap-1">
          <span className="avatar-group">
            {project.team.slice(0, TEAM_VISIBLE).map((initials) => (
              <span key={initials} className="avatar sm">
                {initials}
              </span>
            ))}
            {extra > 0 ? (
              <span className="avatar sm more">+{extra}</span>
            ) : null}
          </span>
          <span className="space" />
          <code className="text-sm">{project.progress}%</code>
        </div>
        <progress
          className="w-full"
          value={project.progress}
          max={100}
          aria-label={`${project.name} progress`}
        />
      </div>
    </div>
  );
}

function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = PROJECTS.filter((project) => matches(project, filter));
  const active = PROJECTS.filter((project) =>
    matches(project, "active"),
  ).length;

  return (
    <DashboardShell
      title="Projects"
      description={`${PROJECTS.length} projects, ${active} active.`}
      actions={
        <button className="btn" type="button">
          New project
        </button>
      }
    >
      <section
        className="hero compact fluid rounded"
        aria-label="Featured project"
      >
        <div className="hero-background" aria-hidden="true">
          <div className="background-conic-rainbow h-full" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="badge pill">Featured</span>
          <h2 className="hero-heading">Aurora</h2>
          <p className="hero-paragraph">
            Marketing site rebuild on the new token pipeline. One{" "}
            <code>@import</code>, one config, every surface themed from{" "}
            <code>primary</code>.
          </p>
          <div className="flex items-center gap-2">
            <button className="btn" type="button">
              Open project
            </button>
            <button className="btn ghost" type="button">
              View roadmap
            </button>
          </div>
        </div>
      </section>

      <section
        aria-label="All projects"
        className="flex flex-col gap-4 app-projects"
      >
        <nav aria-label="Project filters">
          <ul className="gap-2">
            {FILTERS.map((item) => {
              const current = item.id === filter;
              const count = PROJECTS.filter((project) =>
                matches(project, item.id),
              ).length;
              return (
                <li key={item.id}>
                  <button
                    className={
                      current ? "btn pill gap-2" : "btn ghost pill gap-2"
                    }
                    type="button"
                    aria-current={current ? "true" : undefined}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                    <span className="badge ghost">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="grid sm">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filter !== "archived" ? (
            <div className="card center flex-wrap justify-center">
              <button className="btn ghost flex-col gap-1" type="button">
                <span className="icon text-2xl" aria-hidden="true">
                  +
                </span>
                Create project
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <Files />

      <Composer />
    </DashboardShell>
  );
}
