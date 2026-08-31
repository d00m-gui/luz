import { DESIGN_FILES } from "./components.generated";

/** Reset-only/structural tags with no meaningful standalone demo. */
const EXEMPT_ELEMENTS = [
  "html",
  "body",
  "svg",
  "canvas",
  "img",
  "picture",
  "video",
  "br",
  "section",
  "q",
  "address",
  "figure",
  "optgroup",
];

export interface ComponentDoc {
  id: string;
  title: string;
  category:
    | "Overlays"
    | "Feedback"
    | "Navigation"
    | "Layout"
    | "Primitives"
    | "Surfaces"
    | "Data"
    | "Identity";
  /** Class names or bare tag selectors from luz's CSS this entry demonstrates — checked against each `DESIGN_FILES` entry's `classes`/`elements`. */
  covers: string[];
  /** Copyable source, also used as the live preview unless `preview` is set. */
  html: string;
  /** Docs-only override for the live preview (e.g. bounding a `position: fixed` component) — `html` stays the copyable source. */
  preview?: string;
  /** Grid column span in the `/` component index — for previews wide enough that a single column cramps them. Default 1. */
  span?: 2 | 3;
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
    id: "tooltip",
    title: "Tooltip",
    category: "Overlays",
    covers: ["tooltip"],
    html: `<span data-tooltip="Top (default)">Hover me</span>
<span data-tooltip="Bottom" data-placement="bottom">Hover me</span>
<span data-tooltip="Left" data-placement="left">Hover me</span>
<span data-tooltip="Right" data-placement="right">Hover me</span>`,
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
    covers: ["pagination", "pagination-item", "nav"],
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
    span: 2,
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
  {
    id: "button",
    title: "Button",
    category: "Primitives",
    covers: ["btn", "button", "icon"],
    span: 2,
    html: `<button>Default</button>
<button class="neutral">Neutral</button>
<button class="success">Success</button>
<button class="contrast">Contrast</button>
<button class="danger">Danger</button>
<button class="warning">Warning</button>
<button class="ghost">Ghost</button>
<button class="pill">Pill</button>
<button disabled>Disabled</button>

<button class="square" aria-label="Add"><i class="icon nf nf-fa-plus"></i></button>
<button><i class="icon nf nf-fa-download"></i> Download</button>
<button class="loading">Saving</button>

<button class="block"><i class="icon nf nf-fa-github"></i> Continue with GitHub</button>`,
  },
  {
    id: "cta",
    title: "CTA button",
    category: "Primitives",
    covers: ["cta"],
    html: `<button class="cta">
  <span class="text-xs">Nuevo</span>
  <span class="text-lg">Empezar gratis</span>
  <span class="text-sm">Sin tarjeta de crédito</span>
</button>`,
  },
  {
    id: "badge",
    title: "Badge",
    category: "Data",
    covers: ["badge"],
    html: `<span class="badge">Default</span>
<span class="badge success">Success</span>
<span class="badge danger">Danger</span>
<span class="badge warning">Warning</span>
<span class="badge neutral">Neutral</span>
<span class="badge ghost">Ghost</span>
<span class="badge pill">Pill</span>`,
  },
  {
    id: "alert",
    title: "Alert",
    category: "Overlays",
    covers: ["alert"],
    html: `<div class="alert">Default alert</div>
<div class="alert success">Changes saved</div>
<div class="alert danger">Something went wrong</div>
<div class="alert warning">Check your input</div>
<div class="alert info">New version available</div>`,
  },
  {
    id: "card",
    title: "Card",
    category: "Surfaces",
    covers: ["card"],
    html: `<div class="card">
  <div class="card-title">Card title</div>
  <p>Card content goes here.</p>
  <div class="card-footer">Footer</div>
</div>`,
  },
  {
    id: "avatar",
    title: "Avatar",
    category: "Identity",
    covers: ["avatar"],
    html: `<span class="avatar sm">AB</span>
<span class="avatar">CD</span>
<span class="avatar lg">EF</span>`,
  },
  {
    id: "tabs",
    title: "Tabs",
    category: "Navigation",
    covers: ["tabs", "tab", "tab-input"],
    html: `<div class="tabs">
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-a" checked />
  <label class="tab" for="ks-tab-a">Overview</label>
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-b" />
  <label class="tab" for="ks-tab-b">Activity</label>
  <input class="tab-input" type="radio" name="ks-tabs" id="ks-tab-c" />
  <label class="tab" for="ks-tab-c">Settings</label>
</div>`,
  },
  {
    id: "accordion",
    title: "Accordion",
    category: "Data",
    covers: ["accordion"],
    html: `<details class="accordion" name="luz-accordion">
  <summary>What is luz?</summary>
  <p>A CSS theming library — colors, typography, and spacing from a single primary color.</p>
</details>
<details class="accordion" name="luz-accordion">
  <summary>Does it need a build step?</summary>
  <p>No — the output is plain CSS custom properties.</p>
</details>
<details class="accordion" name="luz-accordion">
  <summary>Is JS required?</summary>
  <p>No — exclusive open/close is native, via the shared <code>name</code> attribute on each <code>&lt;details&gt;</code>.</p>
</details>`,
  },
  {
    id: "modal",
    title: "Modal",
    category: "Overlays",
    covers: ["modal", "dialog"],
    html: `<button onclick="document.getElementById('modal-demo').showModal()">Open modal</button>
<dialog id="modal-demo" class="modal">
  <p>Modal content.</p>
  <button onclick="document.getElementById('modal-demo').close()">Close</button>
</dialog>`,
  },
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    category: "Navigation",
    covers: ["breadcrumbs"],
    html: `<nav class="breadcrumbs">
  <ol>
    <li><a href="#">luz</a></li>
    <li><a href="#">docs</a></li>
    <li>Componentes</li>
  </ol>
</nav>`,
  },
  {
    id: "skeleton",
    title: "Skeleton",
    category: "Feedback",
    covers: ["skeleton"],
    html: `<div class="skeleton" style="height: 1rem; width: 12rem;"></div>
<div class="skeleton" style="height: 1rem; width: 8rem; margin-top: 0.5rem;"></div>`,
  },
  {
    id: "loading",
    title: "Loading",
    category: "Feedback",
    covers: ["loading"],
    html: `<span class="loading"></span> Loading…
<span aria-busy="true"></span> Saving…`,
  },
  {
    id: "table",
    title: "Table",
    category: "Data",
    covers: ["table"],
    span: 2,
    html: `<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ada Lovelace</td>
      <td>Admin</td>
      <td><span class="dot success"></span> Active</td>
    </tr>
    <tr>
      <td>Grace Hopper</td>
      <td>Editor</td>
      <td><span class="dot warning"></span> Pending</td>
    </tr>
    <tr>
      <td>Alan Turing</td>
      <td>Viewer</td>
      <td><span class="dot neutral"></span> Invited</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    id: "native-list",
    title: "List",
    category: "Data",
    covers: ["ol", "ul", "dl"],
    html: `<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>
<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>
<dl>
  <dt>luz</dt>
  <dd>CSS theming library.</dd>
</dl>`,
  },
  {
    id: "link",
    title: "Link",
    category: "Primitives",
    covers: ["a"],
    html: `<p>
  <a href="#">Default</a> ·
  <a href="#" class="secondary">Secondary</a> ·
  <a href="#" class="contrast">Contrast</a> ·
  <a href="#" class="danger">Danger</a> ·
  <a href="#" class="success">Success</a> ·
  <a href="#" class="warning">Warning</a>
</p>`,
  },
  {
    id: "blockquote",
    title: "Blockquote",
    category: "Primitives",
    covers: ["blockquote"],
    html: `<blockquote>
  "The best config is the one you never have to touch twice."
  <cite>— luz</cite>
</blockquote>`,
  },
  {
    id: "kbd",
    title: "Kbd",
    category: "Primitives",
    covers: ["kbd"],
    html: `<p><kbd>Ctrl</kbd> + <kbd>K</kbd> opens the command palette.</p>`,
  },
  {
    id: "mark",
    title: "Mark",
    category: "Primitives",
    covers: ["mark"],
    html: `<p>Luz keeps <mark>the config always wins</mark> as its core rule.</p>`,
  },
  {
    id: "code",
    title: "Code",
    category: "Primitives",
    covers: ["code", "pre", "samp"],
    html: `<p>Install with <code>bun add luz</code>, then call <code>luz(config)</code>.</p>
<pre><code>luz({ primary: "#f28c20" })</code></pre>
<p><samp>200 OK</samp></p>`,
  },
  {
    id: "text-emphasis",
    title: "Text emphasis",
    category: "Primitives",
    covers: ["strong", "b", "em", "i", "small", "abbr", "p"],
    html: `<p>
  <strong>Strong</strong> and <em>emphasis</em>, <small>small print</small>,
  <abbr title="HyperText Markup Language">HTML</abbr>.
</p>`,
  },
  {
    id: "headings",
    title: "Headings",
    category: "Primitives",
    covers: ["h1", "h2", "h3", "h4", "h5", "h6"],
    html: `<h1>Easy to read</h1>
<h2>Easy to read</h2>
<h3>Easy to read</h3>
<h4>Easy to read</h4>
<h5>Easy to read</h5>
<h6>Easy to read</h6>`,
  },
  {
    id: "divider",
    title: "Divider",
    category: "Primitives",
    covers: ["hr"],
    html: `<p>Content above</p>
<hr />
<p>Content below</p>
<hr class="dashed" />`,
  },
  {
    id: "text-input",
    title: "Text input",
    category: "Primitives",
    covers: ["input", "textarea", "select"],
    html: `<label>
  Text input
  <input type="text" placeholder="Type here" />
</label>
<label>
  Invalid input
  <input type="text" aria-invalid="true" value="Something's off" />
</label>
<label>
  Success input
  <input type="text" aria-invalid="false" value="Everything is AWESOME!" />
</label>
<label>
  Warning
  <input type="text" placeholder="Must type the correct message..." />
</label>
<label>
  Textarea
  <textarea placeholder="Type something..."></textarea>
</label>
<label>
  Select
  <select>
    <option>Option A</option>
    <option>Option B</option>
  </select>
</label>`,
  },
  {
    id: "checkbox-radio",
    title: "Checkbox & Radio",
    category: "Primitives",
    covers: ["checkbox", "radio", "switch"],
    html: `<label><input type="checkbox" checked /> Checkbox</label>
<label><input type="checkbox" role="switch" checked /> Switch</label>
<label><input type="radio" name="ks-radio" checked /> Radio A</label>
<label><input type="radio" name="ks-radio" /> Radio B</label>`,
  },
  {
    id: "range",
    title: "Range",
    category: "Primitives",
    covers: [],
    html: `<label>
  Range
  <input type="range" />
</label>`,
  },
  {
    id: "progress",
    title: "Progress",
    category: "Primitives",
    covers: ["progress"],
    html: `<label>
  Progress
  <progress value="60" max="100"></progress>
</label>`,
  },
  {
    id: "file-input",
    title: "File input",
    category: "Primitives",
    covers: [],
    html: `<label>
  File
  <input type="file" />
</label>`,
  },
  {
    id: "form",
    title: "Form",
    category: "Primitives",
    covers: ["form", "fieldset", "label"],
    span: 2,
    html: `<form>
  <fieldset>
    <legend>Shipping address</legend>
    <label>
      Full name
      <input type="text" placeholder="Ada Lovelace" />
    </label>
  </fieldset>
</form>`,
  },
  {
    id: "hidden",
    title: "Hidden utility",
    category: "Primitives",
    covers: ["hidden"],
    html: `<p>Visible text</p>
<p hidden>Hidden text (via [hidden] or .hidden)</p>`,
  },
  {
    id: "light-dark",
    title: "light-dark()",
    category: "Feedback",
    covers: [],
    span: 2,
    html: `<p><code>mode: "auto"</code> emits every color token as <code>light-dark(light, dark)</code> instead of a separate <code>@media (prefers-color-scheme: dark)</code> block. Each box below forces its own <code>color-scheme</code> to prove both branches resolve, regardless of your system preference — try <code>mode: "auto"</code> in the toolbar at <a href="/components">/components</a> to see it with your own tokens.</p>
<div class="light-dark-demo">
  <div class="light-dark-demo-box" style="color-scheme: light">
    <span>color-scheme: light</span>
  </div>
  <div class="light-dark-demo-box" style="color-scheme: dark">
    <span>color-scheme: dark</span>
  </div>
</div>
<style>
  .light-dark-demo {
    display: flex;
    gap: var(--space-4);
  }
  .light-dark-demo-box {
    flex: 1;
    padding: var(--space-4);
    border-radius: var(--border-radius);
    background: light-dark(var(--primary-100), var(--primary-900));
    color: light-dark(var(--primary-900), var(--primary-100));
  }
</style>`,
  },
  {
    id: "glass",
    title: "Glass",
    category: "Surfaces",
    covers: ["glass"],
    html: `<div class="card glass">
  <div class="card-title">Frosted card</div>
  <p><code>.glass</code> adds <code>backdrop-filter: blur()</code> over a translucent background — falls back to a solid card where <code>backdrop-filter</code> isn't supported.</p>
</div>
<button class="btn glass">Glass button</button>`,
    preview: `<div style="background: linear-gradient(135deg, var(--primary-400), var(--secondary-500)); padding: var(--space-6); border-radius: var(--border-radius); display: flex; flex-direction: column; gap: var(--space-4); align-items: flex-start;">
  <div class="card glass">
    <div class="card-title">Frosted card</div>
    <p><code>.glass</code> adds <code>backdrop-filter: blur()</code> over a translucent background.</p>
  </div>
  <button class="btn glass">Glass button</button>
</div>`,
  },
  {
    id: "target-text",
    title: "Target text",
    category: "Feedback",
    covers: ["mark"],
    html: `<p id="target-text-demo">Open this page with <code>#target-text-demo:~:text=this%20sentence</code> in the URL — supported browsers style the matched text via <code>::target-text</code>, same treatment as <mark>this sentence</mark> and text selection. Safari doesn't support it yet — the fragment just scrolls into view with no highlight.</p>`,
  },
  {
    id: "editable",
    title: "Editable card",
    category: "Primitives",
    covers: ["card"],
    html: `<div class="card">
  <div class="card-title" style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-2)">
    Notes
    <button type="button" class="btn ghost square" aria-label="Edit" onclick="this.closest('.card').querySelector('.editable-demo').focus()">✎</button>
  </div>
  <div class="editable-demo" contenteditable="plaintext-only">Click the pencil, then type. <code>contenteditable="plaintext-only"</code> strips any pasted markup automatically — no rich-text risk, unlike <code>contenteditable="true"</code>.</div>
</div>
<style>
  .editable-demo {
    border-radius: var(--border-radius);
    padding: var(--space-2);
    outline: 0;
  }
  .editable-demo:focus {
    animation: editable-highlight 900ms ease-out;
  }
  @keyframes editable-highlight {
    from { background-color: color-mix(in oklch, var(--primary) 25%, transparent); }
    to { background-color: transparent; }
  }
</style>`,
  },
  {
    id: "gradient-property",
    title: "Animated gradients (@property)",
    category: "Surfaces",
    covers: ["card"],
    span: 3,
    html: `<div class="gradient-demo-row">
  <div class="card gradient-demo gradient-demo-1"><span>conic angle</span></div>
  <div class="card gradient-demo gradient-demo-2"><span>color-mix stop</span></div>
  <div class="card gradient-demo gradient-demo-3"><span>radial position</span></div>
</div>
<style>
  @property --angle-1 {
    syntax: "<angle>";
    inherits: false;
    initial-value: 0deg;
  }
  @property --mix-2 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 20%;
  }
  @property --pos-3 {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 30%;
  }
  .gradient-demo-row {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
  }
  .gradient-demo {
    width: 10rem;
    height: 6rem;
    display: flex;
    align-items: flex-end;
    color: white;
    text-shadow: 0 1px 2px oklch(0% 0 0 / 60%);
    font-size: 0.85em;
  }
  .gradient-demo-1 {
    background: conic-gradient(from var(--angle-1), var(--primary-400), var(--secondary-400), var(--neutral-400), var(--primary-400));
    transition: --angle-1 600ms ease;
  }
  .gradient-demo-1:hover {
    --angle-1: 360deg;
  }
  .gradient-demo-2 {
    background: linear-gradient(135deg, color-mix(in oklch, var(--primary-500) var(--mix-2), var(--secondary-500)), var(--neutral-800));
    transition: --mix-2 600ms ease;
  }
  .gradient-demo-2:hover {
    --mix-2: 80%;
  }
  .gradient-demo-3 {
    background: radial-gradient(circle at var(--pos-3) 50%, var(--primary-300), var(--secondary-700) 70%);
    transition: --pos-3 600ms ease;
  }
  .gradient-demo-3:hover {
    --pos-3: 70%;
  }
</style>`,
  },
  {
    id: "grid",
    title: "Grid",
    category: "Layout",
    covers: ["grid", "grid-cols-3", "col-span-1", "col-span-2", "col-span-full"],
    span: 2,
    html: `<div class="grid grid-cols-3" style="gap: var(--space-2)">
  <div class="card col-span-2">col-span-2</div>
  <div class="card">col-span-1</div>
  <div class="card">col-span-1</div>
  <div class="card">col-span-1</div>
  <div class="card col-span-full">col-span-full</div>
</div>`,
  },
];

const covered = new Set(COMPONENTS.flatMap((c) => c.covers));
export const UNCOVERED_FILES = DESIGN_FILES.filter((f) => {
  const tokens = [...f.classes, ...f.elements, ...f.attrs];
  if (tokens.length > 0 && tokens.every((t) => EXEMPT_ELEMENTS.includes(t))) return false;
  return !tokens.some((t) => covered.has(t));
}).map((f) => f.file);
