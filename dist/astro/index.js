import{a as m}from"../shared/chunk-wm1ap0jw.js";import{b as s,c as e,d as n}from"../shared/chunk-vnwb157f.js";import{e as r}from"../shared/chunk-c7ccvmgn.js";import{writeFileSync as a}from"node:fs";var v=(i)=>{return{name:"luz",hooks:{"astro:server:setup":()=>{let{variables:c,tokens:o}=r(i),p=`
						${n()}
						${s(o)}
						:root {
							${c}
						}
						${e(o)}
						`,u=m(p),t=o.path??"./src/styles/luz.css";a(t,u,{encoding:"utf-8"}),console.log(`[luz] CSS created @ '${t}'`)}}}};export{v as luzAstro};
