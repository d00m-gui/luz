import { b as n } from "../shared/chunk-e12dgsyd.js";
import { c as l, d } from "../shared/chunk-2t2cx6pn.js";
import { e as o } from "../shared/chunk-c7ccvmgn.js";
function u(r) {
  let { tokens: e, variables: S } = o(r),
    t = new CSSStyleSheet({ media: "all" });
  (t.replaceSync(`
		${n()};
    ${d(e)}
    :root {
      ${S}
    }
		${l(e)}
  `),
    console.log("[luz] \uD83C\uDFD7️ CSS StyleSheet"),
    (document.adoptedStyleSheets = [t]),
    document.addEventListener("DOMContentLoaded", () => {
      (console.log("[luz] \uD83C\uDFD7️ Ready to Show", document.readyState),
        document.querySelector("body")?.classList.add("luz-loaded"));
    }));
}
export { u as luzStyleSheet };
