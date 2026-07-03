import { luz, type LuzConfig } from "../luz";
import { base } from "../tools/base";
import { reset } from "../tools/reset";
import { setup } from "../tools/setup";

export function luzStyleSheet(config?: LuzConfig): void {
  const { tokens, variables } = luz(config);
  const luzSheet = new CSSStyleSheet({ media: "all" });
  luzSheet.replaceSync(
    `
		${reset()};
    ${setup(tokens)}
    :root {
      ${variables}
    }
		${base(tokens)}
  `,
  );
  console.log(`[luz] 🏗️ CSS StyleSheet`);
  document.adoptedStyleSheets = [luzSheet];
  document.addEventListener("DOMContentLoaded", () => {
    console.log(`[luz] 🏗️ Ready to Show`, document.readyState);
    document.querySelector("body")?.classList.add("luz-loaded");
  });
}
