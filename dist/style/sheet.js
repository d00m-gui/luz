import{a as l,b as d,c as n}from"../shared/chunk-cekdh3ge.js";import{d as o}from"../shared/chunk-6dv58rrf.js";function u(r){let{tokens:e,variables:S}=o(r),t=new CSSStyleSheet({media:"all"});t.replaceSync(`
		${l()};
    ${d(e)}
    :root {
      ${S}
    }
		${n(e)}
  `),console.log("[luz] \uD83C\uDFD7️ CSS StyleSheet"),document.adoptedStyleSheets=[t],document.addEventListener("DOMContentLoaded",()=>{console.log("[luz] \uD83C\uDFD7️ Ready to Show",document.readyState),document.querySelector("body")?.classList.add("luz-loaded")})}export{u as luzStyleSheet};
