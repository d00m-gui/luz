import { a as u } from "../shared/chunk-wm1ap0jw.js";
import { b as m } from "../shared/chunk-e12dgsyd.js";
import { c as e, d as s } from "../shared/chunk-2t2cx6pn.js";
import { e as r } from "../shared/chunk-c7ccvmgn.js";
var P = (t) => {
  let { variables: a, tokens: o } = r(t),
    p = t.path ?? "./";
  return {
    name: "luz",
    setup(i) {
      i.onEnd(async () => {
        let l = `
					${m()}
					${s(o)}
					:root {
						${a}
					}
					${e(o)}`,
          c = u(l),
          n = `${p}/luz.css`;
        (await Bun.write(n, c), console.log(`[luz] CSS created @ '${n}'`));
      });
    },
  };
};
export { P as luzPlugin };
