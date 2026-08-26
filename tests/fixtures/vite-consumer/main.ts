// Real candidates for the utility-class scanner (`.ts` is one of the
// default scanned extensions — plain `.html` is not, so these class names
// live here rather than in `index.html`): `p-4`/`rounded` (scale/literal
// namespaces), `bg-primary-500` (color namespace), `open:bg-primary-600`
// (variant), a shadcn-bridge variable name (`bg-card`/
// `text-card-foreground`) — not a `{family}-{weight}` palette shade, but
// still part of the closed vocabulary via the `bridge-color` namespace (see
// `BRIDGE_COLOR_NAMES` in `utilities.ts`), so it resolves against the
// `--card`/`--card-foreground` aliases the shadcn bridge emits
// unconditionally — plus `w-[137px]`, genuinely outside the closed
// vocabulary (arbitrary/bracket values are never supported, see README's
// "Utility classes" section), which must be dropped silently.
const app = document.getElementById("app");
if (app) {
  app.innerHTML = `
    <div class="p-4 bg-primary-500 rounded open:bg-primary-600 w-[137px]">
      <p class="bg-card text-card-foreground">shadcn-bridged surface</p>
    </div>
  `;
}
