import { ComponentsShowcase } from "./ComponentsShowcase";

/** Toolbar/`LuzReact` never lived here either — see `DocsIsland`'s doc
 *  comment for why (the dynamic-vs-static CSS conflict applied here
 *  identically, and `LuzReact` is now retired from luz outright). A
 *  separate island component so the components page doesn't need the
 *  `Playground`/MDX-code plumbing `DocsIsland` carries. */
export function ComponentsIsland() {
  return <ComponentsShowcase />;
}
