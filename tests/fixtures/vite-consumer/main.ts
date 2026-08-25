// Real candidates for the utility-class scanner (`.ts` is one of the
// default scanned extensions — plain `.html` is not, so these class names
// live here rather than in `index.html`): `p-4`/`rounded` (scale/literal
// namespaces), `bg-primary-500` (color namespace), `open:bg-primary-600`
// (variant), plus a shadcn-bridge variable name (`bg-card`/
// `text-card-foreground`) that is NOT part of luz's closed utility
// vocabulary — expected to be dropped by the scanner while still being
// backed by the `--card`/`--card-foreground` aliases the shadcn bridge
// emits unconditionally.
const app = document.getElementById("app");
if (app) {
  app.innerHTML = `
    <div class="p-4 bg-primary-500 rounded open:bg-primary-600">
      <p class="bg-card text-card-foreground">shadcn-bridged surface</p>
    </div>
  `;
}
