import{b as l,c as d,d as n}from"../shared/chunk-vnwb157f.js";import{e as o}from"../shared/chunk-c7ccvmgn.js";function u(r){let{tokens:e,variables:S}=o(r),t=new CSSStyleSheet({media:"all"});t.replaceSync(`
		${n()};
    ${l(e)}
    :root {
      ${S}
    }
		${d(e)}
  `),console.log("[luz] \uD83C\uDFD7️ CSS StyleSheet"),document.adoptedStyleSheets=[t],document.addEventListener("DOMContentLoaded",()=>{console.log("[luz] \uD83C\uDFD7️ Ready to Show",document.readyState),document.querySelector("body")?.classList.add("luz-loaded")})}export{u as luzStyleSheet};
