import { DESIGN_CLASSES } from "./components.generated";

export interface ComponentDoc {
  id: string;
  title: string;
  category: "Overlays" | "Feedback" | "Navigation" | "Layout";
  /** Class names from `design.css` this entry demonstrates — checked against `DESIGN_CLASSES`. */
  covers: string[];
  /** Copyable source, also used as the live preview unless `preview` is set. */
  html: string;
  /** Docs-only override for the live preview (e.g. bounding a `position: fixed` component) — `html` stays the copyable source. */
  preview?: string;
}

export const COMPONENTS: ComponentDoc[] = [
  {
    id: "popover",
    title: "Popover",
    category: "Overlays",
    covers: ["popover"],
    html: `<button popovertarget="popover">Open popover</button>
<div id="popover" popover class="popover">
  <p>Popover content, dismisses on outside click or Esc.</p>
</div>`,
  },
  {
    id: "toast",
    title: "Toast",
    category: "Overlays",
    covers: ["toast"],
    html: `<button popovertarget="toast">Show toast</button>
<div id="toast" popover class="toast success">Saved successfully</div>

<button popovertarget="toast-danger">Show error toast</button>
<div id="toast-danger" popover class="toast danger">Something went wrong</div>`,
  },
  {
    id: "stat",
    title: "Stat",
    category: "Feedback",
    covers: ["stat", "stat-value", "stat-label", "stat-delta"],
    html: `<div class="stat">
  <span class="stat-label">Revenue</span>
  <span class="stat-value">$12.4k</span>
  <span class="stat-delta up">▲ 4.2%</span>
</div>`,
  },
  {
    id: "dot",
    title: "Dot",
    category: "Feedback",
    covers: ["dot"],
    html: `<span class="dot success" title="success"></span>
<span class="dot danger" title="danger"></span>
<span class="dot warning" title="warning"></span>
<span class="dot neutral" title="neutral"></span>`,
  },
  {
    id: "empty",
    title: "Empty state",
    category: "Feedback",
    covers: ["empty", "empty-title"],
    html: `<div class="empty">
  <span class="empty-title">No results</span>
  <span>Try adjusting your filters.</span>
</div>`,
  },
  {
    id: "segmented",
    title: "Segmented control",
    category: "Navigation",
    covers: ["segmented", "segmented-input", "segmented-item"],
    html: `<div class="segmented">
  <input class="segmented-input" type="radio" name="ks-segmented" id="ks-seg-day" checked />
  <label class="segmented-item" for="ks-seg-day">Day</label>
  <input class="segmented-input" type="radio" name="ks-segmented" id="ks-seg-week" />
  <label class="segmented-item" for="ks-seg-week">Week</label>
  <input class="segmented-input" type="radio" name="ks-segmented" id="ks-seg-month" />
  <label class="segmented-item" for="ks-seg-month">Month</label>
</div>`,
  },
  {
    id: "toggle",
    title: "Toggle",
    category: "Navigation",
    covers: ["toggle"],
    html: `<button class="toggle" aria-pressed="true">Bold</button>
<button class="toggle" aria-pressed="false">Italic</button>`,
  },
  {
    id: "pagination",
    title: "Pagination",
    category: "Navigation",
    covers: ["pagination", "pagination-item"],
    html: `<nav class="pagination">
  <a class="pagination-item" href="#">1</a>
  <a class="pagination-item" aria-current="page" href="#">2</a>
  <a class="pagination-item" href="#">3</a>
</nav>`,
  },
  {
    id: "stepper",
    title: "Stepper",
    category: "Navigation",
    covers: ["stepper", "stepper-step"],
    html: `<div class="stepper">
  <div class="stepper-step done">Account</div>
  <div class="stepper-step active">Details</div>
  <div class="stepper-step">Confirm</div>
</div>`,
  },
  {
    id: "tabbar-bottom",
    title: "Bottom tab bar",
    category: "Navigation",
    covers: ["tabbar-bottom", "tabbar-bottom-item"],
    html: `<nav class="tabbar-bottom">
  <a class="tabbar-bottom-item" aria-current="page" href="#">Home</a>
  <a class="tabbar-bottom-item" href="#">Search</a>
  <a class="tabbar-bottom-item" href="#">Profile</a>
</nav>`,
    preview: `<div class="preview-frame"><nav class="tabbar-bottom" style="position: absolute">
  <a class="tabbar-bottom-item" aria-current="page" href="#">Home</a>
  <a class="tabbar-bottom-item" href="#">Search</a>
  <a class="tabbar-bottom-item" href="#">Profile</a>
</nav></div>`,
  },
  {
    id: "panel-header",
    title: "Panel header",
    category: "Layout",
    covers: ["panel-header", "panel-header-title"],
    html: `<div class="panel-header">
  <span class="panel-header-title">Panel header</span>
  <button class="ghost">Action</button>
</div>`,
  },
  {
    id: "titlebar",
    title: "Titlebar",
    category: "Layout",
    covers: ["titlebar"],
    html: `<div class="titlebar">
  <span>Titlebar</span>
  <span class="dot success"></span>
</div>`,
    preview: `<div class="preview-frame"><div class="titlebar" style="position: absolute; inset-inline: 0">
  <span>Titlebar</span>
  <span class="dot success"></span>
</div></div>`,
  },
  {
    id: "statusbar",
    title: "Statusbar",
    category: "Layout",
    covers: ["statusbar"],
    html: `<div class="statusbar">
  <span>Ready</span>
  <span>v0.1.0</span>
</div>`,
    preview: `<div class="preview-frame"><div class="statusbar" style="position: absolute; inset-inline: 0">
  <span>Ready</span>
  <span>v0.1.0</span>
</div></div>`,
  },
  {
    id: "list",
    title: "List",
    category: "Layout",
    covers: ["list-item"],
    html: `<div class="list-item">Item one</div>
<div class="list-item">Item two</div>
<div class="list-item">Item three</div>`,
  },
];

const covered = new Set(COMPONENTS.flatMap((c) => c.covers));
export const UNCOVERED_CLASSES = DESIGN_CLASSES.filter((c) => !covered.has(c));
