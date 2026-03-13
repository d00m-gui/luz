import{a as e}from"../shared/chunk-wm1ap0jw.js";import{b as m}from"../shared/chunk-e12dgsyd.js";import{c as r,d as s}from"../shared/chunk-2t2cx6pn.js";import{e as t}from"../shared/chunk-c7ccvmgn.js";import{writeFileSync as p}from"node:fs";var h=(n)=>{return{name:"luz",hooks:{"astro:server:setup":()=>{let{variables:u,tokens:o}=t(n),i=`
						${m()}
						${s(o)}
						:root {
							${u}
						}
						${r(o)}
						`,c=e(i),a="./src/styles/luz.css";p("./src/styles/luz.css",c,{encoding:"utf-8"}),console.log("[luz] CSS created @ './src/styles/luz.css'")}}}};export{h as luzAstro};
