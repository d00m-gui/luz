import { LuzReact } from "../../../src/react";
import { docsRuntimeConfig } from "../lib/docs-runtime-config";
import { AdminExample } from "./AdminExample";
import { Toolbar } from "./Toolbar";

/** Same shared-`<LuzReact>`-per-page shape as `ComponentsIsland`/`DocsIsland`
 *  (see their doc comments) — a separate island so this page's composed
 *  admin layout doesn't need the `ComponentsShowcase`/`Playground` plumbing. */
export function AdminIsland() {
  return (
    <LuzReact config={docsRuntimeConfig}>
      <AdminExample />
      <Toolbar />
    </LuzReact>
  );
}
