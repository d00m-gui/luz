import{a as l,b as d,c as n}from"../shared/chunk-63xgbpaj.js";import{g as t}from"../shared/chunk-deahqve8.js";function m(r){let{tokens:e,variables:S}=t(r),o=new CSSStyleSheet({media:"all"});o.replaceSync(`
		${l()};
    ${d(e)}
    :root {
      ${S}
    }
		${n(e)}
  `),console.log("[luz] \uD83C\uDFD7️ CSS StyleSheet"),document.adoptedStyleSheets=[o],document.addEventListener("DOMContentLoaded",()=>{console.log("[luz] \uD83C\uDFD7️ Ready to Show",document.readyState),document.querySelector("body")?.classList.add("luz-loaded")})}export{m as luzStyleSheet};
